import { themeDefaults } from "@/config/theme";
import type {
  ElementPlusPrimaryCssVars,
  ThemePrimaryCssVars,
  ThemeSemanticTokenName,
  ThemeSemanticTokens,
} from "@/config/theme/types";

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
  const normalized = normalizeHexColor(hex) || themeDefaults.primaryColor;
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

export const buildPrimaryCssVars = (color: string): ThemePrimaryCssVars => {
  const normalizedColor = normalizeHexColor(color) || themeDefaults.primaryColor;
  const [r, g, b] = hexToRgb(normalizedColor);

  return {
    "--app-primary": normalizedColor,
    "--app-primary-rgb": `${r} ${g} ${b}`,
  };
};

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
