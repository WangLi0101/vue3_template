<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
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
    class="h-11 px-4 border-t border-[var(--app-border)] bg-[var(--app-bg)]/40"
  >
    <el-scrollbar>
      <div class="h-10 flex items-center gap-2 pr-2">
        <el-tag
          v-for="tag in tabsStore.tabs"
          :key="tag.path"
          :closable="tag.closable"
          :type="activeTagPath === tag.path ? 'primary' : 'info'"
          effect="light"
          disable-transitions
          @close="handleTagClose(tag)"
        >
          <span
            class="cursor-pointer select-none"
            @click="handleTagClick(tag)"
            >{{ tag.title }}</span
          >
        </el-tag>
      </div>
    </el-scrollbar>
  </div>
</template>
