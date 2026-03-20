<template>
  <div class="flex items-center h-[38px] px-2 bg-app-surface">
    <el-scrollbar class="header-tags-scrollbar flex-1 min-w-0 h-full">
      <transition-group
        name="tags"
        tag="div"
        class="flex items-stretch h-full min-w-max"
      >
        <div
          v-for="tag in tabsStore.tabs"
          :key="tag.path"
          class="relative inline-flex items-center h-[38px] px-3 cursor-pointer select-none whitespace-nowrap text-[13px] border-0 border-r border-solid border-transparent bg-transparent transition-all duration-300 active:scale-[0.96] group/tag max-md:px-2.5"
          :class="[
            activeTagPath === tag.path
              ? 'text-primary bg-primary/5'
              : 'text-app-text-secondary hover:text-primary hover:bg-primary/5'
          ]"
          :title="tag.title"
          @click="handleTagClick(tag)"
        >
          <span
            class="overflow-hidden text-ellipsis transition-transform duration-300 max-[960px]:max-w-[112px] max-w-[140px]"
            :class="activeTagPath === tag.path ? 'font-medium scale-[1.03]' : 'scale-100'"
          >
            {{ tag.title }}
          </span>

          <!-- 选中时的底部蓝线改为从中间向两边展开的丝滑动画 -->
          <div
            class="absolute left-0 right-0 bottom-0 h-[2px] bg-primary transition-transform duration-300 ease-out origin-center"
            :class="activeTagPath === tag.path ? 'scale-x-100' : 'scale-x-0'"
          ></div>

          <button
            v-if="tag.closable"
            type="button"
            class="inline-flex items-center justify-center w-[14px] h-[14px] ml-1.5 p-0 border-0 rounded-sm leading-none text-inherit shrink-0 cursor-pointer bg-transparent transition-all duration-200 hover:!bg-primary/10 hover:!text-primary"
            :class="[activeTagPath === tag.path ? 'opacity-100' : 'opacity-0 group-hover/tag:opacity-100']"
            :aria-label="`关闭${tag.title}`"
            @click.stop="handleTagClose(tag)"
          >
            <el-icon :size="10" class="flex items-center justify-center leading-none"><Close /></el-icon>
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
        class="inline-flex items-center justify-center shrink-0 w-6 h-6 ml-2 max-md:ml-1.5 p-0 border border-solid border-app-border rounded-md text-app-text-secondary cursor-pointer bg-transparent transition-all duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
        :class="!hasClosableTags ? '' : 'hover:text-primary hover:border-primary/40 hover:bg-primary/5'"
        :disabled="!hasClosableTags"
      >
        <el-icon :size="12" class="transition-transform duration-200" :class="!hasClosableTags ? '' : 'group-hover/action:translate-y-[1px]'"><ArrowDown /></el-icon>
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
  background-color: rgb(var(--app-primary-rgb) / 0.22);
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
