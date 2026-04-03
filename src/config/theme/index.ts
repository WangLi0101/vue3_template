import type {
  ElementPlusPrimaryCssVars,
  ResolvedThemeMode,
  ThemePrimaryPreset,
  ThemeMode,
  ThemeSemanticTokens,
} from "@/config/theme/types";

export const themePersistence = {
  storageKey: "rbac-admin-theme",
} as const;

const createThemePreset = (preset: ThemePrimaryPreset): ThemePrimaryPreset => preset;
const createElementPlusPrimaryCssVars = (
  vars: ElementPlusPrimaryCssVars,
): ElementPlusPrimaryCssVars => vars;

export const themeDefaults: Readonly<{
  mode: ThemeMode;
  presetKey: string;
}> = {
  mode: "light",
  presetKey: "brand-0a62ca",
};

export const themePrimaryPresets = [
  createThemePreset({
    key: "brand-0a62ca",
    label: "品牌蓝",
    cssVars: createElementPlusPrimaryCssVars({
      // 常规
      "--el-color-primary": "#0a62ca",
      // 悬浮
      "--el-color-primary-light-3": "#4080ff",
      // 一般禁用
      "--el-color-primary-light-5": "#94bfff",
      "--el-color-primary-light-7": "#accdff",
      // 文字禁用
      "--el-color-primary-light-8": "#bedaff",
      "--el-color-primary-light-9": "#ddecff",
      // 点击
      "--el-color-primary-dark-2": "#0958b6",
    }),
  }),
  createThemePreset({
    key: "blue-2563eb",
    label: "经典蓝",
    cssVars: createElementPlusPrimaryCssVars({
      "--el-color-primary": "#2563eb",
      "--el-color-primary-light-3": "#6692f1",
      "--el-color-primary-light-5": "#9fbaf6",
      "--el-color-primary-light-7": "#b4c9f8",
      "--el-color-primary-light-8": "#c2d3f9",
      "--el-color-primary-light-9": "#dfe8fc",
      "--el-color-primary-dark-2": "#2157cf",
    }),
  }),
  createThemePreset({
    key: "cyan-0891b2",
    label: "青蓝",
    cssVars: createElementPlusPrimaryCssVars({
      "--el-color-primary": "#0891b2",
      "--el-color-primary-light-3": "#52b2c9",
      "--el-color-primary-light-5": "#92cfdd",
      "--el-color-primary-light-7": "#aadae4",
      "--el-color-primary-light-8": "#bae0e9",
      "--el-color-primary-light-9": "#dbeff4",
      "--el-color-primary-dark-2": "#07809d",
    }),
  }),
  createThemePreset({
    key: "slate-334155",
    label: "石板灰",
    cssVars: createElementPlusPrimaryCssVars({
      "--el-color-primary": "#334155",
      "--el-color-primary-light-3": "#707a88",
      "--el-color-primary-light-5": "#a5abb4",
      "--el-color-primary-light-7": "#b9bdc5",
      "--el-color-primary-light-8": "#c6cacf",
      "--el-color-primary-light-9": "#e1e3e6",
      "--el-color-primary-dark-2": "#2d394b",
    }),
  }),
] satisfies ThemePrimaryPreset[];

export const resolveThemePrimaryPreset = (presetKey: string): ThemePrimaryPreset => {
  return themePrimaryPresets.find((item) => item.key === presetKey) || themePrimaryPresets[0];
};

export const findThemePrimaryPresetByPrimary = (primary: string): ThemePrimaryPreset | null => {
  const normalizedPrimary = primary.trim().toLowerCase();
  return (
    themePrimaryPresets.find((item) => item.cssVars["--el-color-primary"] === normalizedPrimary) ||
    null
  );
};

export const themeSemanticTokensByMode = {
  light: {
    appBg: "#f2f3f5",
    surface: "#ffffff",
    sidebarBg: "#f2f3f5",
    sidebarBgHover: "#e5e6eb",
    sidebarText: "#475569",
    sidebarTextActive: "#0f172a",
    // 边框
    borderLight: "#f2f3f5",
    border: "#e5e6eb",
    borderHover: "#c9cdd4",
    borderStrong: "#86909c",
    // 文字
    textPrimary: "#1d2129",
    textSecondary: "#4e5969",
    textTertiary: "#86909c",
    textDisabled: "#c9cdd4",
    textInverse: "#ffffff",
  },
  dark: {
    appBg: "#0f172a",
    surface: "#1e293b",
    sidebarBg: "#0f172a",
    sidebarBgHover: "#1e293b",
    sidebarText: "#94a3b8",
    sidebarTextActive: "#f8fafc",
    borderLight: "#2b2b2c",
    border: "#363637",
    borderHover: "#4c4d4f",
    borderStrong: "#636466",
    textPrimary: "#f8fafc",
    textSecondary: "#cbd5e1",
    textTertiary: "#94a3b8",
    textDisabled: "#64748b",
    textInverse: "#ffffff",
  },
} satisfies Record<ResolvedThemeMode, ThemeSemanticTokens>;
