/**
 * 去除所有空格
 */
export function removeAllSpace(str: string): string {
  return str.replace(/\s/g, "");
}

/**
 * 文件下载
 */
export function downloadFile(url: string, fileName?: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * blob文件下载
 */
export function downloadFileByBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  downloadFile(url, fileName);
  URL.revokeObjectURL(url);
}

/**
 * File转Url
 */
export function fileToUrl(file: File) {
  return URL.createObjectURL(file);
}
