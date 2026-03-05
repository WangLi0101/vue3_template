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
  <div class="app-header-tags">
    <el-scrollbar class="tags-scroll">
      <transition-group name="tag-slide" tag="div" class="tags-track">
        <div
          v-for="tag in tabsStore.tabs"
          :key="tag.path"
          class="tag-item"
          :class="[activeTagPath === tag.path ? 'is-active' : 'is-inactive']"
          @click="handleTagClick(tag)"
        >
          <span class="tag-title">{{ tag.title }}</span>
          <button
            v-if="tag.closable"
            type="button"
            class="tag-close"
            @click.stop="handleTagClose(tag)"
          >
            <el-icon :size="10"><Close /></el-icon>
          </button>
        </div>
      </transition-group>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.app-header-tags {
  display: flex;
  align-items: stretch;
  height: 36px;
  border-top: 1px solid var(--app-border);
  border-bottom: 1px solid var(--app-border);
}

.tags-scroll {
  flex: 1;
}

.app-header-tags :deep(.el-scrollbar),
.app-header-tags :deep(.el-scrollbar__wrap),
.app-header-tags :deep(.el-scrollbar__view) {
  height: 100%;
}

.tags-track {
  display: flex;
  align-items: stretch;
  height: 100%;
  min-width: max-content;
}

.tag-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 14px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  font-size: 13px;
  color: var(--app-text-primary);
  border-right: 1px solid var(--app-border);
  background-color: rgb(var(--app-primary-rgb) / 0.03);
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.tag-item:first-child {
  border-left: 1px solid var(--app-border);
}

.tag-item.is-inactive:hover {
  color: var(--app-primary);
  background-color: rgb(var(--app-primary-rgb) / 0.08);
}

.tag-item.is-active {
  color: var(--app-primary);
  background-color: rgb(var(--app-primary-rgb) / 0.12);
}

.tag-item.is-active::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  background-color: var(--app-primary);
}

.tag-title {
  max-width: 164px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-item.is-active .tag-title {
  font-weight: 500;
}

.tag-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 6px;
  padding: 0;
  border: 0;
  border-radius: 2px;
  line-height: 1;
  color: inherit;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0;
  background: transparent;
  transition: opacity 0.2s ease;
}

.tag-close :deep(.el-icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.tag-item:hover .tag-close,
.tag-item.is-active .tag-close {
  opacity: 1;
}

.tag-close:hover {
  color: var(--app-primary);
  background-color: rgb(var(--app-primary-rgb) / 0.14);
}

.tag-slide-enter-active,
.tag-slide-leave-active {
  transition: all 0.2s ease;
}

.tag-slide-move {
  transition: transform 0.2s ease;
}

.tag-slide-enter-from,
.tag-slide-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.app-header-tags :deep(.el-scrollbar__bar.is-horizontal) {
  height: 4px;
}

.app-header-tags :deep(.el-scrollbar__thumb) {
  background-color: rgb(var(--app-primary-rgb) / 0.22);
}
</style>
