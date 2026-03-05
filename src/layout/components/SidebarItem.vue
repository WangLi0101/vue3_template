<script setup lang="ts">
import { IconifyIconOnline } from "@/components/ReIcon";
import type { SidebarMenuItem } from "@/stores/modules/menu";

interface Props {
  item: SidebarMenuItem;
}

defineProps<Props>();

const normalizeIcon = (icon?: string): string => {
  if (!icon) return "codicon:blank";
  return icon;
};
</script>

<template>
  <el-sub-menu v-if="item.children?.length" :index="item.path">
    <template #title>
      <el-icon class="sidebar-icon">
        <IconifyIconOnline :icon="normalizeIcon(item.icon)" />
      </el-icon>
      <span class="sidebar-title">{{ item.title }}</span>
    </template>

    <SidebarItem
      v-for="child in item.children"
      :key="child.path"
      :item="child"
    />
  </el-sub-menu>

  <el-menu-item v-else :index="item.path">
    <el-icon class="sidebar-icon">
      <IconifyIconOnline :icon="normalizeIcon(item.icon)" />
    </el-icon>
    <template #title>
      <span class="sidebar-title">{{ item.title }}</span>
    </template>
  </el-menu-item>
</template>

<style lang="scss" scoped>
.sidebar-icon {
  font-size: 18px !important;
  margin-right: 10px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  opacity: 0.85;
}

.sidebar-title {
  font-size: 14.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  transition: all 0.3s ease;
}

:global(.el-menu-item:hover .sidebar-icon),
:global(.el-sub-menu .el-sub-menu__title:hover .sidebar-icon),
:global(.el-menu-item.is-active .sidebar-icon) {
  opacity: 1;
  transform: scale(1.15);
  color: var(--el-color-primary) !important;
}

:global(.el-menu--collapse .sidebar-title) {
  display: none !important;
}

:global(.el-menu--collapse .sidebar-icon) {
  margin-right: 0 !important;
}
</style>
