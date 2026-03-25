<template>
  <aside class="app-sidebar">
    <div class="sidebar-brand" :class="{ 'is-collapsed': uiStore.isSidebarCollapsed }">
      <img :src="uiStore.isSidebarCollapsed ? logoMiniImage : logoImage" alt="Company Logo" />
    </div>

    <div class="sidebar-menu-wrap">
      <el-menu
        :default-active="activeMenu"
        :collapse="uiStore.isSidebarCollapsed"
        :collapse-transition="false"
        class="sidebar-menu"
        router
      >
        <SidebarItem v-for="item in menuItems" :key="item.path" :item="item" />
      </el-menu>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import logoImage from "@/assets/logo.svg";
import logoMiniImage from "@/assets/logo-mini.svg";
import SidebarItem from "@/layout/components/SidebarItem.vue";
import { useMenuStore } from "@/stores/modules/menu";
import { useUiStore } from "@/stores/modules/ui";

const route = useRoute();
const menuStore = useMenuStore();
const uiStore = useUiStore();

const menuItems = computed(() => menuStore.sidebarMenus);
const activeMenu = computed(() => route.path);
</script>

<style scoped>
.app-sidebar {
  z-index: 20;
  height: 100%;
  overflow: hidden;
  border-right: 1px solid var(--app-border);
  background: var(--app-sidebar-bg);
  transition:
    background-color 0.18s cubic-bezier(0.2, 0, 0, 1),
    border-color 0.18s cubic-bezier(0.2, 0, 0, 1);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.5rem;
  padding-inline: 1rem;
  border-bottom: 1px solid var(--app-border);
  color: var(--app-sidebar-text-active);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  transition:
    padding 0.18s cubic-bezier(0.2, 0, 0, 1),
    border-color 0.18s cubic-bezier(0.2, 0, 0, 1);
}

.sidebar-brand.is-collapsed {
  padding-inline: 0;
}

.sidebar-brand img {
  width: auto;
  height: 2rem;
  object-fit: contain;
}

.sidebar-menu-wrap {
  height: calc(100vh - 56px);
  overflow-y: auto;
}

.sidebar-menu {
  border-right: 0;
  background: transparent;
  --el-menu-bg-color: transparent;
  --el-menu-border-color: transparent;
  --el-menu-text-color: var(--app-sidebar-text);
  --el-menu-hover-text-color: var(--app-sidebar-text-active);
  --el-menu-hover-bg-color: var(--app-sidebar-bg-hover);
  --el-menu-active-color: var(--app-sidebar-text-active);
}

.app-sidebar :deep(.el-menu-item),
.app-sidebar :deep(.el-sub-menu__title) {
  transition:
    background-color 0.14s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.14s cubic-bezier(0.22, 1, 0.36, 1);
}

.app-sidebar :deep(.el-menu-item:hover),
.app-sidebar :deep(.el-sub-menu__title:hover) {
  background: var(--app-sidebar-bg-hover);
  color: var(--app-sidebar-text-active);
}

.app-sidebar :deep(.el-menu-item.is-active) {
  background: rgb(var(--app-primary-rgb) / 0.9);
  color: #fff;
}

.app-sidebar :deep(.el-menu-item.is-active:hover) {
  background: rgb(var(--app-primary-rgb) / 1);
}

.app-sidebar :deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
  color: var(--app-sidebar-text-active);
}

.app-sidebar :deep(.el-sub-menu__title:hover .el-sub-menu__icon-arrow),
.app-sidebar :deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow) {
  color: var(--app-sidebar-text-active);
}

.app-sidebar :deep(.el-menu--collapse > .el-menu-item),
.app-sidebar :deep(.el-menu--collapse > .el-sub-menu > .el-sub-menu__title) {
  justify-content: center;
  padding: 0 !important;
}

.app-sidebar :deep(.el-menu--collapse > .el-menu-item .el-menu-tooltip__trigger) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}

.app-sidebar :deep(.el-menu--collapse > .el-menu-item [class^="el-icon"]),
.app-sidebar :deep(.el-menu--collapse > .el-sub-menu > .el-sub-menu__title [class^="el-icon"]) {
  margin: 0;
}
</style>
