import { ElMessage } from "element-plus";
import type { ApiResponse } from "@/types/http";

export const handlerError = <T>(payload: ApiResponse<T>) => {
  switch (payload.code) {
    case 0:
      break;
    default:
      ElMessage.error(payload.message || "业务请求失败");
      break;
  }
};
