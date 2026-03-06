import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";
import { ApiRequestError, type ApiResponse } from "@/types/http";
import { SERVICE_URL_MAP, type ServiceName } from "@/utils/http/config";
import { getToken } from "@/utils/token";

type HttpResponse<T> = AxiosResponse<ApiResponse<T>>;
type RequestConfig<D> = Omit<AxiosRequestConfig<D>, "url" | "baseURL">;

const http = axios.create({
  timeout: 10000,
});

const attachAuthorization = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = getToken();
  if (!token) {
    return config;
  }

  if (typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

http.interceptors.request.use(attachAuthorization);

http.interceptors.response.use(
  <T>(response: HttpResponse<T>): HttpResponse<T> => {
    const payload = response.data;
    if (!payload || typeof payload.code !== "number") {
      throw new ApiRequestError("响应数据格式错误", response.status, -1);
    }

    if (payload.code !== 0) {
      ElMessage.error(payload.message || "业务请求失败");
    }

    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const httpStatus = error.response?.status ?? 0;
    const businessCode = error.response?.data?.code ?? -1;
    const message =
      error.response?.data?.message || error.message || "网络请求失败";

    return Promise.reject(
      new ApiRequestError(message, httpStatus, businessCode),
    );
  },
);

const unwrapResponse = <T>(response: HttpResponse<T>): ApiResponse<T> => {
  return response.data;
};

export const request = <T, D = unknown>(
  url: string,
  serviceName: ServiceName,
  config: RequestConfig<D> = {},
): Promise<ApiResponse<T>> => {
  const baseURL = SERVICE_URL_MAP[serviceName];
  if (!baseURL) {
    return Promise.reject(new ApiRequestError("未配置服务地址", 0, -1));
  }

  return http
    .request<ApiResponse<T>, HttpResponse<T>, D>({
      ...config,
      url,
      baseURL,
    })
    .then(unwrapResponse);
};

export { http };
