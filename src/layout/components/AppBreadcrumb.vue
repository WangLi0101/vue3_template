<template>
  <div
    class="min-w-0 [&_.el-breadcrumb]:text-[12px] [&_.el-breadcrumb]:leading-none [&_.el-breadcrumb__item]:inline-flex [&_.el-breadcrumb__item]:items-center [&_.el-breadcrumb__separator]:mx-[6px] [&_.el-breadcrumb__separator]:text-[var(--app-text-disabled)]"
  >
    <el-breadcrumb separator="/">
      <!-- 使用 TransitionGroup 管理整个层级，使进入、离开、改变顺序都有动画 -->
      <TransitionGroup name="breadcrumb">
        <!-- 重点：必须用唯一的值 (例如路由路径) 作为 key，不能用 index -->
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.to || item.title">
          <span
            v-if="isActiveItem(index)"
            class="inline-flex items-center leading-none text-sm font-medium text-app-text-primary"
          >
            {{ item.title }}
          </span>
          <button
            v-else
            type="button"
            class="inline-flex items-center leading-none border-0 bg-transparent p-0 text-sm text-app-text-secondary transition-colors hover:text-primary cursor-pointer"
          >
            {{ item.title }}
          </button>
        </el-breadcrumb-item>
      </TransitionGroup>
    </el-breadcrumb>
  </div>
</template>

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

<style lang="scss" scoped>
/* 面包屑列表级过渡动画 */
.breadcrumb-move,
.breadcrumb-enter-active {
  /* 进入和移动保持 0.5s 的松弛感 */
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.2, 1);
}

.breadcrumb-leave-active {
  /* 离开的时候必须极快 (0.2s 甚至更短)，并且置于底层，以防止和新文字重叠产生残影 */
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.2, 1);
  position: absolute;
  z-index: -1;
}

.breadcrumb-enter-from {
  opacity: 0;
  /* 为了避免水平文字重叠穿透，我们改为与主体视图一致的“上下浮上”效果 */
  transform: translateY(10px);
}

.breadcrumb-leave-to {
  opacity: 0;
  /* 老旧面包屑向上方轻轻飘走消失 */
  transform: translateY(-10px);
}
</style>
