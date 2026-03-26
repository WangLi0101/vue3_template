<template>
  <div class="app-router-view">
    <RouterView v-slot="{ Component, route }">
      <template v-if="route.meta.keepAlive">
        <Transition name="route-switch" mode="out-in">
          <KeepAlive>
            <component :is="Component" :key="String(route.name || route.path)" />
          </KeepAlive>
        </Transition>
      </template>

      <template v-else>
        <Transition name="route-switch" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </template>
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
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
}

.route-switch-enter-from,
.route-switch-leave-to {
  opacity: 0;
}

.route-switch-enter-from {
  transform: translateY(10px);
}

.route-switch-leave-to {
  transform: translateY(-10px);
}

@media (prefers-reduced-motion: reduce) {
  .route-switch-enter-active,
  .route-switch-leave-active {
    transition: none;
  }
}
</style>
