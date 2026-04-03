import type {
  ElementPlusBorderCssVars,
  ThemePrimaryCssVars,
  ElementPlusPrimaryCssVars,
  ThemeSemanticTokenName,
  ThemeSemanticTokens,
} from "@/config/theme/types";

const themeSemanticCssVarMap = {
  appBg: "--app-bg",
  surface: "--app-surface",
  sidebarBg: "--app-sidebar-bg",
  sidebarBgHover: "--app-sidebar-bg-hover",
  sidebarText: "--app-sidebar-text",
  sidebarTextActive: "--app-sidebar-text-active",
  borderLight: "--app-border-light",
  border: "--app-border",
  borderHover: "--app-border-hover",
  borderStrong: "--app-border-strong",
  textPrimary: "--app-text-primary",
  textSecondary: "--app-text-secondary",
  textTertiary: "--app-text-tertiary",
  textDisabled: "--app-text-disabled",
  textInverse: "--app-text-inverse",
} as const satisfies Record<keyof ThemeSemanticTokens, `--app-${string}`>;

export type ThemeSemanticCssVarName =
  (typeof themeSemanticCssVarMap)[keyof typeof themeSemanticCssVarMap];
export type ThemeSemanticCssVars = Record<ThemeSemanticCssVarName, string>;

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

export const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = normalizeHexColor(hex) || "#0a62ca";
  const value = Number.parseInt(normalized.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return [r, g, b];
};

export const mixHexColors = (base: string, mixin: string, weight: number): string => {
  const clampedWeight = Math.max(0, Math.min(1, weight));
  const [r1, g1, b1] = hexToRgb(base);
  const [r2, g2, b2] = hexToRgb(mixin);
  const r = Math.round(r1 * (1 - clampedWeight) + r2 * clampedWeight);
  const g = Math.round(g1 * (1 - clampedWeight) + g2 * clampedWeight);
  const b = Math.round(b1 * (1 - clampedWeight) + b2 * clampedWeight);

  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
};

export const buildSemanticCssVars = (tokens: ThemeSemanticTokens): ThemeSemanticCssVars => {
  const entries = Object.entries(themeSemanticCssVarMap).map(([tokenName, cssVarName]) => {
    const value = tokens[tokenName as ThemeSemanticTokenName];
    return [cssVarName, value];
  });

  return Object.fromEntries(entries) as ThemeSemanticCssVars;
};

export const buildElementPlusBorderCssVars = (
  tokens: ThemeSemanticTokens,
): ElementPlusBorderCssVars => {
  return {
    "--el-border-color": tokens.border,
    "--el-border-color-light": tokens.border,
    "--el-border-color-lighter": tokens.border,
    "--el-border-color-extra-light": tokens.borderLight,
    "--el-border-color-dark": tokens.borderHover,
    "--el-border-color-darker": tokens.borderStrong,
  };
};

export const normalizeElementPlusPrimaryCssVars = (
  vars: ElementPlusPrimaryCssVars,
): ElementPlusPrimaryCssVars => {
  return {
    "--el-color-primary": normalizeHexColor(vars["--el-color-primary"]) || "#0a62ca",
    "--el-color-primary-light-3":
      normalizeHexColor(vars["--el-color-primary-light-3"]) || "#4080ff",
    "--el-color-primary-light-5":
      normalizeHexColor(vars["--el-color-primary-light-5"]) || "#94bfff",
    "--el-color-primary-light-7":
      normalizeHexColor(vars["--el-color-primary-light-7"]) || "#accdff",
    "--el-color-primary-light-8":
      normalizeHexColor(vars["--el-color-primary-light-8"]) || "#bedaff",
    "--el-color-primary-light-9":
      normalizeHexColor(vars["--el-color-primary-light-9"]) || "#ddecff",
    "--el-color-primary-dark-2": normalizeHexColor(vars["--el-color-primary-dark-2"]) || "#0958b6",
  };
};

export const buildPrimaryCssVars = (vars: ElementPlusPrimaryCssVars): ThemePrimaryCssVars => {
  const normalizedVars = normalizeElementPlusPrimaryCssVars(vars);
  const [r, g, b] = hexToRgb(normalizedVars["--el-color-primary"]);

  return {
    "--app-primary": normalizedVars["--el-color-primary"],
    "--app-primary-rgb": `${r} ${g} ${b}`,
  };
};

export const buildElementPlusPrimaryCssVars = (
  vars: ElementPlusPrimaryCssVars,
): ElementPlusPrimaryCssVars => {
  return normalizeElementPlusPrimaryCssVars(vars);
};
