<template>
  <div class="bg-app-surface">
    <div
      class="flex min-h-[42px] items-center justify-between gap-4 pl-2 pr-3 max-md:px-2 max-sm:pl-1 max-sm:pr-2 lg:pr-3"
    >
      <div class="flex min-w-0 flex-1 items-center">
        <el-tooltip :content="sidebarToggleLabel" placement="bottom">
          <button
            type="button"
            class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-app-text-secondary transition-colors duration-200 hover:bg-[var(--el-fill-color-light)] hover:text-primary"
            :aria-label="sidebarToggleLabel"
            @click="uiStore.toggleSidebar()"
          >
            <el-icon :size="16"><component :is="sidebarToggleIcon" /></el-icon>
          </button>
        </el-tooltip>

        <div class="ml-1 min-w-0 overflow-hidden">
          <AppBreadcrumb />
        </div>
      </div>

      <div class="flex min-w-0 shrink-0 items-center gap-1.5">
        <el-tooltip content="系统配置" placement="bottom">
          <button
            type="button"
            class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-app-text-secondary transition-colors duration-200 hover:bg-[var(--el-fill-color-light)] hover:text-primary"
            aria-label="打开系统配置"
            @click="emit('openSettings')"
          >
            <el-icon :size="15"><Setting /></el-icon>
          </button>
        </el-tooltip>

        <AppUserAvatar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Expand, Fold, Setting } from "@element-plus/icons-vue";
import { computed } from "vue";
import AppBreadcrumb from "@/layout/components/AppBreadcrumb.vue";
import AppUserAvatar from "@/layout/components/AppUserAvatar.vue";
import { useUiStore } from "@/stores/modules/ui";

const uiStore = useUiStore();

const emit = defineEmits<{
  openSettings: [];
}>();

const sidebarToggleIcon = computed(() => (uiStore.isSidebarCollapsed ? Expand : Fold));
const sidebarToggleLabel = computed(() =>
  uiStore.isSidebarCollapsed ? "展开侧边栏" : "折叠侧边栏",
);
</script>
