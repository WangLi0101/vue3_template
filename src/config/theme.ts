// 主题模式：浅色、深色、跟随系统
export type ThemeMode = "light" | "dark" | "system";
// 实际生效模式（仅 light/dark）
export type ResolvedThemeMode = Exclude<ThemeMode, "system">;

// 语义化主题变量集合
export interface ThemeSemanticVars {
  "--app-bg": string;
  "--app-surface": string;
  "--app-border": string;
  "--app-text-primary": string;
  "--app-text-secondary": string;
}

// 应用主题配置（统一管理颜色与默认项）
export const appThemeConfig = {
  storageKey: "rbac-admin-theme",
  defaultMode: "system" as ThemeMode,
  defaultPrimaryColor: "#1f7dff",
  primaryColorPresets: [
    "#1f7dff",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ] as const,
  semanticVars: {
    light: {
      "--app-bg": "#f5f7fb",
      "--app-surface": "#ffffff",
      "--app-border": "#dfe6ef",
      "--app-text-primary": "#1f2329",
      "--app-text-secondary": "#4e5969",
    },
    dark: {
      "--app-bg": "#111827",
      "--app-surface": "#1f2937",
      "--app-border": "#374151",
      "--app-text-primary": "#f3f4f6",
      "--app-text-secondary": "#9ca3af",
    },
  } satisfies Record<ResolvedThemeMode, ThemeSemanticVars>,
};
