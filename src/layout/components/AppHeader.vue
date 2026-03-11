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

<template>
  <AppHeaderContent
    :title="title"
    :is-sidebar-collapsed="uiStore.isSidebarCollapsed"
    :display-name="displayName"
    @toggle-sidebar="uiStore.toggleSidebar"
    @open-settings="isSettingsDrawerVisible = true"
    @logout="logout"
  />

  <AppHeaderTags />

  <AppSettingsDrawer v-model="isSettingsDrawerVisible" />
</template>
