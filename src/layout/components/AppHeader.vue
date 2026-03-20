<template>
  <section
    class="relative border-0 border-b border-solid border-app-border bg-app-surface max-md:overflow-x-auto"
  >
    <div>
      <AppHeaderContent
        :title="title"
        :is-sidebar-collapsed="uiStore.isSidebarCollapsed"
        :display-name="displayName"
        @toggle-sidebar="uiStore.toggleSidebar"
        @open-settings="isSettingsDrawerVisible = true"
        @logout="logout"
      />
    </div>

    <div class="border-0 border-t border-solid border-app-border">
      <AppHeaderTags />
    </div>
  </section>

  <AppSettingsDrawer v-model="isSettingsDrawerVisible" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useLogoutAction } from "@/composables/useLogoutAction";
import { useRouteTabTracking } from "@/composables/useRouteTabTracking";
import AppHeaderContent from "@/layout/components/AppHeaderContent.vue";
import AppHeaderTags from "@/layout/components/AppHeaderTags.vue";
import AppSettingsDrawer from "@/layout/components/AppSettingsDrawer.vue";
import { useAuthStore } from "@/stores/modules/auth";
import { useUiStore } from "@/stores/modules/ui";

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUiStore();
const { logout } = useLogoutAction();

const isSettingsDrawerVisible = ref(false);

const title = computed(() => (route.meta.title as string) || "管理后台");
const displayName = computed(() => authStore.user?.displayName || "未知用户");

useRouteTabTracking();
</script>
