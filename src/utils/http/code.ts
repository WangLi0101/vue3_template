import { ElMessage } from "element-plus";
import type { ApiResponse } from "@/types/http";
const showMessage = (message: string) => {
  ElMessage.error({
    message,
    duration: 3000,
    type: "error",
    grouping: true,
  });
};

// 逻辑状态码
export const handlerError = <T>(payload: ApiResponse<T>) => {
  switch (payload.code) {
    default:
      showMessage(payload.message);
      break;
  }
};

// http状态码
export const handlerHttpError = (code: number, message: string) => {
  switch (code) {
    default:
      showMessage(message);
      break;
  }
};
