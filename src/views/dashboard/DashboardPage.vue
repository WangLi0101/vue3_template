<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'

const authStore = useAuthStore()

const stats = computed(() => [
  { label: '当前用户', value: authStore.user?.displayName || '--' },
  { label: '角色数量', value: authStore.roles.length },
  { label: '权限点数量', value: authStore.permissions.size },
  { label: '菜单节点数量', value: authStore.menus.length }
])
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <template #header>
        <div class="font-semibold">欢迎使用 RBAC 管理后台</div>
      </template>

      <div class="text-[var(--app-text-secondary)] leading-7">
        当前版本采用单 Token 鉴权，不启用 Refresh Token。
      </div>
    </el-card>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <el-card v-for="item in stats" :key="item.label" shadow="never">
        <div class="text-sm text-[var(--app-text-secondary)]">{{ item.label }}</div>
        <div class="text-2xl font-semibold text-[var(--app-text-primary)] mt-2">{{ item.value }}</div>
      </el-card>
    </div>
  </div>
</template>
