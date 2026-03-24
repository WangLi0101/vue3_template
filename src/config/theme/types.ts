export type ThemeMode = "light" | "dark" | "system";
export type ResolvedThemeMode = Exclude<ThemeMode, "system">;

export interface ThemeSemanticTokens {
  appBg: string;
  bgMute: string;
  surface: string;
  sidebarBg: string;
  sidebarBgHover: string;
  sidebarText: string;
  sidebarTextActive: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
}

export type ThemeSemanticTokenName = keyof ThemeSemanticTokens;

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
