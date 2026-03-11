<template>
  <div class="app-header-content">
    <div class="app-header-content__main">
      <div class="app-header-content__left">
        <el-tooltip :content="sidebarToggleLabel" placement="bottom">
          <button
            type="button"
            class="app-header-content__icon-button"
            :aria-label="sidebarToggleLabel"
            @click="emit('toggleSidebar')"
          >
            <el-icon :size="16"><component :is="sidebarToggleIcon" /></el-icon>
          </button>
        </el-tooltip>

        <div class="app-header-content__breadcrumb-shell">
          <AppBreadcrumb />
        </div>
      </div>

      <div class="app-header-content__right">
        <el-tooltip content="系统配置" placement="bottom">
          <button
            type="button"
            class="app-header-content__icon-button"
            aria-label="打开系统配置"
            @click="emit('openSettings')"
          >
            <el-icon :size="15"><Setting /></el-icon>
          </button>
        </el-tooltip>

        <el-dropdown>
          <button type="button" class="app-header-content__profile" aria-label="打开用户菜单">
            <el-avatar :size="24" class="app-header-content__avatar">{{
              avatarFallback
            }}</el-avatar>
            <span class="app-header-content__profile-name">{{ displayName }}</span>
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

<style scoped lang="scss">
.app-header-content {
  background-color: var(--app-header-bg);
}

.app-header-content__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 42px;
  padding: 0 12px 0 8px;
}

.app-header-content__left,
.app-header-content__right {
  display: flex;
  align-items: center;
  min-width: 0;
}

.app-header-content__right {
  gap: 6px;
}

.app-header-content__icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  color: var(--app-text-secondary);
  cursor: pointer;
  background: transparent;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.app-header-content__icon-button:hover {
  color: var(--app-primary);
  background-color: var(--app-bg-mute);
}

.app-header-content__breadcrumb-shell {
  min-width: 0;
  overflow: hidden;
}

.app-header-content__profile {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  border: 0;
  border-radius: 4px;
  color: var(--app-text-primary);
  cursor: pointer;
  background: transparent;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.app-header-content__profile:hover {
  background-color: var(--app-bg-mute);
}

.app-header-content__avatar {
  flex-shrink: 0;
  color: #fff;
  background-color: rgb(var(--app-primary-rgb) / 0.92);
}

.app-header-content__profile-name {
  overflow: hidden;
  max-width: 96px;
  font-size: 13px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 960px) {
  .app-header-content__main {
    padding-right: 8px;
  }
}

@media (max-width: 768px) {
  .app-header-content__main {
    padding: 0 8px 0 4px;
  }

  .app-header-content__profile-name {
    max-width: 72px;
  }
}
</style>
