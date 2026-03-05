import type { RouteRecordRaw } from 'vue-router'

interface RouteModuleExport {
  default?: RouteRecordRaw | RouteRecordRaw[]
  routes?: RouteRecordRaw | RouteRecordRaw[]
}

const routeModules = import.meta.glob<RouteModuleExport>('./modules/**/*.ts', { eager: true })

const normalizeRoutes = (input?: RouteRecordRaw | RouteRecordRaw[]): RouteRecordRaw[] => {
  if (!input) return []
  return Array.isArray(input) ? input : [input]
}

// 自动聚合 router/modules 下所有路由模块，挂载到 Root.children
export const rootRouteModules: RouteRecordRaw[] = Object.values(routeModules).flatMap((module) => {
  return [...normalizeRoutes(module.default), ...normalizeRoutes(module.routes)]
})
