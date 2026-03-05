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

const handleColorPickerChange = (color: string | null): void => {
  if (!color) return;
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
    title="系统配置"
    size="320px"
    direction="rtl"
    :append-to-body="true"
    :modal="true"
    :show-close="false"
  >
    <template #header="{ close }">
      <div class="flex items-center justify-between w-full">
        <span class="text-base font-bold text-app-text-primary tracking-wide"
          >系统主题配置</span
        >
        <el-button
          text
          circle
          :icon="Close"
          class="!text-app-text-secondary hover:!text-app-text-primary hover:!bg-app-bg-mute"
          @click="close"
        />
      </div>
    </template>

    <div class="space-y-8 mt-2">
      <section>
        <div
          class="text-[13px] font-bold tracking-wider text-app-text-secondary uppercase mb-4"
        >
          主题模式 (Mode)
        </div>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="option in modeOptions"
            :key="option.value"
            type="button"
            class="h-16 rounded-xl border text-sm transition-all duration-300 flex flex-col items-center justify-center gap-1.5 font-medium relative overflow-hidden"
            :class="
              isThemeModeActive(option.value)
                ? 'border-primary text-primary bg-[color:rgb(var(--app-primary-rgb)/0.08)] shadow-[0_4px_12px_-4px_rgb(var(--app-primary-rgb)/0.4)]'
                : 'border-app-border text-app-text-secondary hover:border-app-border-hover hover:text-app-text-primary hover:bg-app-bg-mute'
            "
            @click="setThemeMode(option.value)"
          >
            <el-icon size="16">
              <component :is="option.icon" />
            </el-icon>
            <span>{{ option.label }}</span>
          </button>
        </div>
      </section>

      <section>
        <div
          class="text-[13px] font-bold tracking-wider text-app-text-secondary uppercase mb-4"
        >
          主色调 (Colors)
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <button
            v-for="color in predefineColors"
            :key="color"
            type="button"
            class="h-8 w-8 rounded-full ring-offset-2 ring-offset-app-surface transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95"
            :class="
              isThemeColorActive(color)
                ? 'ring-2 ring-primary shadow-md'
                : 'ring-1 ring-app-border hover:ring-app-border-hover'
            "
            :style="{ backgroundColor: color }"
            @click="setThemeColor(color)"
          >
            <el-icon v-if="isThemeColorActive(color)" color="#ffffff">
              <Check />
            </el-icon>
          </button>

          <el-color-picker
            :model-value="themeStore.primaryColor"
            @change="handleColorPickerChange"
          />
        </div>
      </section>
    </div>
  </el-drawer>
</template>
