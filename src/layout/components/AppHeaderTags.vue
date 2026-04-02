<template>
  <div class="flex h-[38px] items-center bg-app-surface px-2">
    <el-scrollbar class="header-tags-scrollbar h-full min-w-0 flex-1">
      <transition-group name="tags" tag="div" class="flex h-full min-w-max items-stretch">
        <div
          v-for="tag in tabsStore.tabs"
          :key="tag.path"
          class="group/tag relative inline-flex h-[38px] cursor-pointer select-none items-center whitespace-nowrap border-0 border-r border-solid border-transparent bg-transparent px-3 text-[13px] transition-all duration-300 active:scale-[0.96] max-md:px-2.5"
          :class="[
            activeTagPath === tag.path
              ? 'bg-primary/5 text-primary'
              : 'text-app-text-secondary hover:bg-primary/5 hover:text-primary',
          ]"
          :title="tag.title"
          @click="handleTagClick(tag)"
        >
          <span
            class="max-w-[140px] overflow-hidden text-ellipsis transition-transform duration-300 max-[960px]:max-w-[112px]"
            :class="activeTagPath === tag.path ? 'scale-[1.03] font-medium' : 'scale-100'"
          >
            {{ tag.title }}
          </span>

          <!-- 选中时的底部蓝线改为从中间向两边展开的丝滑动画 -->
          <div
            class="absolute bottom-0 left-0 right-0 h-[2px] origin-center bg-primary transition-transform duration-300 ease-out"
            :class="activeTagPath === tag.path ? 'scale-x-100' : 'scale-x-0'"
          ></div>

          <button
            v-if="tag.closable"
            type="button"
            class="ml-1.5 inline-flex h-[14px] w-[14px] shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 leading-none text-inherit transition-all duration-200 hover:!bg-primary/10 hover:!text-primary"
            :class="[
              activeTagPath === tag.path ? 'opacity-100' : 'opacity-0 group-hover/tag:opacity-100',
            ]"
            :aria-label="`关闭${tag.title}`"
            @click.stop="handleTagClose(tag)"
          >
            <el-icon :size="10" class="flex items-center justify-center leading-none"
              ><Close
            /></el-icon>
          </button>
        </div>
      </transition-group>
    </el-scrollbar>

    <el-dropdown
      class="group/action"
      placement="bottom-end"
      trigger="click"
      :disabled="!hasClosableTags"
    >
      <button
        type="button"
        class="ml-2 inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border border-solid border-app-border bg-transparent p-0 text-app-text-secondary transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45 max-md:ml-1.5"
        :class="
          !hasClosableTags ? '' : 'hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
        "
        :disabled="!hasClosableTags"
      >
        <el-icon
          :size="12"
          class="transition-transform duration-200"
          :class="!hasClosableTags ? '' : 'group-hover/action:translate-y-[1px]'"
          ><ArrowDown
        /></el-icon>
      </button>

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

<style scoped>
.header-tags-scrollbar :deep(.el-scrollbar__wrap) {
  height: 100%;
  overflow-y: hidden;
  scrollbar-width: none;
}

.header-tags-scrollbar :deep(.el-scrollbar__wrap::-webkit-scrollbar) {
  display: none;
  width: 0;
  height: 0;
}

.header-tags-scrollbar :deep(.el-scrollbar__view) {
  height: 100%;
}

.header-tags-scrollbar :deep(.el-scrollbar__bar.is-vertical) {
  display: none !important;
  width: 0 !important;
}

.header-tags-scrollbar :deep(.el-scrollbar__bar.is-horizontal) {
  height: 4px;
}

.header-tags-scrollbar :deep(.el-scrollbar__thumb) {
  background-color: rgb(var(--app-primary-rgb) / 22%);
}

/* ==================== 标签页丝滑增删动画 ==================== */
.group\/tag {
  /* 基础最大宽度限制（需设在一个固定的最大值方便 CSS 从 0 过渡），内部文本溢出的 span 会自行裁剪 */
  max-width: 200px;
}

.tags-move,
.tags-enter-active,
.tags-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.2, 1);

  /* 宽度塌陷时必须配合 hidden，否则文字会溢出撑起父元素高度 */
  overflow: hidden;
}

.tags-enter-from,
.tags-leave-to {
  opacity: 0;
  transform: translateY(15px);

  /* 退场或入场时不仅淡出下沉，而且内外边距与最大宽度全面塌缩为0，使得右侧所有标签如丝般顺滑补位 */
  max-width: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  border-width: 0 !important;
}
</style>
