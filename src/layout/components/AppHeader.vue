<script setup lang="ts">
import { Expand, Fold, Setting } from "@element-plus/icons-vue";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppBreadcrumb from "@/layout/components/AppBreadcrumb.vue";
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
  <header class="bg-app-header z-10 sticky top-0 transition-colors duration-300">
    <div class="h-14 px-5 flex items-center justify-between">
      <div class="flex items-center gap-3 min-w-0">
        <el-tooltip
          :content="uiStore.isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'"
          placement="bottom"
        >
          <el-button
            text
            circle
            class="!text-app-text-primary hover:!bg-app-bg-mute"
            @click="uiStore.toggleSidebar"
          >
            <el-icon><component :is="sidebarToggleIcon" /></el-icon>
          </el-button>
        </el-tooltip>

        <div
          class="text-base font-semibold text-app-text-primary shrink-0 tracking-wide"
        >
          {{ title }}
        </div>

        <el-divider direction="vertical" />
        <AppBreadcrumb />
      </div>

      <div class="flex items-center gap-3">
        <el-dropdown>
          <span
            class="cursor-pointer text-sm text-app-text-primary flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <el-avatar :size="26">{{
              authStore.user?.displayName?.slice(0, 1) || "U"
            }}</el-avatar>
            {{ authStore.user?.displayName || "未知用户" }}
          </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-tooltip content="系统配置" placement="bottom">
          <el-button
            text
            circle
            class="!text-app-text-primary hover:!bg-app-bg-mute transition-colors"
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

