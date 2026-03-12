import { getCurrentScope, onScopeDispose, shallowRef } from "vue";

interface UseCopyOptions {
  resetAfter?: number;
}

const DEFAULT_RESET_AFTER = 2000;

// 统一转换复制异常，保证外部拿到 Error 实例。
const toCopyError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  return new Error("复制失败");
};

// 在不支持 Clipboard API 时，回退到 textarea + execCommand 的复制方案。
const fallbackCopy = (text: string): boolean => {
  if (typeof document === "undefined" || !document.body) {
    return false;
  }

  // 兼容不支持 Clipboard API 的环境。
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  return copied;
};

// 创建剪贴板复制能力，并暴露复制状态与重置方法。
export const useCopy = (options: UseCopyOptions = {}) => {
  const copied = shallowRef(false);
  const copying = shallowRef(false);
  const error = shallowRef<Error | null>(null);

  let resetTimer: ReturnType<typeof setTimeout> | null = null;

  // 清理复制成功状态的定时器，避免重复计时和组件销毁后的残留任务。
  const clearResetTimer = (): void => {
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }
  };

  // 重置复制状态和错误信息，供外部主动恢复初始状态。
  const reset = (): void => {
    clearResetTimer();
    copied.value = false;
    error.value = null;
  };

  // 在成功复制后安排状态自动恢复，避免成功标记长期停留。
  const scheduleReset = (): void => {
    const delay = options.resetAfter ?? DEFAULT_RESET_AFTER;
    if (delay <= 0) {
      return;
    }

    clearResetTimer();
    resetTimer = setTimeout(() => {
      copied.value = false;
      resetTimer = null;
    }, delay);
  };

  // 执行复制逻辑，优先使用 Clipboard API，失败时返回 false 并记录错误。
  const copy = async (text: string): Promise<boolean> => {
    if (typeof navigator === "undefined") {
      error.value = new Error("当前环境不支持复制");
      copied.value = false;
      return false;
    }

    copying.value = true;
    error.value = null;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (!fallbackCopy(text)) {
        throw new Error("当前环境不支持复制");
      }

      copied.value = true;
      scheduleReset();
      return true;
    } catch (reason) {
      copied.value = false;
      error.value = toCopyError(reason);
      return false;
    } finally {
      copying.value = false;
    }
  };

  if (getCurrentScope()) {
    onScopeDispose(clearResetTimer);
  }

  return {
    copied,
    copying,
    error,
    copy,
    reset,
  };
};
