import { ElMessage } from "element-plus";

export const showErrorToast = (message: string) => {
  ElMessage.error({
    message,
    duration: 3000,
    grouping: true,
  });
};

export const showToast = (
  type: "success" | "warning" | "info" | "error",
  message: string,
  duration = 3000,
) => {
  ElMessage({
    message,
    type,
    duration,
    grouping: true,
  });
};
