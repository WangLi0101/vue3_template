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

      <main ref="mainContentRef" class="flex-1 overflow-auto p-3">
        <AppRouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, useTemplateRef, watch } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "@/layout/components/AppHeader.vue";
import AppSidebar from "@/layout/components/AppSidebar.vue";
import AppRouterView from "@/components/AppRouterView.vue";
import { useUiStore } from "@/stores/modules/ui";

const uiStore = useUiStore();
const route = useRoute();
const mainContentRef = useTemplateRef<HTMLElement>("mainContentRef");

const sidebarWidthClass = computed(() => (uiStore.isSidebarCollapsed ? "w-[64px]" : "w-[220px]"));

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    mainContentRef.value?.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  },
  { flush: "post" },
);
</script>
