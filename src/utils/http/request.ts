import type { ServiceName } from "@/config/api";
import type {
  DownloadDataMap,
  DownloadRequestConfig,
  DownloadResponseType,
  RequestConfig,
} from "./types";
import type { ApiResponse } from "@/types/http";
import { http } from "./client";

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
  return http.requestByService(
    url,
    serviceName,
    config as RequestConfig<D> & DownloadRequestConfig<D, R>,
  ) as Promise<ApiResponse<T> | DownloadDataMap[R]>;
}
