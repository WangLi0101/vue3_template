<template>
  <el-sub-menu v-if="item.children?.length" :index="item.path">
    <template #title>
      <el-icon v-if="item.icon">
        <IconifyIconOnline :icon="normalizeIcon(item.icon)" class="text-xl" />
      </el-icon>
      <span>{{ item.title }}</span>
    </template>

    <SidebarItem v-for="child in item.children" :key="child.path" :item="child" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.path">
    <el-icon v-if="item.icon">
      <IconifyIconOnline :icon="normalizeIcon(item.icon)" class="text-xl" />
    </el-icon>
    <template #title>
      <span>{{ item.title }}</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { IconifyIconOnline } from "@/components/ReIcon";
import type { SidebarMenuItem } from "@/utils/menu";

defineOptions({
  name: "SidebarItem",
});

interface Props {
  item: SidebarMenuItem;
}

defineProps<Props>();

const normalizeIcon = (icon?: string): string => icon ?? "codicon:blank";
</script>
