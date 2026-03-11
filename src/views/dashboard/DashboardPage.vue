<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <template #header>
        <div class="font-semibold">欢迎使用 RBAC 管理后台</div>
      </template>

      <div class="leading-7 text-app-text-secondary">
        当前版本采用单 Token 鉴权，不启用 Refresh Token。
      </div>
    </el-card>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <el-card v-for="item in stats" :key="item.label" shadow="never">
        <div class="text-sm text-app-text-secondary">
          {{ item.label }}
        </div>
        <div class="mt-2 text-2xl font-semibold text-app-text-primary">
          {{ item.value }}
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/modules/auth";
import { useMenuStore } from "@/stores/modules/menu";
import { usePermissionStore } from "@/stores/modules/permission";

const authStore = useAuthStore();
const menuStore = useMenuStore();
const permissionStore = usePermissionStore();

const stats = computed(() => [
  { label: "当前用户", value: authStore.user?.displayName || "--" },
  { label: "角色数量", value: permissionStore.roles.length },
  { label: "权限点数量", value: permissionStore.permissions.size },
  { label: "菜单节点数量", value: menuStore.rawMenus.length },
]);
</script>
