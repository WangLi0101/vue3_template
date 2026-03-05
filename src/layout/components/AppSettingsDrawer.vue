<script setup lang="ts">
import { Check, Close, Monitor, Moon, Sunny } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { appThemeConfig, type ThemeMode } from '@/config/theme'
import { useThemeStore } from '@/stores/modules/theme'

interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const themeStore = useThemeStore()
const visible = computed<boolean>({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})
const modeOptions: Array<{ label: string; value: ThemeMode; icon: typeof Sunny }> = [
  { label: '浅色', value: 'light', icon: Sunny },
  { label: '深色', value: 'dark', icon: Moon },
  { label: '自动', value: 'system', icon: Monitor }
]
const predefineColors = [...appThemeConfig.primaryColorPresets]

const setThemeMode = (mode: ThemeMode): void => {
  themeStore.setMode(mode)
}

const setThemeColor = (color: string): void => {
  themeStore.setPrimaryColor(color)
}

const handleColorPickerChange = (color: string | null): void => {
  if (!color) return
  themeStore.setPrimaryColor(color)
}

const isThemeModeActive = (mode: ThemeMode): boolean => themeStore.mode === mode
const isThemeColorActive = (color: string): boolean => themeStore.primaryColor.toLowerCase() === color.toLowerCase()
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
        <span class="text-base font-semibold text-[var(--app-text-primary)]">系统配置</span>
        <el-button text :icon="Close" @click="close" />
      </div>
    </template>

    <div class="space-y-6">
      <section>
        <div class="text-xs font-semibold tracking-wide text-[var(--app-text-secondary)] mb-3">主题模式</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="option in modeOptions"
            :key="option.value"
            type="button"
            class="h-16 rounded-lg border text-sm transition-colors flex flex-col items-center justify-center gap-1"
            :class="
              isThemeModeActive(option.value)
                ? 'border-primary text-primary bg-[color:rgb(var(--app-primary-rgb)/0.12)]'
                : 'border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-primary/50'
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
        <div class="text-xs font-semibold tracking-wide text-[var(--app-text-secondary)] mb-3">主题色</div>
        <div class="flex flex-wrap items-center gap-3">
          <button
            v-for="color in predefineColors"
            :key="color"
            type="button"
            class="h-7 w-7 rounded-md ring-offset-2 ring-offset-white dark:ring-offset-slate-800 transition-all flex items-center justify-center"
            :class="isThemeColorActive(color) ? 'ring-2 ring-primary' : 'ring-1 ring-black/10'"
            :style="{ backgroundColor: color }"
            @click="setThemeColor(color)"
          >
            <el-icon v-if="isThemeColorActive(color)" color="#ffffff">
              <Check />
            </el-icon>
          </button>

          <el-color-picker :model-value="themeStore.primaryColor" @change="handleColorPickerChange" />
        </div>
      </section>
    </div>
  </el-drawer>
</template>
