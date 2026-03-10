<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "@/stores/modules/menu";

defineOptions({
  name: "AppBreadcrumb",
});

const route = useRoute();
const menuStore = useMenuStore();

const breadcrumbs = computed(() => menuStore.getBreadcrumbs(route.path));

const isActiveItem = (index: number): boolean => index === breadcrumbs.value.length - 1;
</script>

<template>
  <div class="app-breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
        <Transition name="breadcrumb-item" mode="out-in">
          <span
            v-if="isActiveItem(index)"
            :key="`active-${item.to}`"
            class="breadcrumb-item-content text-sm font-medium text-app-text-primary"
          >
            {{ item.title }}
          </span>
          <button
            v-else
            :key="`link-${item.to}`"
            type="button"
            class="breadcrumb-item-content border-0 bg-transparent p-0 text-sm text-app-text-secondary transition-colors hover:text-primary"
          >
            {{ item.title }}
          </button>
        </Transition>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped lang="scss">
.app-breadcrumb {
  min-width: 0;
}

.breadcrumb-item-content {
  display: inline-flex;
  align-items: center;
}

.breadcrumb-item-enter-active,
.breadcrumb-item-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  will-change: opacity, transform;
}

.breadcrumb-item-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.breadcrumb-item-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .breadcrumb-item-enter-active,
  .breadcrumb-item-leave-active {
    transition: none;
  }
}
</style>
