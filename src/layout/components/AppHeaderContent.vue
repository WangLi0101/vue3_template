<template>
  <header class="sticky top-0 z-10 bg-app-header transition-colors duration-300">
    <div class="flex h-14 items-center justify-between px-5">
      <div class="flex min-w-0 items-center gap-3">
        <el-tooltip :content="sidebarToggleLabel" placement="bottom">
          <el-button
            text
            circle
            class="!text-app-text-primary hover:!bg-app-bg-mute"
            @click="emit('toggleSidebar')"
          >
            <el-icon><component :is="sidebarToggleIcon" /></el-icon>
          </el-button>
        </el-tooltip>

        <div class="shrink-0 text-base font-semibold tracking-wide text-app-text-primary">
          {{ title }}
        </div>

        <el-divider direction="vertical" />
        <AppBreadcrumb />
      </div>

      <div class="flex items-center gap-3">
        <el-dropdown>
          <span
            class="flex cursor-pointer items-center gap-2 text-sm text-app-text-primary transition-opacity hover:opacity-80"
          >
            <el-avatar :size="26">{{ avatarFallback }}</el-avatar>
            {{ displayName }}
          </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="emit('logout')"> 退出登录 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-tooltip content="系统配置" placement="bottom">
          <el-button
            text
            circle
            class="!text-app-text-primary transition-colors hover:!bg-app-bg-mute"
            @click="emit('openSettings')"
          >
            <el-icon><Setting /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Expand, Fold, Setting } from "@element-plus/icons-vue";
import { computed } from "vue";
import AppBreadcrumb from "@/layout/components/AppBreadcrumb.vue";

interface Props {
  title: string;
  isSidebarCollapsed: boolean;
  displayName: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  toggleSidebar: [];
  openSettings: [];
  logout: [];
}>();

const sidebarToggleIcon = computed(() => (props.isSidebarCollapsed ? Expand : Fold));
const sidebarToggleLabel = computed(() => (props.isSidebarCollapsed ? "展开侧边栏" : "折叠侧边栏"));
const avatarFallback = computed(() => props.displayName.slice(0, 1) || "U");
</script>
