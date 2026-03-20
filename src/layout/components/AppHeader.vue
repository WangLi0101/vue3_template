<template>
  <section class="app-header">
    <div class="app-header__hero">
      <AppHeaderContent
        :title="title"
        :is-sidebar-collapsed="uiStore.isSidebarCollapsed"
        :display-name="displayName"
        @toggle-sidebar="uiStore.toggleSidebar"
        @open-settings="isSettingsDrawerVisible = true"
        @logout="logout"
      />
    </div>

    <div class="app-header__tags">
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

<style scoped lang="scss">
.app-header {
  position: relative;
  background-color: var(--app-surface);
  border-bottom: 1px solid var(--app-border);
}

.app-header__tags {
  border-top: 1px solid var(--app-border);
}

@media (max-width: 768px) {
  .app-header {
    overflow-x: auto;
  }
}
</style>
