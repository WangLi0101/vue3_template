<script setup lang="ts">
import { computed } from "vue";
import AppHeader from "@/layout/components/AppHeader.vue";
import AppSidebar from "@/layout/components/AppSidebar.vue";
import AppRouterView from "@/components/AppRouterView.vue";
import { useUiStore } from "@/stores/modules/ui";

const uiStore = useUiStore();

const sidebarWidthClass = computed(() => (uiStore.isSidebarCollapsed ? "w-[64px]" : "w-[220px]"));
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-app-content">
    <div class="shrink-0 transition-all duration-200 ease-in-out" :class="sidebarWidthClass">
      <AppSidebar />
    </div>

    <div class="flex min-w-0 flex-1 flex-col bg-app-content">
      <AppHeader />

      <main class="flex-1 overflow-auto bg-app-content p-3 sm:p-5">
        <div class="h-full rounded-lg bg-app-surface p-3 shadow-sm sm:p-5">
          <AppRouterView />
        </div>
      </main>
    </div>
  </div>
</template>
