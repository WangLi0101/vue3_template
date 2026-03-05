import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  appThemeConfig,
  type ResolvedThemeMode,
  type ThemeMode,
  type ThemeSemanticVars,
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

// 规范化颜色值，支持 #RGB / #RRGGBB，统一输出 #RRGGBB
const normalizeHexColor = (value: string): string | null => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  const fullHexPattern = /^#[0-9a-f]{6}$/i;
  if (fullHexPattern.test(normalized)) {
    return normalized;
  }

  const shortHexPattern = /^#[0-9a-f]{3}$/i;
  if (!shortHexPattern.test(normalized)) {
    return null;
  }

  const [r, g, b] = normalized.slice(1).split("");
  return `#${r}${r}${g}${g}${b}${b}`;
};

// 十六进制颜色转 RGB 通道
const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = normalizeHexColor(hex) || appThemeConfig.defaultPrimaryColor;
  const value = Number.parseInt(normalized.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return [r, g, b];
};

// 按权重混合颜色，生成 Element Plus 所需的亮色/暗色派生变量
const mixColors = (base: string, mixin: string, weight: number): string => {
  const clampedWeight = Math.max(0, Math.min(1, weight));
  const [r1, g1, b1] = hexToRgb(base);
  const [r2, g2, b2] = hexToRgb(mixin);
  const r = Math.round(r1 * (1 - clampedWeight) + r2 * clampedWeight);
  const g = Math.round(g1 * (1 - clampedWeight) + g2 * clampedWeight);
  const b = Math.round(b1 * (1 - clampedWeight) + b2 * clampedWeight);

  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
};

// 写入根节点 CSS 变量
const setRootVar = (name: string, value: string): void => {
  document.documentElement.style.setProperty(name, value);
};

// 批量应用语义化主题变量
const applySemanticVars = (vars: ThemeSemanticVars): void => {
  Object.entries(vars).forEach(([name, value]) => {
    setRootVar(name, value);
  });
};

// 持久化主题设置
const persistThemeState = (state: PersistedThemeState): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(appThemeConfig.storageKey, JSON.stringify(state));
};

// 读取并校验持久化主题设置
const readThemeState = (): PersistedThemeState | null => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(appThemeConfig.storageKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedThemeState>;
    const mode = isThemeMode(parsed.mode)
      ? parsed.mode
      : appThemeConfig.defaultMode;
    const primaryColor =
      normalizeHexColor(parsed.primaryColor || "") ||
      appThemeConfig.defaultPrimaryColor;

    return { mode, primaryColor };
  } catch {
    return null;
  }
};

export const useThemeStore = defineStore("theme", () => {
  // 用户配置模式（可为 system）
  const mode = ref<ThemeMode>(appThemeConfig.defaultMode);
  // 用户选择主题色
  const primaryColor = ref<string>(appThemeConfig.defaultPrimaryColor);
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
    applySemanticVars(appThemeConfig.semanticVars[resolvedMode.value]);
  };

  // 应用主题色到全局 CSS 变量与 Element Plus 变量
  const applyPrimaryToDom = (): void => {
    if (typeof document === "undefined") return;

    const normalizedColor =
      normalizeHexColor(primaryColor.value) || appThemeConfig.defaultPrimaryColor;
    if (normalizedColor !== primaryColor.value) {
      primaryColor.value = normalizedColor;
    }

    const [r, g, b] = hexToRgb(normalizedColor);
    setRootVar("--app-primary", normalizedColor);
    setRootVar("--app-primary-rgb", `${r} ${g} ${b}`);

    // Element Plus 主色及其明暗梯度变量
    setRootVar("--el-color-primary", normalizedColor);
    setRootVar(
      "--el-color-primary-light-3",
      mixColors(normalizedColor, "#ffffff", 0.3),
    );
    setRootVar(
      "--el-color-primary-light-5",
      mixColors(normalizedColor, "#ffffff", 0.5),
    );
    setRootVar(
      "--el-color-primary-light-7",
      mixColors(normalizedColor, "#ffffff", 0.7),
    );
    setRootVar(
      "--el-color-primary-light-8",
      mixColors(normalizedColor, "#ffffff", 0.8),
    );
    setRootVar(
      "--el-color-primary-light-9",
      mixColors(normalizedColor, "#ffffff", 0.9),
    );
    setRootVar(
      "--el-color-primary-dark-2",
      mixColors(normalizedColor, "#000000", 0.2),
    );
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
