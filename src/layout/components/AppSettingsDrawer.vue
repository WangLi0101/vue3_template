<template>
  <el-drawer
    v-model="visible"
    size="280px"
    direction="rtl"
    :append-to-body="true"
    :modal="true"
    :with-header="false"
    class="app-settings-drawer [&_.el-drawer__body]:!p-0"
  >
    <div class="flex h-full flex-col bg-app-surface">
      <div
        class="flex h-[52px] shrink-0 items-center justify-between border-0 border-b border-solid border-app-border px-5"
      >
        <span class="text-[15px] font-medium text-app-text-primary">系统配置</span>
        <el-icon
          class="cursor-pointer text-app-text-secondary outline-none transition-colors hover:text-app-text-primary"
          size="18"
          @click="visible = false"
        >
          <Close />
        </el-icon>
      </div>

      <div class="flex-1 space-y-7 overflow-y-auto p-5">
        <!-- 整体风格 -->
        <section>
          <div class="mb-3 text-[14px] text-app-text-primary">整体风格</div>
          <div class="flex items-center rounded bg-app-bg-mute bg-opacity-80 p-[3px]">
            <button
              v-for="option in modeOptions"
              :key="option.value"
              type="button"
              class="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-[4px] border border-transparent text-[13px] transition-all duration-300"
              :class="
                isThemeModeActive(option.value)
                  ? '!border-[var(--el-border-color-lighter)] bg-app-surface font-medium text-app-text-primary shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]'
                  : 'text-app-text-secondary hover:text-app-text-primary'
              "
              @click="setThemeMode(option.value)"
            >
              <el-icon size="14">
                <component :is="option.icon" />
              </el-icon>
              <span>{{ option.label }}</span>
            </button>
          </div>
        </section>

        <!-- 主题色 -->
        <section>
          <div class="mb-3 text-[14px] text-app-text-primary">主题色</div>
          <div class="flex flex-wrap items-center gap-[10px]">
            <button
              v-for="color in predefineColors"
              :key="color"
              type="button"
              class="relative flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-[4px] border border-black/10 shadow-sm outline-none transition-transform hover:scale-110 dark:border-white/10"
              :style="{ backgroundColor: color }"
              @click="setThemeColor(color)"
            >
              <el-icon
                v-if="isThemeColorActive(color)"
                :class="color.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'"
                size="12"
              >
                <Check />
              </el-icon>
            </button>
          </div>
        </section>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { Check, Close, Monitor, Moon, Sunny } from "@element-plus/icons-vue";
import { computed } from "vue";
import { themeColorPresets } from "@/config/theme";
import type { ThemeMode } from "@/config/theme/types";
import { useThemeStore } from "@/stores/modules/theme";

interface Props {
  modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const themeStore = useThemeStore();
const visible = computed<boolean>({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});
const modeOptions: Array<{
  label: string;
  value: ThemeMode;
  icon: typeof Sunny;
}> = [
  { label: "浅色", value: "light", icon: Sunny },
  { label: "深色", value: "dark", icon: Moon },
  { label: "自动", value: "system", icon: Monitor },
];

const predefineColors = [...themeColorPresets];

const setThemeMode = (mode: ThemeMode): void => {
  themeStore.setMode(mode);
};

const setThemeColor = (color: string): void => {
  themeStore.setPrimaryColor(color);
};

const isThemeModeActive = (mode: ThemeMode): boolean => themeStore.mode === mode;
const isThemeColorActive = (color: string): boolean =>
  themeStore.primaryColor.toLowerCase() === color.toLowerCase();
</script>
