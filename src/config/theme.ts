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
  primaryColor: "#2563eb",
};

// 设置面板可选主题色
// 选色思路：更偏专业后台与现代产品语境，统一控制饱和度与明度，
// 让按钮、链接、高亮态更耐看，同时兼顾浅色/深色模式下的表现。
export const themeColorPresets = [
  "#2563eb", // Sapphire Blue - 专业、可信、适合通用后台
  "#4f46e5", // Royal Indigo  - 科技感与品质感更强
  "#7c3aed", // Iris Purple   - 适合产品感更强的品牌界面
  "#0891b2", // Ocean Cyan    - 清爽理性，视觉更轻盈
  "#0f766e", // Forest Teal   - 稳重克制，偏企业与数据平台
  "#059669", // Jade Green    - 友好自然，适合运营与增长场景
  "#d97706", // Amber Brown   - 温暖高级，适合强调与品牌点缀
  "#db2777", // Berry Rose    - 精致醒目，适合更有辨识度的风格
  "#334155", // Slate Ink     - 中性冷静，适合极简商务风
] as const;

// 主题语义 token，保持领域语义而不是直接暴露 CSS 变量名
export interface ThemeSemanticTokens {
  appBg: string; // 页面主背景
  bgMute: string; // 次级/减弱背景（如侧边栏、区块底色）
  surface: string; // 卡片、弹窗等表面背景
  sidebarBg: string; // 侧边栏背景
  sidebarBgHover: string; // 侧边栏 hover 背景
  sidebarText: string; // 侧边栏默认文本
  sidebarTextActive: string; // 侧边栏激活文本
  border: string; // 基础分割线
  textPrimary: string; // 主要文本
  textSecondary: string; // 次级文本
  textDisabled: string; // 禁用文本
}

const themeSemanticCssVarMap = {
  appBg: "--app-bg",
  bgMute: "--app-bg-mute",
  surface: "--app-surface",
  sidebarBg: "--app-sidebar-bg",
  sidebarBgHover: "--app-sidebar-bg-hover",
  sidebarText: "--app-sidebar-text",
  sidebarTextActive: "--app-sidebar-text-active",
  border: "--app-border",
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
    appBg: "#f1f5f9", // slate-100 - 主背景
    bgMute: "#e2e8f0", // slate-200
    surface: "#ffffff", // 纯白卡片内容区
    sidebarBg: "#f8fafc", // slate-50 - 极浅灰色侧边栏
    sidebarBgHover: "#f1f5f9", // slate-100
    sidebarText: "#475569", // slate-600 - 确保深色文本可读性
    sidebarTextActive: "#0f172a", // slate-900
    border: "#e2e8f0", // slate-200
    textPrimary: "#0f172a", // slate-900
    textSecondary: "#64748b", // slate-500
    textDisabled: "#cbd5e1", // slate-300
  },
  dark: {
    appBg: "#0f172a", // slate-900 (作为主背景，不至于过黑死气沉沉)
    bgMute: "#334155", // slate-700
    surface: "#1e293b", // slate-800 (卡片和头部、面板更亮一些，提升通透感)
    sidebarBg: "#0f172a", // slate-900 (侧边栏)
    sidebarBgHover: "#334155", // slate-700
    sidebarText: "#94a3b8", // slate-400
    sidebarTextActive: "#f8fafc", // slate-50
    border: "#334155", // slate-700 (大幅提亮边框，使得分割线和结构更清晰)
    textPrimary: "#f8fafc", // slate-50
    textSecondary: "#cbd5e1", // slate-300 (次级文字也提亮)
    textDisabled: "#64748b", // slate-500
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
