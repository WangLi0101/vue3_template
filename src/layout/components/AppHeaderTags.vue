<template>
  <div class="app-header-tags">
    <el-scrollbar class="tags-scroll">
      <transition-group name="tag-slide" tag="div" class="tags-track">
        <div
          v-for="tag in tabsStore.tabs"
          :key="tag.path"
          class="tag-item"
          :class="[activeTagPath === tag.path ? 'is-active' : 'is-inactive']"
          :title="tag.title"
          @click="handleTagClick(tag)"
        >
          <span class="tag-title">{{ tag.title }}</span>
          <button
            v-if="tag.closable"
            type="button"
            class="tag-close"
            :aria-label="`关闭${tag.title}`"
            @click.stop="handleTagClose(tag)"
          >
            <el-icon :size="10"><Close /></el-icon>
          </button>
        </div>
      </transition-group>
    </el-scrollbar>

    <el-dropdown
      class="tags-action-dropdown"
      placement="bottom-end"
      trigger="click"
      :disabled="!hasClosableTags"
    >
      <el-button link>
        <el-icon :size="12"><ArrowDown /></el-icon>
      </el-button>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :disabled="!hasClosableTags" @click="handleCloseAll"
            >全部关闭</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowDown, Close } from "@element-plus/icons-vue";
import { useTabsStore } from "@/stores/modules/tabs";
import type { RouteTag } from "@/stores/modules/tabs";

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();

const activeTagPath = computed(() => route.path);
const hasClosableTags = computed(() => tabsStore.tabs.some((tag) => tag.closable));

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

const handleCloseAll = async (): Promise<void> => {
  const isCurrentTagClosable = tabsStore.tabs.some(
    (tag) => tag.path === route.path && tag.closable,
  );
  const fallbackFullPath = tabsStore.removeAllClosableTags();
  if (isCurrentTagClosable && fallbackFullPath) {
    await router.push(fallbackFullPath);
  }
};
</script>

<style scoped lang="scss">
.app-header-tags {
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 8px;
  background-color: var(--app-header-bg);
}

.tags-scroll {
  flex: 1;
  min-width: 0;
}

.tags-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 24px;
  width: 24px;
  margin-left: 8px;
  padding: 0;
  border: 1px solid var(--app-border);
  border-radius: 6px;
  color: var(--app-text-secondary);
  cursor: pointer;
  background-color: transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.tags-action:hover:not(:disabled) {
  color: var(--app-primary);
  border-color: rgb(var(--app-primary-rgb) / 0.4);
  background-color: rgb(var(--app-primary-rgb) / 0.06);
}

.tags-action:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.tags-action :deep(.el-icon) {
  transition: transform 0.2s ease;
}

.tags-action-dropdown:not(.is-disabled):hover .tags-action :deep(.el-icon) {
  transform: translateY(1px);
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
  padding: 0 12px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  font-size: 13px;
  color: var(--app-text-secondary);
  border-right: 1px solid transparent;
  background-color: transparent;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.tag-item.is-inactive:hover {
  color: var(--app-primary);
  background-color: rgb(var(--app-primary-rgb) / 0.04);
}

.tag-item.is-active {
  color: var(--app-primary);
}

.tag-item.is-active::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: var(--app-primary);
}

.tag-title {
  max-width: 140px;
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
  background-color: rgb(var(--app-primary-rgb) / 0.12);
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

@media (max-width: 960px) {
  .tag-title {
    max-width: 112px;
  }
}

@media (max-width: 768px) {
  .tag-item {
    padding: 0 10px;
  }

  .tags-action {
    margin-left: 6px;
  }
}
</style>
