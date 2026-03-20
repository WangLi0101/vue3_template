<template>
  <div class="bg-app-surface">
    <div class="flex items-center justify-between gap-4 min-h-[42px] pl-2 pr-3 lg:pr-3 max-md:px-2 max-sm:pl-1 max-sm:pr-2">
      <div class="flex flex-1 items-center min-w-0">
        <el-tooltip :content="sidebarToggleLabel" placement="bottom">
          <button
            type="button"
            class="inline-flex items-center justify-center w-7 h-7 p-0 border-0 rounded bg-transparent text-app-text-secondary cursor-pointer transition-colors duration-200 hover:text-primary hover:bg-app-bg-mute"
            :aria-label="sidebarToggleLabel"
            @click="emit('toggleSidebar')"
          >
            <el-icon :size="16"><component :is="sidebarToggleIcon" /></el-icon>
          </button>
        </el-tooltip>

        <div class="min-w-0 overflow-hidden ml-1">
          <AppBreadcrumb />
        </div>
      </div>

      <div class="flex items-center min-w-0 gap-1.5 shrink-0">
        <el-tooltip content="系统配置" placement="bottom">
          <button
            type="button"
            class="inline-flex items-center justify-center w-7 h-7 p-0 border-0 rounded bg-transparent text-app-text-secondary cursor-pointer transition-colors duration-200 hover:text-primary hover:bg-app-bg-mute"
            aria-label="打开系统配置"
            @click="emit('openSettings')"
          >
            <el-icon :size="15"><Setting /></el-icon>
          </button>
        </el-tooltip>

        <el-dropdown>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-1 py-0.5 border-0 rounded bg-transparent text-app-text-primary cursor-pointer transition-colors duration-200 hover:bg-app-bg-mute"
            aria-label="打开用户菜单"
          >
            <el-avatar :size="24" class="shrink-0 text-white bg-primary/90 flex items-center justify-center">
              {{ avatarFallback }}
            </el-avatar>
            <span class="overflow-hidden md:max-w-[96px] max-w-[72px] text-[13px] font-medium text-ellipsis whitespace-nowrap">
              {{ displayName }}
            </span>
          </button>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="emit('logout')"> 退出登录 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
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
