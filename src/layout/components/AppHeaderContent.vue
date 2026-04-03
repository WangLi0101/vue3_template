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
            @click="emit('toggleSidebar')"
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

        <el-dropdown>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-2 rounded border-0 bg-transparent px-1 py-0.5 text-app-text-primary transition-colors duration-200 hover:bg-[var(--el-fill-color-light)]"
            aria-label="打开用户菜单"
          >
            <el-avatar
              :size="24"
              class="flex shrink-0 items-center justify-center bg-primary/90 text-white"
            >
              {{ avatarFallback }}
            </el-avatar>
            <span
              class="max-w-[72px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium md:max-w-[96px]"
            >
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
