import { ElMessage } from "element-plus";
import type { ApiResponse } from "@/types/http";

export const showErrorMessage = (message: string) => {
  ElMessage.error({
    message,
    duration: 3000,
    grouping: true,
  });
};

interface HandlerErrorOptions {
  silent?: boolean;
}
export const CODE = {
  TOKEN_EXPIRED: 401105,
} as const;

// 逻辑状态码
export const handlerError = <T>(payload: ApiResponse<T>, options?: HandlerErrorOptions) => {
  if (options?.silent) {
    return;
  }

  switch (payload.code) {
    default:
      showErrorMessage(payload.message);
      break;
  }
};
