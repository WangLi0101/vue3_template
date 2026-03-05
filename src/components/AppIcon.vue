<script setup lang="ts">
import * as ElementIcons from '@element-plus/icons-vue'
import type { Component } from 'vue'
import { computed } from 'vue'
import IconMdiAccountGroup from '~icons/mdi/account-group'
import IconMdiShieldKey from '~icons/mdi/shield-key'
import IconMdiSitemap from '~icons/mdi/sitemap'
import IconMdiViewDashboard from '~icons/mdi/view-dashboard'

interface Props {
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: ''
})

const iconifyMap: Record<string, Component> = {
  'mdi:view-dashboard': IconMdiViewDashboard,
  'mdi:account-group': IconMdiAccountGroup,
  'mdi:sitemap': IconMdiSitemap,
  'mdi:shield-key': IconMdiShieldKey
}

const fallbackIcon = ElementIcons.QuestionFilled

const resolvedIcon = computed<Component>(() => {
  if (!props.name) return fallbackIcon

  if (props.name.startsWith('el:')) {
    const iconName = props.name.replace('el:', '')
    return (ElementIcons as Record<string, Component>)[iconName] || fallbackIcon
  }

  if (props.name.startsWith('icon:')) {
    const iconName = props.name.replace('icon:', '')
    return iconifyMap[iconName] || fallbackIcon
  }

  return fallbackIcon
})
</script>

<template>
  <el-icon>
    <component :is="resolvedIcon" />
  </el-icon>
</template>
