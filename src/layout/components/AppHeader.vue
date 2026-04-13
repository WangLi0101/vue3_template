<template>
  <section
    class="relative border-0 border-b border-solid border-app-border bg-app-surface max-md:overflow-x-auto"
  >
    <div>
      <AppHeaderContent @open-settings="isSettingsDrawerVisible = true" />
    </div>

    <div class="border-0 border-t border-solid border-app-border">
      <AppHeaderTags />
    </div>
  </section>

  <AppSettingsDrawer v-model="isSettingsDrawerVisible" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouteTabTracking } from "@/composables/useRouteTabTracking";
import AppHeaderContent from "@/layout/components/AppHeaderContent.vue";
import AppHeaderTags from "@/layout/components/AppHeaderTags.vue";
import AppSettingsDrawer from "@/layout/components/AppSettingsDrawer.vue";

const isSettingsDrawerVisible = ref(false);

useRouteTabTracking();
</script>
