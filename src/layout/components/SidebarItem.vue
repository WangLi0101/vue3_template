<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import type { SidebarMenuItem } from '@/stores/modules/menu'

interface Props {
  item: SidebarMenuItem
}

defineProps<Props>()
</script>

<template>
  <el-sub-menu v-if="item.children?.length" :index="item.path">
    <template #title>
      <AppIcon :name="item.icon" />
      <span>{{ item.title }}</span>
    </template>

    <SidebarItem v-for="child in item.children" :key="child.path" :item="child" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.path">
    <AppIcon :name="item.icon" />
    <span>{{ item.title }}</span>
  </el-menu-item>
</template>
