export type ThemeMode = "light" | "dark" | "system";
export type ResolvedThemeMode = Exclude<ThemeMode, "system">;

export interface ThemePrimaryPreset {
  key: string;
  label: string;
  cssVars: ElementPlusPrimaryCssVars;
}

export interface ThemeSemanticTokens {
  appBg: string;
  surface: string;
  sidebarBg: string;
  sidebarBgHover: string;
  sidebarText: string;
  sidebarTextActive: string;
  // 浅边框
  borderLight: string;
  // 一般边框
  border: string;
  // 深边框/悬浮描边
  borderHover: string;
  // 重边框/按钮描边
  borderStrong: string;
  // 强调/正文标题
  textPrimary: string;
  // 次强调/正文标题
  textSecondary: string;
  // 次置信息
  textTertiary: string;
  // 置灰信息
  textDisabled: string;
  // 纯白文字
  textInverse: string;
}

export type ThemeSemanticTokenName = keyof ThemeSemanticTokens;

export interface ThemePrimaryCssVars {
  // Element 主色同步出的项目主色
  "--app-primary": string;
  // Element 主色的 RGB 形式，方便配合透明度做渐变和阴影
  "--app-primary-rgb": string;
}

export interface ElementPlusBorderCssVars {
  // 一般边框
  "--el-border-color": string;
  // 一般边框
  "--el-border-color-light": string;
  // 一般边框
  "--el-border-color-lighter": string;
  // 浅边框
  "--el-border-color-extra-light": string;
  // 深边框/悬浮描边
  "--el-border-color-dark": string;
  // 重边框/按钮描边
  "--el-border-color-darker": string;
}

export interface ElementPlusPrimaryCssVars {
  // 常规主色
  "--el-color-primary": string;
  // 悬浮态主色
  "--el-color-primary-light-3": string;
  // 一般禁用态主色
  "--el-color-primary-light-5": string;
  // 主色浅阶，常用于边框/弱高亮
  "--el-color-primary-light-7": string;
  // 文字禁用态主色
  "--el-color-primary-light-8": string;
  // 主色最浅阶，常用于淡背景
  "--el-color-primary-light-9": string;
  // 点击/激活态主色
  "--el-color-primary-dark-2": string;
}
