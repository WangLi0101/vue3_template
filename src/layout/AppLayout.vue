<template>
  <div class="flex h-screen overflow-hidden bg-app-bg">
    <div
      class="duration-180 shrink-0 transition-[width] ease-[cubic-bezier(0.2,0,0,1)]"
      :class="sidebarWidthClass"
    >
      <AppSidebar />
    </div>

    <div class="flex min-w-0 flex-1 flex-col bg-app-bg">
      <AppHeader />

      <main class="flex-1 overflow-auto p-3">
        <div class="h-full rounded-lg bg-app-surface p-5 shadow-sm">
          <AppRouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppHeader from "@/layout/components/AppHeader.vue";
import AppSidebar from "@/layout/components/AppSidebar.vue";
import AppRouterView from "@/components/AppRouterView.vue";
import { useUiStore } from "@/stores/modules/ui";

const uiStore = useUiStore();

const sidebarWidthClass = computed(() => (uiStore.isSidebarCollapsed ? "w-[64px]" : "w-[220px]"));
</script>
