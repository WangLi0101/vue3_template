import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import { SERVICE_URL_MAP } from "@/config/api";
import type { ServiceName } from "@/config/api";
import { store } from "@/stores";
import { useAuthStore } from "@/stores/modules/auth";
import type { ApiResponse } from "@/types/http";
import { ApiRequestError } from "@/types/http";
import { formatToken, getAccessToken, getRefreshToken } from "@/utils/token";
import { handlerError } from "./code";
import type {
  DownloadDataMap,
  DownloadRequestConfig,
  DownloadResponseType,
  RequestConfig,
} from "./types";
import { isDownloadResponseType } from "./types";

interface RetryRequestConfig<D = unknown> extends InternalAxiosRequestConfig<D> {
  // 标记当前请求是否已经完成过一次自动重试，避免 40102 时重复刷新。
  _retry?: boolean;
  // 公开接口不自动携带 accessToken，也不参与自动刷新流程。
  isPublic?: boolean;
}

class HttpClient {
  private readonly refreshPath = "/auth/refresh";
  // 多个请求同时遇到 token 失效时，共用同一个刷新任务，避免重复刷新。
  private refreshAccessTokenPromise: Promise<string> | null = null;
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000,
    });
    this.setupInterceptors();
  }

  private isMatchedPath(url: string | undefined, path: string): boolean {
    return Boolean(url && url.endsWith(path));
  }

  private isRefreshRequest(url: string | undefined): boolean {
    return this.isMatchedPath(url, this.refreshPath);
  }

  private isPublicRequest(config?: Pick<RetryRequestConfig, "isPublic">): boolean {
    return Boolean(config?.isPublic);
  }

  // 统一处理 Authorization 头，兼容 AxiosHeaders 和普通对象两种写法。
  private applyAuthorizationHeader(
    config: InternalAxiosRequestConfig,
    token: string,
  ): InternalAxiosRequestConfig {
    const formattedToken = formatToken(token);

    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", formattedToken);
      return config;
    }

    config.headers.Authorization = formattedToken;
    return config;
  }

  private attachAuthorization = (
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig => {
    // 登录、刷新 token 等公开接口跳过鉴权头注入。
    if (this.isPublicRequest(config as RetryRequestConfig)) {
      return config;
    }

    const token = getAccessToken();
    if (!token) {
      return config;
    }

    return this.applyAuthorizationHeader(config, token);
  };

  private async refreshTokenByStore(): Promise<string> {
    return useAuthStore(store).refreshToken();
  }

  private refreshAccessToken(): Promise<string> {
    // 只要刷新任务还在进行，后续请求直接复用这次刷新结果。
    if (!this.refreshAccessTokenPromise) {
      this.refreshAccessTokenPromise = this.refreshTokenByStore().finally(() => {
        this.refreshAccessTokenPromise = null;
      });
    }

    return this.refreshAccessTokenPromise;
  }

  private async logoutByStore(): Promise<void> {
    await useAuthStore(store).logoutLocal();
  }

  private shouldRefreshByCode(code: number, config?: RetryRequestConfig): boolean {
    return (
      code === 40102 &&
      !config?._retry &&
      !this.isPublicRequest(config) &&
      Boolean(getRefreshToken())
    );
  }

  // 业务码触发刷新后，重放原请求并返回新的响应结果。
  private async tryRefreshAndReplay<T>(
    response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
    config?: RetryRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer> | null> {
    if (!config || !this.shouldRefreshByCode((response.data as ApiResponse<T>).code, config)) {
      return null;
    }

    try {
      const nextAccessToken = await this.refreshAccessToken();
      config._retry = true;
      // 刷新成功后，给原请求补上新 token 并重放一次。
      this.applyAuthorizationHeader(config, nextAccessToken);
      return (await this.axiosInstance.request(config)) as AxiosResponse<
        ApiResponse<T> | Blob | ArrayBuffer
      >;
    } catch (_refreshError) {
      // refreshToken 也失效时，统一清理会话并回到登录态。
      await this.logoutByStore();
      return null;
    }
  }

  private async handleBusinessError<T>(
    payload: ApiResponse<T>,
    config?: RetryRequestConfig,
  ): Promise<void> {
    if (payload.code === 40102 && !this.isPublicRequest(config)) {
      await this.logoutByStore();
    }

    handlerError(payload, {
      silent: this.isRefreshRequest(config?.url),
    });
  }

  private handleResponseSuccess = async <T>(
    response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
  ): Promise<AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>> => {
    // 下载类响应直接返回，由调用方自行处理，不参与业务 code 判断。
    if (isDownloadResponseType(response.config.responseType)) {
      return response;
    }

    const payload = response.data;
    if (payload instanceof Blob || payload instanceof ArrayBuffer) {
      return response;
    }

    if (payload.code === 0) {
      return response;
    }

    const originalRequest = response.config as RetryRequestConfig | undefined;
    const replayedResponse = await this.tryRefreshAndReplay(response, originalRequest);
    if (replayedResponse) {
      return replayedResponse;
    }

    await this.handleBusinessError(payload, originalRequest);
    return response;
  };

  private handleResponseError = async (error: AxiosError<ApiResponse<unknown>>) => {
    const businessCode = error.response?.data?.code ?? -1;
    const httpStatus = error.response?.status ?? 0;
    const message = error.response?.data?.message || error.message || "网络请求失败";
    ElMessage.error({
      message,
      duration: 3000,
      type: "error",
      grouping: true,
    });

    return Promise.reject(new ApiRequestError(message, businessCode, httpStatus));
  };

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(this.attachAuthorization);
    this.axiosInstance.interceptors.response.use(
      this.handleResponseSuccess,
      this.handleResponseError,
    );
  }

  public requestByService<T, D = unknown>(
    url: string,
    serviceName: ServiceName,
    config?: RequestConfig<D>,
  ): Promise<ApiResponse<T>>;

  public requestByService<D = unknown, R extends DownloadResponseType = DownloadResponseType>(
    url: string,
    serviceName: ServiceName,
    config: DownloadRequestConfig<D, R>,
  ): Promise<DownloadDataMap[R]>;

  public requestByService<T, D = unknown, R extends DownloadResponseType = DownloadResponseType>(
    url: string,
    serviceName: ServiceName,
    config: RequestConfig<D> | DownloadRequestConfig<D, R> = {},
  ): Promise<ApiResponse<T> | DownloadDataMap[R]> {
    // 业务层只需要传服务名，底层在这里统一映射成真实的 baseURL。
    const baseURL = SERVICE_URL_MAP[serviceName];
    if (!baseURL) {
      return Promise.reject(new ApiRequestError("未配置服务地址", -1));
    }

    return this.axiosInstance
      .request<
        ApiResponse<T> | DownloadDataMap[R],
        AxiosResponse<ApiResponse<T> | DownloadDataMap[R]>,
        D
      >({
        ...config,
        url,
        baseURL,
      })
      .then((response) => {
        if (isDownloadResponseType(response.config.responseType)) {
          return response.data as DownloadDataMap[R];
        }

        return response.data as ApiResponse<T>;
      });
  }
}

export const http = new HttpClient();
