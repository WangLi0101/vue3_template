import type { AxiosResponse } from "axios";
import { ApiRequestError, type ApiResponse } from "@/types/http";
import { SERVICE_URL_MAP, type ServiceName } from "@/utils/http/config";
import { http } from "./client";
import {
  type DownloadDataMap,
  type DownloadRequestConfig,
  type DownloadResponseType,
  type RequestConfig,
  isDownloadResponseType,
} from "./types";

export function request<T, D = unknown>(
  url: string,
  serviceName: ServiceName,
  config?: RequestConfig<D>,
): Promise<ApiResponse<T>>;

export function request<D = unknown, R extends DownloadResponseType = DownloadResponseType>(
  url: string,
  serviceName: ServiceName,
  config: DownloadRequestConfig<D, R>,
): Promise<DownloadDataMap[R]>;

export function request<T, D = unknown, R extends DownloadResponseType = DownloadResponseType>(
  url: string,
  serviceName: ServiceName,
  config: RequestConfig<D> | DownloadRequestConfig<D, R> = {},
): Promise<ApiResponse<T> | DownloadDataMap[R]> {
  const baseURL = SERVICE_URL_MAP[serviceName];
  if (!baseURL) {
    return Promise.reject(new ApiRequestError("未配置服务地址", 0, -1));
  }

  return http
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
