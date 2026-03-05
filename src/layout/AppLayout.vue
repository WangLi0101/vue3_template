<script setup lang="ts">
import { computed } from 'vue'
import AppHeader from '@/layout/components/AppHeader.vue'
import AppSidebar from '@/layout/components/AppSidebar.vue'
import AppRouterView from '@/components/AppRouterView.vue'
import { useUiStore } from '@/stores/modules/ui'

const uiStore = useUiStore()

const sidebarWidthClass = computed(() => (uiStore.isSidebarCollapsed ? 'w-[64px]' : 'w-[220px]'))
</script>

<template>
  <div class="h-screen flex overflow-hidden">
    <div class="shrink-0 transition-all duration-200 ease-in-out" :class="sidebarWidthClass">
      <AppSidebar />
    </div>

    <div class="flex-1 min-w-0 flex flex-col">
      <AppHeader />

      <main class="flex-1 overflow-auto p-4 bg-[var(--app-bg)]">
        <AppRouterView />
      </main>
    </div>
  </div>
</template>
