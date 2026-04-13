<template>
  <el-dropdown>
    <button
      type="button"
      class="inline-flex cursor-pointer items-center gap-2 rounded border-0 bg-transparent px-1 py-0.5 text-app-text-primary transition-colors duration-200 hover:bg-[var(--el-fill-color-light)]"
      aria-label="打开用户菜单"
    >
      <el-avatar
        :size="24"
        class="flex shrink-0 items-center justify-center bg-primary/90 text-white"
      >
        {{ avatarFallback }}
      </el-avatar>
      <span
        class="max-w-[72px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium md:max-w-[96px]"
      >
        {{ displayName }}
      </span>
    </button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleLogout"> 退出登录 </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/modules/auth";

const authStore = useAuthStore();

const displayName = computed(() => authStore.user?.displayName || "未知用户");
const avatarFallback = computed(() => displayName.value.slice(0, 1) || "U");

const handleLogout = async (): Promise<void> => {
  await authStore.logoutLocal();
};
</script>
