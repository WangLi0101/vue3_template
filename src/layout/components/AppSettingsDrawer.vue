<script setup lang="ts">
import { Check, Close, Monitor, Moon, Sunny } from "@element-plus/icons-vue";
import { computed } from "vue";
import { appThemeConfig, type ThemeMode } from "@/config/theme";
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

const predefineColors = [...appThemeConfig.primaryColorPresets];

const setThemeMode = (mode: ThemeMode): void => {
  themeStore.setMode(mode);
};

const setThemeColor = (color: string): void => {
  themeStore.setPrimaryColor(color);
};

const isThemeModeActive = (mode: ThemeMode): boolean =>
  themeStore.mode === mode;
const isThemeColorActive = (color: string): boolean =>
  themeStore.primaryColor.toLowerCase() === color.toLowerCase();
</script>

<template>
  <el-drawer
    v-model="visible"
    size="280px"
    direction="rtl"
    :append-to-body="true"
    :modal="true"
    :with-header="false"
    class="app-settings-drawer"
  >
    <div class="flex flex-col h-full bg-app-surface">
      <div
        class="flex items-center justify-between px-5 h-[52px] border-b border-app-border shrink-0"
      >
        <span class="text-[15px] font-medium text-app-text-primary"
          >系统配置</span
        >
        <el-icon
          class="cursor-pointer text-app-text-secondary hover:text-app-text-primary transition-colors outline-none"
          size="18"
          @click="visible = false"
        >
          <Close />
        </el-icon>
      </div>

      <div class="flex-1 overflow-y-auto p-5 space-y-7">
        <!-- 整体风格 -->
        <section>
          <div class="text-[14px] text-app-text-primary mb-3">整体风格</div>
          <div
            class="flex items-center p-[3px] bg-app-bg-mute rounded bg-opacity-80"
          >
            <button
              v-for="option in modeOptions"
              :key="option.value"
              type="button"
              class="flex-1 flex items-center justify-center gap-1.5 h-7 text-[13px] rounded-[4px] transition-all duration-300 border border-transparent"
              :class="
                isThemeModeActive(option.value)
                  ? 'bg-app-surface text-app-text-primary shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] font-medium !border-[var(--el-border-color-lighter)]'
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
          <div class="text-[14px] text-app-text-primary mb-3">主题色</div>
          <div class="flex flex-wrap items-center gap-[10px]">
            <button
              v-for="color in predefineColors"
              :key="color"
              type="button"
              class="relative w-[20px] h-[20px] rounded-[4px] cursor-pointer flex items-center justify-center outline-none transition-transform hover:scale-110 shadow-sm border border-black/10 dark:border-white/10"
              :style="{ backgroundColor: color }"
              @click="setThemeColor(color)"
            >
              <el-icon
                v-if="isThemeColorActive(color)"
                :class="
                  color.toLowerCase() === '#ffffff'
                    ? 'text-black'
                    : 'text-white'
                "
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

<style>
.app-settings-drawer .el-drawer__body {
  padding: 0 !important;
}
</style>
