import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { buildRoutesFromMenus } from '@/router/dynamic-routes'
import type { AppMenu } from '@/types/auth'
import type { RouteRecordRaw } from 'vue-router'

export interface SidebarMenuItem {
  id: string
  name: string
  path: string
  title: string
  icon?: string
  children?: SidebarMenuItem[]
}

export interface BreadcrumbItem {
  title: string
  to: string
}

const joinPath = (parentPath: string, currentPath: string): string => {
  if (currentPath.startsWith('/')) return currentPath

  const normalizedParent = parentPath === '/' ? '' : parentPath
  const merged = `${normalizedParent}/${currentPath}`
  return merged.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
}

const toSidebarMenus = (menus: AppMenu[], parentPath = ''): SidebarMenuItem[] => {
  return menus
    .filter((menu) => !menu.meta.hidden)
    .map((menu) => {
      const currentPath = joinPath(parentPath, menu.path)
      const children = menu.children?.length ? toSidebarMenus(menu.children, currentPath) : undefined

      return {
        id: menu.id,
        name: menu.name,
        path: currentPath,
        title: menu.meta.title,
        icon: menu.meta.icon,
        children
      }
    })
}

const findBreadcrumbChain = (
  menus: SidebarMenuItem[],
  targetPath: string,
  parentChain: SidebarMenuItem[] = []
): SidebarMenuItem[] => {
  for (const menu of menus) {
    const chain = [...parentChain, menu]
    if (menu.path === targetPath) {
      return chain
    }

    if (!menu.children?.length) continue
    const childChain = findBreadcrumbChain(menu.children, targetPath, chain)
    if (childChain.length) {
      return childChain
    }
  }

  return []
}

export const useMenuStore = defineStore('menu', () => {
  const rawMenus = ref<AppMenu[]>([])
  const pathFullPathMap = ref<Record<string, string>>({})

  const sidebarMenus = computed<SidebarMenuItem[]>(() => toSidebarMenus(rawMenus.value))
  const dynamicRoutes = computed<RouteRecordRaw[]>(() => buildRoutesFromMenus(rawMenus.value))

  const setMenus = (menus: AppMenu[]): void => {
    rawMenus.value = menus
  }

  const rememberRoute = (path: string, fullPath: string): void => {
    if (!path || !fullPath) return
    pathFullPathMap.value[path] = fullPath
  }

  const getBreadcrumbs = (path: string): BreadcrumbItem[] => {
    const home: BreadcrumbItem = {
      title: '首页',
      to: pathFullPathMap.value['/dashboard'] || '/dashboard'
    }

    if (path === '/dashboard') {
      return [home]
    }

    const chain = findBreadcrumbChain(sidebarMenus.value, path).map((menu) => ({
      title: menu.title,
      to: pathFullPathMap.value[menu.path] || menu.path
    }))

    if (!chain.length) {
      return [home]
    }

    if (chain[0].to !== '/dashboard' && !chain[0].to.startsWith('/dashboard?')) {
      return [home, ...chain]
    }

    chain[0] = home
    return chain
  }

  const reset = (): void => {
    rawMenus.value = []
    pathFullPathMap.value = {}
  }

  return {
    rawMenus,
    sidebarMenus,
    dynamicRoutes,
    setMenus,
    rememberRoute,
    getBreadcrumbs,
    reset
  }
})
