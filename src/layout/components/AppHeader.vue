<script setup lang="ts">
import { Expand, Fold, Setting } from "@element-plus/icons-vue";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppHeaderTags from "@/layout/components/AppHeaderTags.vue";
import AppSettingsDrawer from "@/layout/components/AppSettingsDrawer.vue";
import { useAuthStore } from "@/stores/modules/auth";
import { useMenuStore } from "@/stores/modules/menu";
import { usePermissionStore } from "@/stores/modules/permission";
import { useTabsStore } from "@/stores/modules/tabs";
import { useUiStore } from "@/stores/modules/ui";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const menuStore = useMenuStore();
const permissionStore = usePermissionStore();
const tabsStore = useTabsStore();
const uiStore = useUiStore();

const isSettingsDrawerVisible = ref(false);

const title = computed(() => (route.meta.title as string) || "管理后台");
const breadcrumbs = computed(() => menuStore.getBreadcrumbs(route.path));
const sidebarToggleIcon = computed(() =>
  uiStore.isSidebarCollapsed ? Expand : Fold,
);

watch(
  () => route.fullPath,
  () => {
    menuStore.rememberRoute(route.path, route.fullPath);
    tabsStore.addTag({
      title: (route.meta.title as string) || "未命名页面",
      path: route.path,
      fullPath: route.fullPath,
      isPublic: Boolean(route.meta.public),
      hidden: Boolean(route.meta.hidden),
      name: route.name ? String(route.name) : "",
    });
  },
  { immediate: true },
);

const handleLogout = async (): Promise<void> => {
  await authStore.logout();
  menuStore.reset();
  tabsStore.reset();
  permissionStore.reset();
  await router.replace("/login");
};
</script>

<template>
  <header class="bg-[var(--app-surface)] border-b border-[var(--app-border)]">
    <div class="h-14 px-5 flex items-center justify-between">
      <div class="flex items-center gap-3 min-w-0">
        <el-tooltip
          :content="uiStore.isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'"
          placement="bottom"
        >
          <el-button
            text
            circle
            class="!text-[var(--app-text-primary)]"
            @click="uiStore.toggleSidebar"
          >
            <el-icon><component :is="sidebarToggleIcon" /></el-icon>
          </el-button>
        </el-tooltip>

        <div
          class="text-base font-semibold text-[var(--app-text-primary)] shrink-0"
        >
          {{ title }}
        </div>

        <el-divider direction="vertical" />

        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbs"
            :key="`${item.to}-${index}`"
          >
            <span
              :class="[
                'text-sm',
                index === breadcrumbs.length - 1
                  ? 'text-[var(--app-text-primary)]'
                  : 'text-[var(--app-text-secondary)]',
              ]"
            >
              {{ item.title }}
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="flex items-center gap-3">
        <el-dropdown>
          <span
            class="cursor-pointer text-sm text-[var(--app-text-primary)] flex items-center gap-2"
          >
            <el-avatar :size="26">{{
              authStore.user?.displayName?.slice(0, 1) || "U"
            }}</el-avatar>
            {{ authStore.user?.displayName || "未知用户" }}
          </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-tooltip content="系统配置" placement="bottom">
          <el-button
            text
            circle
            class="!text-[var(--app-text-primary)]"
            @click="isSettingsDrawerVisible = true"
          >
            <el-icon><Setting /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <AppHeaderTags />
  </header>

  <AppSettingsDrawer v-model="isSettingsDrawerVisible" />
</template>
