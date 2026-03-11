import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  buildElementPlusPrimaryCssVars,
  buildPrimaryCssVars,
  buildSemanticCssVars,
  normalizeHexColor,
  themeDefaults,
  themePersistence,
  themeSemanticTokensByMode,
  type ResolvedThemeMode,
  type ThemeMode,
} from "@/config/theme";

// 本地持久化数据结构
interface PersistedThemeState {
  mode: ThemeMode;
  primaryColor: string;
}

// 校验主题模式是否合法
const isThemeMode = (value: unknown): value is ThemeMode => {
  return value === "light" || value === "dark" || value === "system";
};

// 写入根节点 CSS 变量
const setRootVar = (name: string, value: string): void => {
  document.documentElement.style.setProperty(name, value);
};

// 批量应用 CSS 变量
const applyCssVars = (vars: Record<string, string>): void => {
  Object.entries(vars).forEach(([name, value]) => {
    setRootVar(name, value);
  });
};

// 持久化主题设置
const persistThemeState = (state: PersistedThemeState): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(themePersistence.storageKey, JSON.stringify(state));
};

// 读取并校验持久化主题设置
const readThemeState = (): PersistedThemeState | null => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(themePersistence.storageKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedThemeState>;
    const mode = isThemeMode(parsed.mode) ? parsed.mode : themeDefaults.mode;
    const primaryColor = normalizeHexColor(parsed.primaryColor || "") || themeDefaults.primaryColor;

    return { mode, primaryColor };
  } catch {
    return null;
  }
};

export const useThemeStore = defineStore("theme", () => {
  // 用户配置模式（可为 system）
  const mode = ref<ThemeMode>(themeDefaults.mode);
  // 用户选择主题色
  const primaryColor = ref<string>(themeDefaults.primaryColor);
  // 系统是否偏好深色（由 matchMedia 维护）
  const systemPrefersDark = ref(false);
  // 缓存媒体查询对象，便于后续扩展/清理
  let mediaQuery: MediaQueryList | null = null;

  // 实际生效模式：只会是 light / dark
  const resolvedMode = computed<ResolvedThemeMode>(() => {
    if (mode.value === "system") {
      return systemPrefersDark.value ? "dark" : "light";
    }
    return mode.value;
  });

  // 当前是否为深色模式
  const isDark = computed<boolean>(() => resolvedMode.value === "dark");

  // 应用模式到 DOM（class + data-theme + 语义变量）
  const applyModeToDom = (): void => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", isDark.value);
    root.setAttribute("data-theme", resolvedMode.value);
    applyCssVars(buildSemanticCssVars(themeSemanticTokensByMode[resolvedMode.value]));
  };

  // 应用主题色到全局 CSS 变量与 Element Plus 变量
  const applyPrimaryToDom = (): void => {
    if (typeof document === "undefined") return;

    const normalizedColor = normalizeHexColor(primaryColor.value) || themeDefaults.primaryColor;
    if (normalizedColor !== primaryColor.value) {
      primaryColor.value = normalizedColor;
    }

    applyCssVars({
      ...buildPrimaryCssVars(normalizedColor),
      ...buildElementPlusPrimaryCssVars(normalizedColor),
    });
  };

  // 一次性应用完整主题
  const applyTheme = (): void => {
    applyModeToDom();
    applyPrimaryToDom();
  };

  // 设置模式并持久化
  const setMode = (nextMode: ThemeMode): void => {
    mode.value = nextMode;
    applyModeToDom();
    persistThemeState({
      mode: mode.value,
      primaryColor: primaryColor.value,
    });
  };

  // 设置主色并持久化
  const setPrimaryColor = (color: string): void => {
    const normalizedColor = normalizeHexColor(color);
    if (!normalizedColor) return;

    primaryColor.value = normalizedColor;
    applyPrimaryToDom();
    persistThemeState({
      mode: mode.value,
      primaryColor: primaryColor.value,
    });
  };

  // 初始化主题：读取系统偏好、加载缓存、注册系统主题监听
  const initTheme = (): void => {
    if (typeof window === "undefined") return;

    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    systemPrefersDark.value = mediaQuery.matches;

    const onMediaQueryChange = (event: MediaQueryListEvent): void => {
      systemPrefersDark.value = event.matches;
      if (mode.value === "system") {
        applyModeToDom();
      }
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onMediaQueryChange);
    } else {
      // 兼容旧版浏览器 API
      mediaQuery.addListener(onMediaQueryChange);
    }

    const persistedTheme = readThemeState();
    if (persistedTheme) {
      mode.value = persistedTheme.mode;
      primaryColor.value = persistedTheme.primaryColor;
    }

    applyTheme();
    persistThemeState({
      mode: mode.value,
      primaryColor: primaryColor.value,
    });
  };

  // 暴露状态与行为
  return {
    mode,
    primaryColor,
    resolvedMode,
    isDark,
    setMode,
    setPrimaryColor,
    initTheme,
  };
});
