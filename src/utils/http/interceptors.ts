import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/types/http";
import { ApiRequestError } from "@/types/http";
import { formatToken, getToken } from "@/utils/token";
import { handlerError, handlerHttpError } from "./code";
import { isDownloadResponseType } from "./types";

const attachAuthorization = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getToken();
  if (!token) {
    return config;
  }
  const formattedToken = formatToken(token);

  if (typeof config.headers.set === "function") {
    config.headers.set("Authorization", formattedToken);
    return config;
  }

  config.headers.Authorization = formattedToken;
  return config;
};

const isBusinessPayload = (value: unknown): value is ApiResponse<unknown> => {
  if (!value || typeof value !== "object") {
    return false;
  }
  return "code" in value && typeof (value as { code: unknown }).code === "number";
};

const handleResponseSuccess = <T>(
  response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
): AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer> => {
  if (isDownloadResponseType(response.config.responseType)) {
    return response;
  }

  const payload = response.data;
  if (payload instanceof Blob || payload instanceof ArrayBuffer) {
    return response;
  }
  if (!isBusinessPayload(payload)) {
    throw new ApiRequestError("响应数据格式错误", response.status, -1);
  }
  if (payload.code !== 0) {
    handlerError(payload);
  }
  return response;
};

const handleResponseError = (error: AxiosError<ApiResponse<unknown>>) => {
  const httpStatus = error.response?.status ?? 0;
  const businessCode = error.response?.data?.code ?? -1;
  const message = error.response?.data?.message || error.message || "网络请求失败";

  handlerHttpError(httpStatus, message);
  return Promise.reject(new ApiRequestError(message, httpStatus, businessCode));
};

export const setupHttpInterceptors = (http: AxiosInstance) => {
  http.interceptors.request.use(attachAuthorization);
  http.interceptors.response.use(handleResponseSuccess, handleResponseError);
};
