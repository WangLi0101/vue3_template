import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/http";

export type HttpResponse<T> = AxiosResponse<ApiResponse<T>>;
export type RequestConfig<D> = Omit<AxiosRequestConfig<D>, "url" | "baseURL">;

export type DownloadResponseType = "blob" | "arraybuffer";

export type DownloadDataMap = {
  blob: Blob;
  arraybuffer: ArrayBuffer;
};

export type DownloadRequestConfig<D, R extends DownloadResponseType> = RequestConfig<D> & {
  responseType: R;
};

export const isDownloadResponseType = (
  responseType: AxiosRequestConfig["responseType"],
): responseType is DownloadResponseType => {
  return responseType === "blob" || responseType === "arraybuffer";
};
