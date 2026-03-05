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
      <el-icon v-if="item.icon">
        <IconifyIconOnline :icon="normalizeIcon(item.icon)" class="text-xl" />
      </el-icon>
      <span>{{ item.title }}</span>
    </template>

    <SidebarItem
      v-for="child in item.children"
      :key="child.path"
      :item="child"
    />
  </el-sub-menu>

  <el-menu-item v-else :index="item.path">
    <el-icon v-if="item.icon">
      <IconifyIconOnline :icon="normalizeIcon(item.icon)" class="!text-xl" />
    </el-icon>
    <template #title>
      <span>{{ item.title }}</span>
    </template>
  </el-menu-item>
</template>
<style lang="scss">
.el-menu-item.is-active .el-menu-tooltip__trigger {
  padding-left: 0 !important;
  padding-right: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
