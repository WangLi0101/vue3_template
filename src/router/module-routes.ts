import type { RouteRecordRaw } from 'vue-router'

interface RouteModuleExport {
  default?: RouteRecordRaw | RouteRecordRaw[]
  routes?: RouteRecordRaw | RouteRecordRaw[]
}

const routeModules = import.meta.glob<RouteModuleExport>('./modules/**/*.ts', { eager: true })
const DEFAULT_RANK = Number.MAX_SAFE_INTEGER

const normalizeRoutes = (input?: RouteRecordRaw | RouteRecordRaw[]): RouteRecordRaw[] => {
  if (!input) return []
  return Array.isArray(input) ? input : [input]
}
const getRouteRank = (route: RouteRecordRaw): number => {
  const meta = (route.meta || {}) as Record<string, unknown>
  const rank = meta.rank
  return typeof rank === 'number' && Number.isFinite(rank) ? rank : DEFAULT_RANK
}
const sortRoutesByRank = (routes: RouteRecordRaw[]): RouteRecordRaw[] =>
  routes
    .map((route, index) => ({ route, index }))
    .sort((left, right) => {
      const rankDelta = getRouteRank(left.route) - getRouteRank(right.route)
      return rankDelta === 0 ? left.index - right.index : rankDelta
    })
    .map((item) => item.route)

// 自动聚合 router/modules 下所有路由模块，挂载到 Root.children
export const rootRouteModules: RouteRecordRaw[] = sortRoutesByRank(
  Object.values(routeModules).flatMap((module) => {
    return [...normalizeRoutes(module.default), ...normalizeRoutes(module.routes)]
  })
)
