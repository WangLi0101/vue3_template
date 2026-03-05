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
    class="h-10 px-4 bg-app-header transition-colors duration-300 flex items-center [border-top:1px_solid_var(--app-border)]"
  >
    <el-scrollbar class="w-full flex-1">
      <div class="h-full flex items-center gap-2 pr-2">
        <div
          v-for="tag in tabsStore.tabs"
          :key="tag.path"
          class="group flex items-center h-[26px] px-3 mt-[7px] mb-[7px] text-[13px] rounded-md border transition-all duration-300 cursor-pointer select-none whitespace-nowrap shrink-0"
          :class="[
            activeTagPath === tag.path
              ? 'bg-[color:rgb(var(--app-primary-rgb)/0.12)] border-primary/40 text-primary font-medium'
              : 'bg-app-surface border-app-border text-app-text-secondary hover:bg-app-surface-hover hover:border-app-border-hover hover:text-app-text-primary',
          ]"
          @click="handleTagClick(tag)"
        >
          <span>{{ tag.title }}</span>
          <div
            v-if="tag.closable"
            class="ml-1.5 w-4 h-4 rounded-full hover:bg-[color:rgb(var(--app-primary-rgb)/0.15)] flex items-center justify-center text-app-text-secondary hover:text-primary transition-colors"
            @click.stop="handleTagClose(tag)"
          >
            <el-icon :size="10"><Close /></el-icon>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
