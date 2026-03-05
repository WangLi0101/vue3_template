<script setup lang="ts">
defineOptions({
  name: 'AppRouterView'
})
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <KeepAlive>
      <component
        :is="Component"
        v-if="route.meta.keepAlive"
        :key="String(route.name || route.path)"
      />
    </KeepAlive>

    <component
      :is="Component"
      v-if="!route.meta.keepAlive"
      :key="route.fullPath"
    />
  </RouterView>
</template>
