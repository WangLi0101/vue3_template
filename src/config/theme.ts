// 主题模式：浅色、深色、跟随系统
export type ThemeMode = "light" | "dark" | "system";
// 实际生效模式（仅 light/dark）
export type ResolvedThemeMode = Exclude<ThemeMode, "system">;

// 语义化主题变量集合
export interface ThemeSemanticVars {
  // 💡 背景系列
  "--app-bg": string; // 页面主背景
  "--app-content-bg": string; // 内容区背景
  "--app-bg-mute": string; // 次级/减弱背景（如侧边栏、区块底色）
  // 💡 表面层系列（卡片、菜单、弹窗）
  "--app-surface": string; // 表面背景
  "--app-header-bg": string; // 顶部栏背景
  "--app-surface-hover": string; // 表面悬浮态（如表格行、菜单项 hover）
  // 💡 侧边栏系列
  "--app-sidebar-bg": string; // 侧边栏背景
  "--app-sidebar-bg-hover": string; // 侧边栏悬浮背景
  "--app-sidebar-border": string; // 侧边栏分割线
  "--app-sidebar-text": string; // 侧边栏普通文本
  "--app-sidebar-text-active": string; // 侧边栏激活文本
  // 💡 边框系列
  "--app-border": string; // 基础柔和分割线
  "--app-border-hover": string; // 强调或悬浮态边框
  // 💡 文本系列
  "--app-text-primary": string; // 主要标题与正文
  "--app-text-secondary": string; // 较弱的次级文本、图标默认色
  "--app-text-disabled": string; // 禁用态幽灵文本
}

// 应用主题配置（统一管理颜色与默认项）
export const appThemeConfig = {
  storageKey: "rbac-admin-theme",
  defaultMode: "system" as ThemeMode,
  defaultPrimaryColor: "#e53935", // 默认红色，贴近后台管理场景常见强调色
  primaryColorPresets: [
    "#e53935", // Red     - 强调明确
    "#6366f1", // Indigo  - 优雅高级
    "#3b82f6", // Blue    - 商务稳健
    "#0ea5e9", // Sky     - 清新通透
    "#10b981", // Emerald - 自然活力
    "#f59e0b", // Amber   - 温暖醒目
    "#f43f5e", // Rose    - 热情浪漫
    "#8b5cf6", // Violet  - 神秘质感
    "#0f172a", // Slate   - 极简中性
  ] as const,
  semanticVars: {
    light: {
      "--app-bg": "#f2f4f7", // 整体底色
      "--app-content-bg": "#f5f6f8", // 内容区浅灰
      "--app-bg-mute": "#eef1f5", // 次级区块背景
      "--app-surface": "#ffffff", // 卡片/面板背景
      "--app-header-bg": "#ffffff", // 顶栏背景
      "--app-surface-hover": "#f7f8fa", // hover 表面
      "--app-sidebar-bg": "#2f333b", // 侧栏深灰
      "--app-sidebar-bg-hover": "#3a3f47", // 侧栏 hover
      "--app-sidebar-border": "#434954", // 侧栏分割线
      "--app-sidebar-text": "#b8c0cc", // 侧栏普通文本
      "--app-sidebar-text-active": "#ffffff", // 侧栏激活文本
      "--app-border": "#e3e6eb", // 页面分割线
      "--app-border-hover": "#c9d0da", // 边框交互态
      "--app-text-primary": "#1f2937", // 主文本
      "--app-text-secondary": "#6b7280", // 次文本
      "--app-text-disabled": "#a7b0bc", // 禁用文本
    },
    dark: {
      "--app-bg": "#10131a",
      "--app-content-bg": "#151b25",
      "--app-bg-mute": "#1b2230",
      "--app-surface": "#1c2533",
      "--app-header-bg": "#1c2533",
      "--app-surface-hover": "#263246",
      "--app-sidebar-bg": "#0f141d",
      "--app-sidebar-bg-hover": "#1b2433",
      "--app-sidebar-border": "#2b3445",
      "--app-sidebar-text": "#99a6ba",
      "--app-sidebar-text-active": "#ffffff",
      "--app-border": "#2a3445",
      "--app-border-hover": "#3a475d",
      "--app-text-primary": "#f3f5f9",
      "--app-text-secondary": "#95a3b8",
      "--app-text-disabled": "#66768e",
    },
  } satisfies Record<ResolvedThemeMode, ThemeSemanticVars>,
};
