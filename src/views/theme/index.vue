<template>
  <div class="flex min-h-full flex-col gap-5 p-1 text-app-text-primary">
    <section
      class="grid gap-5 rounded-[20px] border border-app-border bg-app-surface p-7 shadow-[0_16px_40px_rgb(var(--app-primary-rgb)/0.10)] max-[960px]:grid-cols-1 max-[960px]:p-[22px] min-[961px]:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.9fr)]"
      style="
        background:
          radial-gradient(circle at top right, rgb(var(--app-primary-rgb) / 18%), transparent 34%),
          linear-gradient(135deg, rgb(var(--app-primary-rgb) / 8%), transparent 42%),
          var(--app-surface);
      "
    >
      <div>
        <p class="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Theme Inspector
        </p>
        <h1 class="m-0 text-[28px] leading-[1.2] text-app-text-primary">当前主题颜色配置</h1>
        <p class="mt-3 max-w-[700px] text-sm leading-[1.75] text-app-text-secondary">
          这里展示当前实际生效的主题模式、主色阶、语义色，以及按钮、文字、边框等组件效果。
        </p>
      </div>

      <div class="grid gap-3">
        <div
          class="flex flex-col gap-1 rounded-2xl border border-[rgb(var(--app-primary-rgb)/0.14)] bg-[rgb(var(--app-primary-rgb)/0.06)] px-[18px] py-4"
        >
          <span class="text-xs text-app-text-secondary">主题模式</span>
          <strong class="text-lg leading-[1.4] text-app-text-primary">{{
            currentModeLabel
          }}</strong>
          <span class="text-xs text-app-text-tertiary"
            >当前生效：{{ currentResolvedModeLabel }}</span
          >
        </div>
        <div
          class="flex flex-col gap-1 rounded-2xl border border-[rgb(var(--app-primary-rgb)/0.14)] bg-[rgb(var(--app-primary-rgb)/0.06)] px-[18px] py-4"
        >
          <span class="text-xs text-app-text-secondary">当前预设</span>
          <strong class="text-lg leading-[1.4] text-app-text-primary">{{
            currentPreset.label
          }}</strong>
          <span class="text-xs text-app-text-tertiary">{{ currentPreset.key }}</span>
        </div>
        <div
          class="flex flex-col gap-1 rounded-2xl border border-[rgb(var(--app-primary-rgb)/0.14)] bg-[rgb(var(--app-primary-rgb)/0.06)] px-[18px] py-4"
        >
          <span class="text-xs text-app-text-secondary">主色</span>
          <strong class="text-lg leading-[1.4] text-app-text-primary">
            {{ currentPreset.cssVars["--el-color-primary"] }}
          </strong>
          <span class="text-xs text-app-text-tertiary">Element Plus Primary</span>
        </div>
      </div>
    </section>

    <section
      class="rounded-[20px] border border-app-border bg-app-surface p-6 shadow-[0_16px_40px_rgb(var(--app-primary-rgb)/0.10)] max-[960px]:p-5"
    >
      <div class="mb-[18px] flex items-start justify-between gap-4">
        <div>
          <h2 class="m-0 text-lg leading-[1.35] text-app-text-primary">当前主色阶</h2>
          <p class="mt-1.5 text-[13px] leading-[1.6] text-app-text-secondary">
            这些颜色会直接影响主要按钮、链接、焦点态和高亮态。
          </p>
        </div>
      </div>

      <div class="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
        <article
          v-for="item in primaryColorItems"
          :key="item.cssVar"
          class="overflow-hidden rounded-[18px] border border-app-border bg-app-surface"
        >
          <div
            class="flex min-h-[104px] items-end p-[14px] text-xs font-bold tracking-[0.02em]"
            :style="{ background: item.value, color: getReadableTextColor(item.value) }"
          >
            <span>{{ item.value }}</span>
          </div>
          <div class="flex flex-col gap-1 p-[14px]">
            <strong class="text-sm text-app-text-primary">{{ item.label }}</strong>
            <span class="text-xs text-primary">{{ item.cssVar }}</span>
            <p class="mt-0.5 text-xs leading-[1.6] text-app-text-secondary">
              {{ item.description }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <section
      class="rounded-[20px] border border-app-border bg-app-surface p-6 shadow-[0_16px_40px_rgb(var(--app-primary-rgb)/0.10)] max-[960px]:p-5"
    >
      <div class="mb-[18px] flex items-start justify-between gap-4">
        <div>
          <h2 class="m-0 text-lg leading-[1.35] text-app-text-primary">当前语义色</h2>
          <p class="mt-1.5 text-[13px] leading-[1.6] text-app-text-secondary">
            语义色用于页面背景、面板、文字层级、侧边栏和边框系统。
          </p>
        </div>
      </div>

      <div class="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
        <article
          v-for="item in semanticColorItems"
          :key="item.cssVar"
          class="overflow-hidden rounded-[18px] border border-app-border bg-app-surface"
        >
          <div
            class="flex min-h-[92px] items-end p-[14px] text-xs font-bold tracking-[0.02em]"
            :style="{ background: item.value, color: getReadableTextColor(item.value) }"
          >
            <span>{{ item.value }}</span>
          </div>
          <div class="flex flex-col gap-1 p-[14px]">
            <strong class="text-sm text-app-text-primary">{{ item.label }}</strong>
            <span class="text-xs text-primary">{{ item.cssVar }}</span>
            <p class="mt-0.5 text-xs leading-[1.6] text-app-text-secondary">
              {{ item.description }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <section
      class="rounded-[20px] border border-app-border bg-app-surface p-6 shadow-[0_16px_40px_rgb(var(--app-primary-rgb)/0.10)] max-[960px]:p-5"
    >
      <div class="mb-[18px] flex items-start justify-between gap-4">
        <div>
          <h2 class="m-0 text-lg leading-[1.35] text-app-text-primary">可选主题预设</h2>
          <p class="mt-1.5 text-[13px] leading-[1.6] text-app-text-secondary">
            下面是系统内置的主题主色预设，当前启用项会高亮显示。
          </p>
        </div>
      </div>

      <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <article
          v-for="preset in themePrimaryPresets"
          :key="preset.key"
          class="rounded-[18px] border border-app-border bg-app-surface transition duration-200 hover:-translate-y-0.5 hover:border-[rgb(var(--app-primary-rgb)/0.30)] hover:shadow-[0_12px_28px_rgb(var(--app-primary-rgb)/0.12)]"
          :class="{
            'border-[rgb(var(--app-primary-rgb)/0.55)] shadow-[0_12px_28px_rgb(var(--app-primary-rgb)/0.14)]':
              preset.key === currentPreset.key,
          }"
        >
          <div
            class="grid h-[52px] grid-cols-7 overflow-hidden rounded-t-[18px] border-b border-app-border"
          >
            <span
              v-for="colorKey in primaryColorKeys"
              :key="colorKey"
              class="block h-full w-full"
              :style="{ background: preset.cssVars[colorKey] }"
            />
          </div>
          <div class="flex flex-col gap-1.5 p-[14px]">
            <strong class="text-sm text-app-text-primary">{{ preset.label }}</strong>
            <span class="text-xs text-app-text-secondary">
              {{ preset.cssVars["--el-color-primary"] }}
            </span>
          </div>
        </article>
      </div>
    </section>

    <section
      class="rounded-[20px] border border-app-border bg-app-surface p-6 shadow-[0_16px_40px_rgb(var(--app-primary-rgb)/0.10)] max-[960px]:p-5"
    >
      <div class="mb-[18px] flex items-start justify-between gap-4">
        <div>
          <h2 class="m-0 text-lg leading-[1.35] text-app-text-primary">组件预览</h2>
          <p class="mt-1.5 text-[13px] leading-[1.6] text-app-text-secondary">
            这里用当前主题直接渲染按钮、文字、标签和容器效果。
          </p>
        </div>
      </div>

      <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        <article
          class="flex flex-col gap-4 rounded-[18px] border border-app-border bg-[linear-gradient(180deg,rgb(var(--app-primary-rgb)/0.04),transparent_34%),var(--app-surface)] p-[18px]"
        >
          <h3 class="m-0 text-[15px] text-app-text-primary">按钮与标签</h3>
          <div class="flex flex-wrap gap-3">
            <el-button type="primary">主按钮</el-button>
            <el-button type="primary" plain>Plain 按钮</el-button>
            <el-button>默认按钮</el-button>
            <el-button type="primary" link>链接按钮</el-button>
          </div>
          <div class="flex flex-wrap gap-3">
            <el-button type="primary" disabled>禁用主按钮</el-button>
            <el-tag>默认标签</el-tag>
            <el-tag type="success">成功标签</el-tag>
            <el-tag type="info">信息标签</el-tag>
          </div>
        </article>

        <article
          class="flex flex-col gap-4 rounded-[18px] border border-app-border bg-[linear-gradient(180deg,rgb(var(--app-primary-rgb)/0.04),transparent_34%),var(--app-surface)] p-[18px]"
        >
          <h3 class="m-0 text-[15px] text-app-text-primary">文字层级</h3>
          <div class="flex flex-col gap-2.5">
            <p class="m-0 text-[17px] font-bold leading-[1.7] text-app-text-primary">
              这是主文字，用于标题和正文重点信息。
            </p>
            <p class="m-0 text-sm leading-[1.7] text-app-text-secondary">
              这是次级文字，用于说明性内容和字段提示。
            </p>
            <p class="m-0 text-[13px] leading-[1.7] text-app-text-tertiary">
              这是三级文字，适合展示弱提示与辅助信息。
            </p>
            <p class="m-0 text-[13px] leading-[1.7] text-app-text-disabled">
              这是禁用文字，通常用于不可操作状态。
            </p>
          </div>
        </article>

        <article
          class="flex flex-col gap-4 rounded-[18px] border border-app-border bg-app-bg p-[18px]"
        >
          <h3 class="m-0 text-[15px] text-app-text-primary">背景与边框</h3>
          <div class="grid gap-3">
            <div
              class="rounded-[14px] border border-app-border bg-app-bg p-4 text-[13px] leading-[1.6] text-app-text-primary"
            >
              页面背景 `--app-bg`
            </div>
            <div
              class="rounded-[14px] border border-app-border bg-app-surface p-4 text-[13px] leading-[1.6] text-app-text-primary"
            >
              面板背景 `--app-surface`
            </div>
            <div
              class="rounded-[14px] border-2 border-app-border-strong bg-[rgb(var(--app-primary-rgb)/0.06)] p-4 text-[13px] leading-[1.6] text-app-text-secondary"
            >
              边框颜色 `--app-border` / `--app-border-strong`
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { themePrimaryPresets, themeSemanticTokensByMode } from "@/config/theme";
import { hexToRgb, normalizeHexColor } from "@/config/theme/utils";
import type {
  ElementPlusPrimaryCssVars,
  ThemeMode,
  ThemeSemanticTokens,
} from "@/config/theme/types";
import { useThemeStore } from "@/stores/modules/theme";

defineOptions({
  name: "ThemePage",
});

interface PrimaryColorMeta {
  cssVar: keyof ElementPlusPrimaryCssVars;
  label: string;
  description: string;
}

interface SemanticColorMeta {
  key: keyof ThemeSemanticTokens;
  cssVar: `--app-${string}`;
  label: string;
  description: string;
}

const themeModeLabelMap: Record<ThemeMode, string> = {
  light: "浅色模式",
  dark: "深色模式",
  system: "跟随系统",
};

const resolvedModeLabelMap = {
  light: "浅色",
  dark: "深色",
} as const;

const primaryColorMetaList: PrimaryColorMeta[] = [
  {
    cssVar: "--el-color-primary",
    label: "主色",
    description: "常规主色，主要用于主按钮、链接和关键强调。",
  },
  {
    cssVar: "--el-color-primary-light-3",
    label: "悬浮色",
    description: "主要用于 hover 态和轻交互反馈。",
  },
  {
    cssVar: "--el-color-primary-light-5",
    label: "禁用色",
    description: "主要用于主按钮的普通禁用态背景和边框。",
  },
  {
    cssVar: "--el-color-primary-light-7",
    label: "浅阶色",
    description: "适合边框、弱高亮和低对比装饰。",
  },
  {
    cssVar: "--el-color-primary-light-8",
    label: "弱文字色",
    description: "主要用于主色体系下的弱文字和禁用文字。",
  },
  {
    cssVar: "--el-color-primary-light-9",
    label: "淡背景色",
    description: "适合浅色背景、大面积弱高亮和提示底色。",
  },
  {
    cssVar: "--el-color-primary-dark-2",
    label: "激活色",
    description: "主要用于 active 态和按下后的更深主色。",
  },
];

const semanticColorMetaList: SemanticColorMeta[] = [
  {
    key: "appBg",
    cssVar: "--app-bg",
    label: "页面背景",
    description: "整体页面底色。",
  },
  {
    key: "surface",
    cssVar: "--app-surface",
    label: "面板背景",
    description: "卡片、弹层、内容区背景。",
  },
  {
    key: "sidebarBg",
    cssVar: "--app-sidebar-bg",
    label: "侧边栏背景",
    description: "侧边导航默认底色。",
  },
  {
    key: "sidebarBgHover",
    cssVar: "--app-sidebar-bg-hover",
    label: "侧边栏悬浮背景",
    description: "侧边导航 hover 时的底色。",
  },
  {
    key: "sidebarText",
    cssVar: "--app-sidebar-text",
    label: "侧边栏文字",
    description: "侧边导航默认文字色。",
  },
  {
    key: "sidebarTextActive",
    cssVar: "--app-sidebar-text-active",
    label: "侧边栏激活文字",
    description: "侧边导航高亮项文字色。",
  },
  {
    key: "borderLight",
    cssVar: "--app-border-light",
    label: "浅边框",
    description: "更轻的分割线和弱边界。",
  },
  {
    key: "border",
    cssVar: "--app-border",
    label: "默认边框",
    description: "通用边框与基础描边。",
  },
  {
    key: "borderHover",
    cssVar: "--app-border-hover",
    label: "悬浮边框",
    description: "hover 或强调态边框。",
  },
  {
    key: "borderStrong",
    cssVar: "--app-border-strong",
    label: "重边框",
    description: "更强对比的描边或强调边界。",
  },
  {
    key: "textPrimary",
    cssVar: "--app-text-primary",
    label: "主文字",
    description: "标题、正文重点信息。",
  },
  {
    key: "textSecondary",
    cssVar: "--app-text-secondary",
    label: "次文字",
    description: "说明、辅助信息。",
  },
  {
    key: "textTertiary",
    cssVar: "--app-text-tertiary",
    label: "三级文字",
    description: "更弱提示和次要内容。",
  },
  {
    key: "textDisabled",
    cssVar: "--app-text-disabled",
    label: "禁用文字",
    description: "不可用态内容展示。",
  },
  {
    key: "textInverse",
    cssVar: "--app-text-inverse",
    label: "反色文字",
    description: "深色底上的高对比文字。",
  },
];

const themeStore = useThemeStore();
const { mode, resolvedMode, currentPreset, elementCssVars } = storeToRefs(themeStore);

const primaryColorKeys = primaryColorMetaList.map((item) => item.cssVar);

const currentModeLabel = computed<string>(() => themeModeLabelMap[mode.value]);
const currentResolvedModeLabel = computed<string>(() => resolvedModeLabelMap[resolvedMode.value]);

const activeSemanticTokens = computed<ThemeSemanticTokens>(() => {
  return themeSemanticTokensByMode[resolvedMode.value];
});

const primaryColorItems = computed(() => {
  return primaryColorMetaList.map((item) => ({
    ...item,
    value: elementCssVars.value[item.cssVar],
  }));
});

const semanticColorItems = computed(() => {
  return semanticColorMetaList.map((item) => ({
    ...item,
    value: activeSemanticTokens.value[item.key],
  }));
});

const getReadableTextColor = (color: string): string => {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return "#ffffff";
  }

  const [r, g, b] = hexToRgb(normalized);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160 ? "#111827" : "#ffffff";
};
</script>
