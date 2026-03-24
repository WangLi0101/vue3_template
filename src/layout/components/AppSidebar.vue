<template>
  <aside
    class="app-sidebar duration-180 [&_.el-menu-item]:duration-180 z-20 h-full overflow-hidden border-0 border-r border-solid border-app-border bg-app-sidebar-bg transition-colors ease-[cubic-bezier(0.2,0,0,1)] [&_.el-menu--inline]:border-r-0 [&_.el-menu--inline]:bg-transparent [&_.el-menu--inline]:px-2 [&_.el-menu--inline]:py-1 [&_.el-menu-item+.el-menu-item]:mt-1 [&_.el-menu-item+.el-sub-menu]:mt-1 [&_.el-menu-item.is-active:hover]:!bg-[rgb(var(--app-primary-rgb)/1)] [&_.el-menu-item.is-active]:!bg-[rgb(var(--app-primary-rgb)/0.9)] [&_.el-menu-item.is-active]:!text-white [&_.el-menu-item:hover]:bg-[var(--app-sidebar-bg-hover)] [&_.el-menu-item:hover]:text-[var(--app-sidebar-text-active)] [&_.el-menu-item]:m-0 [&_.el-menu-item]:h-10 [&_.el-menu-item]:rounded [&_.el-menu-item]:bg-transparent [&_.el-menu-item]:leading-10 [&_.el-menu-item]:text-[var(--app-sidebar-text)] [&_.el-menu-item]:transition-colors [&_.el-menu-item]:ease-[cubic-bezier(0.2,0,0,1)] [&_.el-menu]:border-r-0 [&_.el-menu]:bg-transparent [&_.el-menu]:px-2 [&_.el-menu]:py-1 [&_.el-sub-menu+.el-menu-item]:mt-1 [&_.el-sub-menu+.el-sub-menu]:mt-1"
  >
    <div
      class="duration-180 flex h-14 items-center border-0 border-b border-solid border-app-border px-4 text-base font-bold tracking-wider text-app-sidebar-active transition-[padding] ease-[cubic-bezier(0.2,0,0,1)]"
      :class="uiStore.isSidebarCollapsed ? 'justify-center px-0' : 'justify-center'"
    >
      <img
        :src="uiStore.isSidebarCollapsed ? logoMiniImage : logoImage"
        alt="Company Logo"
        class="h-8 w-auto object-contain"
      />
    </div>

    <el-scrollbar height="calc(100vh - 56px)">
      <el-menu
        :default-active="activeMenu"
        :collapse="uiStore.isSidebarCollapsed"
        :collapse-transition="false"
        class="border-r-0 bg-transparent"
        router
      >
        <SidebarItem v-for="item in menuItems" :key="item.path" :item="item" />
      </el-menu>
    </el-scrollbar>
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
.app-sidebar :deep(.el-sub-menu__title) {
  height: 2.5rem;
  margin: 0;
  border-radius: 0.25rem;
  background: transparent;
  color: var(--app-sidebar-text);
  line-height: 2.5rem;
  transition:
    background-color 0.18s cubic-bezier(0.2, 0, 0, 1),
    color 0.18s cubic-bezier(0.2, 0, 0, 1);
}

.app-sidebar :deep(.el-sub-menu__title:hover) {
  background: var(--app-sidebar-bg-hover);
  color: var(--app-sidebar-text-active);
}

.app-sidebar :deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
  color: var(--app-sidebar-text-active);
}

.app-sidebar :deep(.el-sub-menu__icon-arrow) {
  color: var(--app-sidebar-text);
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
