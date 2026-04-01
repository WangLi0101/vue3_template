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

interface HandlerErrorOptions {
  silent?: boolean;
}

// 逻辑状态码
export const handlerError = <T>(payload: ApiResponse<T>, options?: HandlerErrorOptions) => {
  if (options?.silent) {
    return;
  }

  switch (payload.code) {
    default:
      showMessage(payload.message);
      break;
  }
};
