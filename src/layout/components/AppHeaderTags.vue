<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Close } from "@element-plus/icons-vue";
import { useTabsStore } from "@/stores/modules/tabs";
import type { RouteTag } from "@/stores/modules/tabs";

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();

const activeTagPath = computed(() => route.path);

const handleTagClick = async (tag: RouteTag): Promise<void> => {
  if (route.fullPath === tag.fullPath) return;
  await router.push(tag.fullPath);
};

const handleTagClose = async (tag: RouteTag): Promise<void> => {
  const fallbackFullPath = tabsStore.removeTag(tag.path);
  if (route.path === tag.path && fallbackFullPath) {
    await router.push(fallbackFullPath);
  }
};
</script>

<template>
  <div
    class="app-header-tags h-11 px-4 bg-app-header transition-colors duration-300 flex items-center [border-top:1px_solid_var(--app-border)] [border-bottom:1px_solid_var(--app-border)]"
  >
    <el-scrollbar class="w-full flex-1">
      <div class="h-full flex items-center gap-1.5 pr-2">
        <div
          v-for="tag in tabsStore.tabs"
          :key="tag.path"
          class="tag-item group flex items-center h-7 pl-3 pr-2 mt-[7px] mb-[7px] text-[13px] rounded-md border transition-all duration-200 cursor-pointer select-none whitespace-nowrap shrink-0"
          :class="[
            activeTagPath === tag.path
              ? 'is-active bg-[color:rgb(var(--app-primary-rgb)/0.14)] border-[color:rgb(var(--app-primary-rgb)/0.38)] text-primary font-medium'
              : 'bg-app-surface border-app-border text-app-text-secondary hover:bg-app-surface-hover hover:border-app-border-hover hover:text-app-text-primary',
          ]"
          @click="handleTagClick(tag)"
        >
          <span class="max-w-[140px] truncate">{{ tag.title }}</span>
          <div
            v-if="tag.closable"
            class="ml-1 w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
            :class="
              activeTagPath === tag.path
                ? 'opacity-100 text-primary/80 hover:text-primary hover:bg-[color:rgb(var(--app-primary-rgb)/0.2)]'
                : 'opacity-0 group-hover:opacity-100 text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-mute'
            "
            @click.stop="handleTagClose(tag)"
          >
            <el-icon :size="10"><Close /></el-icon>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.tag-item {
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.03);
}

.tag-item.is-active {
  box-shadow: 0 6px 12px -9px rgb(var(--app-primary-rgb) / 0.65);
}

.app-header-tags :deep(.el-scrollbar__bar.is-horizontal) {
  height: 6px;
}

.app-header-tags :deep(.el-scrollbar__thumb) {
  background-color: rgb(var(--app-primary-rgb) / 0.24);
}
</style>
