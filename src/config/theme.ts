// 主题模式：浅色、深色、跟随系统
export type ThemeMode = "light" | "dark" | "system";
// 实际生效模式（仅 light/dark）
export type ResolvedThemeMode = Exclude<ThemeMode, "system">;

// 主题持久化配置
export const themePersistence = {
  storageKey: "rbac-admin-theme",
} as const;

// 主题默认值
export const themeDefaults: Readonly<{
  mode: ThemeMode;
  primaryColor: string;
}> = {
  mode: "system",
  primaryColor: "#e53935",
};

// 设置面板可选主题色
export const themeColorPresets = [
  "#e53935", // Red     - 强调明确
  "#6366f1", // Indigo  - 优雅高级
  "#3b82f6", // Blue    - 商务稳健
  "#0ea5e9", // Sky     - 清新通透
  "#10b981", // Emerald - 自然活力
  "#f59e0b", // Amber   - 温暖醒目
  "#f43f5e", // Rose    - 热情浪漫
  "#8b5cf6", // Violet  - 神秘质感
  "#0f172a", // Slate   - 极简中性
] as const;

// 主题语义 token，保持领域语义而不是直接暴露 CSS 变量名
export interface ThemeSemanticTokens {
  appBg: string; // 页面主背景
  contentBg: string; // 内容区背景
  bgMute: string; // 次级/减弱背景（如侧边栏、区块底色）
  surface: string; // 卡片、弹窗等表面背景
  headerBg: string; // 顶部栏背景
  surfaceHover: string; // 表面 hover 态
  sidebarBg: string; // 侧边栏背景
  sidebarBgHover: string; // 侧边栏 hover 背景
  sidebarBorder: string; // 侧边栏边框/分割线
  sidebarText: string; // 侧边栏默认文本
  sidebarTextActive: string; // 侧边栏激活文本
  border: string; // 基础分割线
  borderHover: string; // 强调或 hover 边框
  textPrimary: string; // 主要文本
  textSecondary: string; // 次级文本
  textDisabled: string; // 禁用文本
}

const themeSemanticCssVarMap = {
  appBg: "--app-bg",
  contentBg: "--app-content-bg",
  bgMute: "--app-bg-mute",
  surface: "--app-surface",
  headerBg: "--app-header-bg",
  surfaceHover: "--app-surface-hover",
  sidebarBg: "--app-sidebar-bg",
  sidebarBgHover: "--app-sidebar-bg-hover",
  sidebarBorder: "--app-sidebar-border",
  sidebarText: "--app-sidebar-text",
  sidebarTextActive: "--app-sidebar-text-active",
  border: "--app-border",
  borderHover: "--app-border-hover",
  textPrimary: "--app-text-primary",
  textSecondary: "--app-text-secondary",
  textDisabled: "--app-text-disabled",
} as const satisfies Record<keyof ThemeSemanticTokens, `--app-${string}`>;

export type ThemeSemanticCssVarName =
  (typeof themeSemanticCssVarMap)[keyof typeof themeSemanticCssVarMap];
export type ThemeSemanticCssVars = Record<ThemeSemanticCssVarName, string>;

export interface ThemePrimaryCssVars {
  "--app-primary": string;
  "--app-primary-rgb": string;
}

export interface ElementPlusPrimaryCssVars {
  "--el-color-primary": string;
  "--el-color-primary-light-3": string;
  "--el-color-primary-light-5": string;
  "--el-color-primary-light-7": string;
  "--el-color-primary-light-8": string;
  "--el-color-primary-light-9": string;
  "--el-color-primary-dark-2": string;
}

// 各模式下的语义 token 定义
export const themeSemanticTokensByMode = {
  light: {
    appBg: "#efefef",
    contentBg: "#efefef",
    bgMute: "#efefef",
    surface: "#ffffff",
    headerBg: "#ffffff",
    surfaceHover: "#efefef",
    sidebarBg: "#2f333b",
    sidebarBgHover: "#3a3f47",
    sidebarBorder: "#434954",
    sidebarText: "#b8c0cc",
    sidebarTextActive: "#ffffff",
    border: "#e0e0e0",
    borderHover: "#d3d3d3",
    textPrimary: "#1f2937",
    textSecondary: "#6b7280",
    textDisabled: "#a7b0bc",
  },
  dark: {
    appBg: "#10131a",
    contentBg: "#151b25",
    bgMute: "#1b2230",
    surface: "#1c2533",
    headerBg: "#1c2533",
    surfaceHover: "#263246",
    sidebarBg: "#0f141d",
    sidebarBgHover: "#1b2433",
    sidebarBorder: "#2b3445",
    sidebarText: "#99a6ba",
    sidebarTextActive: "#ffffff",
    border: "#2a3445",
    borderHover: "#3a475d",
    textPrimary: "#f3f5f9",
    textSecondary: "#95a3b8",
    textDisabled: "#66768e",
  },
} satisfies Record<ResolvedThemeMode, ThemeSemanticTokens>;

type ThemeSemanticTokenName = keyof ThemeSemanticTokens;

// 规范化颜色值，支持 #RGB / #RRGGBB，统一输出 #RRGGBB
export const normalizeHexColor = (value: string): string | null => {
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
export const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = normalizeHexColor(hex) || themeDefaults.primaryColor;
  const value = Number.parseInt(normalized.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return [r, g, b];
};

// 按权重混合颜色，生成派生色
export const mixHexColors = (base: string, mixin: string, weight: number): string => {
  const clampedWeight = Math.max(0, Math.min(1, weight));
  const [r1, g1, b1] = hexToRgb(base);
  const [r2, g2, b2] = hexToRgb(mixin);
  const r = Math.round(r1 * (1 - clampedWeight) + r2 * clampedWeight);
  const g = Math.round(g1 * (1 - clampedWeight) + g2 * clampedWeight);
  const b = Math.round(b1 * (1 - clampedWeight) + b2 * clampedWeight);

  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
};

// 语义 token 映射为 CSS 变量
export const buildSemanticCssVars = (tokens: ThemeSemanticTokens): ThemeSemanticCssVars => {
  const entries = Object.entries(themeSemanticCssVarMap).map(([tokenName, cssVarName]) => {
    const value = tokens[tokenName as ThemeSemanticTokenName];
    return [cssVarName, value];
  });

  return Object.fromEntries(entries) as ThemeSemanticCssVars;
};

// 主色映射为应用 CSS 变量
export const buildPrimaryCssVars = (color: string): ThemePrimaryCssVars => {
  const normalizedColor = normalizeHexColor(color) || themeDefaults.primaryColor;
  const [r, g, b] = hexToRgb(normalizedColor);

  return {
    "--app-primary": normalizedColor,
    "--app-primary-rgb": `${r} ${g} ${b}`,
  };
};

// 主色映射为 Element Plus 变量
export const buildElementPlusPrimaryCssVars = (color: string): ElementPlusPrimaryCssVars => {
  const normalizedColor = normalizeHexColor(color) || themeDefaults.primaryColor;

  return {
    "--el-color-primary": normalizedColor,
    "--el-color-primary-light-3": mixHexColors(normalizedColor, "#ffffff", 0.3),
    "--el-color-primary-light-5": mixHexColors(normalizedColor, "#ffffff", 0.5),
    "--el-color-primary-light-7": mixHexColors(normalizedColor, "#ffffff", 0.7),
    "--el-color-primary-light-8": mixHexColors(normalizedColor, "#ffffff", 0.8),
    "--el-color-primary-light-9": mixHexColors(normalizedColor, "#ffffff", 0.9),
    "--el-color-primary-dark-2": mixHexColors(normalizedColor, "#000000", 0.2),
  };
};
