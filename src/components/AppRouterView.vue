<template>
  <div class="app-router-view">
    <RouterView v-slot="{ Component, route }">
      <Transition name="route-switch" mode="out-in">
        <KeepAlive v-if="route.meta.keepAlive">
          <component :is="Component" :key="String(route.name || route.path)" />
        </KeepAlive>

        <component :is="Component" v-else :key="route.fullPath" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "AppRouterView",
});
</script>

<style lang="scss" scoped>
.app-router-view {
  height: 100%;
}

.route-switch-enter-active,
.route-switch-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  will-change: opacity, transform;
}

.route-switch-enter-from,
.route-switch-leave-to {
  opacity: 0;
}

.route-switch-enter-from {
  transform: translateX(16px);
}

.route-switch-leave-to {
  transform: translateX(-16px);
}

@media (prefers-reduced-motion: reduce) {
  .route-switch-enter-active,
  .route-switch-leave-active {
    transition: none;
  }
}
</style>
