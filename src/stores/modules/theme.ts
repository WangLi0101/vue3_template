import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  findThemePrimaryPresetByPrimary,
  resolveThemePrimaryPreset,
  themeDefaults,
  themePersistence,
  themeSemanticTokensByMode,
} from "@/config/theme";
import {
  buildPrimaryCssVars,
  buildElementPlusBorderCssVars,
  buildElementPlusPrimaryCssVars,
  buildSemanticCssVars,
  normalizeHexColor,
} from "@/config/theme/utils";
import type { ResolvedThemeMode, ThemeMode } from "@/config/theme/types";

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

export const useThemeStore = defineStore(
  "theme",
  () => {
    // 用户配置模式（可为 system）
    const mode = ref<ThemeMode>(themeDefaults.mode);
    // 用户选择主题预设
    const presetKey = ref<string>(themeDefaults.presetKey);
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
    const currentPreset = computed(() => resolveThemePrimaryPreset(presetKey.value));
    const elementCssVars = computed(() => currentPreset.value.cssVars);
    const primaryColor = computed<string>(() => currentPreset.value.cssVars["--el-color-primary"]);

    // 应用模式到 DOM（class + data-theme + 语义变量）
    const applyModeToDom = (): void => {
      if (typeof document === "undefined") return;
      const root = document.documentElement;
      root.classList.toggle("dark", isDark.value);
      root.setAttribute("data-theme", resolvedMode.value);
      const semanticTokens = themeSemanticTokensByMode[resolvedMode.value];
      applyCssVars({
        ...buildSemanticCssVars(semanticTokens),
        ...buildElementPlusBorderCssVars(semanticTokens),
      });
    };

    // 应用品牌色到全局 CSS 变量与 Element Plus 变量
    const applyBrandToDom = (): void => {
      if (typeof document === "undefined") return;

      applyCssVars({
        ...buildPrimaryCssVars(elementCssVars.value),
        ...buildElementPlusPrimaryCssVars(elementCssVars.value),
      });
    };

    // 一次性应用完整主题
    const applyTheme = (): void => {
      applyModeToDom();
      applyBrandToDom();
    };

    // 设置模式并应用到 DOM
    const setMode = (nextMode: ThemeMode): void => {
      mode.value = isThemeMode(nextMode) ? nextMode : themeDefaults.mode;
      applyModeToDom();
    };

    // 设置主题预设并应用到 DOM
    const setThemePreset = (nextPresetKey: string): void => {
      presetKey.value = resolveThemePrimaryPreset(nextPresetKey).key;
      applyBrandToDom();
    };

    // 设置主色，兼容旧调用方式
    const setPrimaryColor = (color: string): void => {
      const normalizedColor = normalizeHexColor(color);
      if (!normalizedColor) return;
      const matchedPreset = findThemePrimaryPresetByPrimary(normalizedColor);
      if (!matchedPreset) return;
      setThemePreset(matchedPreset.key);
    };

    // 初始化主题：读取系统偏好、校验持久化状态、注册系统主题监听
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

      mode.value = isThemeMode(mode.value) ? mode.value : themeDefaults.mode;
      presetKey.value = resolveThemePrimaryPreset(presetKey.value).key;

      applyTheme();
    };

    // 暴露状态与行为
    return {
      mode,
      presetKey,
      currentPreset,
      elementCssVars,
      primaryColor,
      resolvedMode,
      isDark,
      setMode,
      setThemePreset,
      setPrimaryColor,
      initTheme,
    };
  },
  {
    persist: {
      key: themePersistence.storageKey,
      pick: ["mode", "presetKey"],
    },
  },
);
