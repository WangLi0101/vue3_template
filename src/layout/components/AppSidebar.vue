<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarItem from '@/layout/components/SidebarItem.vue'
import { useMenuStore } from '@/stores/modules/menu'
import { useUiStore } from '@/stores/modules/ui'

const route = useRoute()
const menuStore = useMenuStore()
const uiStore = useUiStore()

const menuItems = computed(() => menuStore.sidebarMenus)
const activeMenu = computed(() => route.path)
const appName = computed(() => (uiStore.isSidebarCollapsed ? 'R' : 'RBAC Admin'))
</script>

<template>
  <aside class="app-sidebar h-full border-r border-[var(--app-border)] bg-[var(--app-surface)] overflow-hidden">
    <div
      class="h-14 flex items-center px-4 text-base font-semibold text-[var(--app-text-primary)] border-b border-[var(--app-border)]"
      :class="uiStore.isSidebarCollapsed ? 'justify-center px-0' : ''"
    >
      {{ appName }}
    </div>

    <el-scrollbar height="calc(100vh - 56px)">
      <el-menu :default-active="activeMenu" :collapse="uiStore.isSidebarCollapsed" :collapse-transition="false" router>
        <SidebarItem v-for="item in menuItems" :key="item.path" :item="item" />
      </el-menu>
    </el-scrollbar>
  </aside>
</template>
