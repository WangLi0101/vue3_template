import type { ResolvedThemeMode, ThemeMode, ThemeSemanticTokens } from "@/config/theme/types";

export const themePersistence = {
  storageKey: "rbac-admin-theme",
} as const;

export const themeDefaults: Readonly<{
  mode: ThemeMode;
  primaryColor: string;
}> = {
  mode: "system",
  primaryColor: "#2563eb",
};

export const themeColorPresets = [
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#0891b2",
  "#0f766e",
  "#059669",
  "#d97706",
  "#db2777",
  "#334155",
] as const;

export const themeSemanticTokensByMode = {
  light: {
    appBg: "#f1f5f9",
    bgMute: "#e2e8f0",
    surface: "#ffffff",
    sidebarBg: "#f8fafc",
    sidebarBgHover: "#f1f5f9",
    sidebarText: "#475569",
    sidebarTextActive: "#0f172a",
    border: "#e2e8f0",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    textDisabled: "#cbd5e1",
  },
  dark: {
    appBg: "#0f172a",
    bgMute: "#334155",
    surface: "#1e293b",
    sidebarBg: "#0f172a",
    sidebarBgHover: "#334155",
    sidebarText: "#94a3b8",
    sidebarTextActive: "#f8fafc",
    border: "#334155",
    textPrimary: "#f8fafc",
    textSecondary: "#cbd5e1",
    textDisabled: "#64748b",
  },
} satisfies Record<ResolvedThemeMode, ThemeSemanticTokens>;
