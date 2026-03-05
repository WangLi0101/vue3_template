<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import SidebarItem from "@/layout/components/SidebarItem.vue";
import { useMenuStore } from "@/stores/modules/menu";
import { useUiStore } from "@/stores/modules/ui";

const route = useRoute();
const menuStore = useMenuStore();
const uiStore = useUiStore();

const menuItems = computed(() => menuStore.sidebarMenus);
const activeMenu = computed(() => route.path);
const appName = computed(() =>
  uiStore.isSidebarCollapsed ? "R" : "RBAC Admin",
);
</script>

<template>
  <aside
    class="app-sidebar h-full border-r border-app-sidebar-border bg-app-sidebar-bg overflow-hidden transition-colors duration-300 z-20"
  >
    <div
      class="h-14 flex items-center px-4 text-base font-bold text-app-sidebar-active border-b border-app-sidebar-border tracking-wider transition-all"
      :class="
        uiStore.isSidebarCollapsed
          ? 'justify-center px-0 text-xl font-extrabold tracking-normal'
          : ''
      "
    >
      {{ appName }}
    </div>

    <el-scrollbar height="calc(100vh - 56px)">
      <el-menu
        :default-active="activeMenu"
        :collapse="uiStore.isSidebarCollapsed"
        :collapse-transition="false"
        class="app-sidebar-menu"
        router
      >
        <SidebarItem v-for="item in menuItems" :key="item.path" :item="item" />
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<style scoped lang="scss">
.app-sidebar-menu {
  border-right: none;
  background-color: transparent;
}

.app-sidebar :deep(.el-menu),
.app-sidebar :deep(.el-menu--inline) {
  border-right: none;
  background-color: transparent;
  padding: 4px 8px;
}

.app-sidebar :deep(.el-menu-item),
.app-sidebar :deep(.el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
  margin: 0;
  border-radius: 4px;
  color: var(--app-sidebar-text);
  background-color: transparent;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.app-sidebar :deep(.el-menu-item + .el-menu-item),
.app-sidebar :deep(.el-menu-item + .el-sub-menu),
.app-sidebar :deep(.el-sub-menu + .el-menu-item),
.app-sidebar :deep(.el-sub-menu + .el-sub-menu) {
  margin-top: 4px;
}

.app-sidebar :deep(.el-menu-item:hover),
.app-sidebar :deep(.el-sub-menu__title:hover) {
  background-color: var(--app-sidebar-bg-hover);
  color: var(--app-sidebar-text-active);
}

.app-sidebar :deep(.el-menu-item.is-active) {
  background-color: rgb(var(--app-primary-rgb) / 0.9);
  color: var(--app-sidebar-text-active);
}

.app-sidebar :deep(.el-menu-item.is-active:hover) {
  background-color: rgb(var(--app-primary-rgb) / 1);
}

.app-sidebar :deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
  color: var(--app-sidebar-text-active);
}

.app-sidebar :deep(.el-sub-menu .el-menu-item) {
  padding-left: 48px !important;
}

.app-sidebar :deep(.el-sub-menu__icon-arrow) {
  color: var(--app-sidebar-text);
}

.app-sidebar :deep(.el-sub-menu__title:hover .el-sub-menu__icon-arrow),
.app-sidebar
  :deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow) {
  color: var(--app-sidebar-text-active);
}

.app-sidebar :deep(.el-menu--collapse .el-menu-item),
.app-sidebar :deep(.el-menu--collapse .el-sub-menu__title) {
  justify-content: center;
  padding: 0 !important;
}
</style>
