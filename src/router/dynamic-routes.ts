import type { AppMenu } from '@/types/auth'
import AppRouterView from '@/components/AppRouterView.vue'
import type { RouteRecordRaw } from 'vue-router'

const viewModules = import.meta.glob('../views/**/*.vue')

const normalizeComponent = (component: string): string => component.replace(/^\/+/, '').replace(/\/+$/, '')

const resolveComponent = (component: string): RouteRecordRaw['component'] => {
  if (component === 'router-view') {
    return AppRouterView
  }

  const key = `../views/${normalizeComponent(component)}.vue`
  const loader = viewModules[key]

  if (!loader) {
    console.warn(`[RBAC] 未找到组件: ${component}`)
    return () => import('@/views/error/NotFoundPage.vue')
  }

  return loader
}

const menuToRoute = (menu: AppMenu): RouteRecordRaw => {
  const route = {
    path: menu.path,
    name: menu.name,
    component: resolveComponent(menu.component),
    meta: {
      ...menu.meta,
      requiresAuth: true
    }
  } as RouteRecordRaw

  if (menu.redirect) {
    route.redirect = menu.redirect
  }

  if (menu.children?.length) {
    route.children = menu.children.map(menuToRoute)
  }

  return route
}

export const buildRoutesFromMenus = (menus: AppMenu[]): RouteRecordRaw[] => menus.map(menuToRoute)
