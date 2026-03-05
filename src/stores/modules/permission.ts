import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw, Router } from 'vue-router'

export const usePermissionStore = defineStore('permission', () => {
  const isRoutesMounted = ref(false)
  const removeRouteCallbacks = ref<Array<() => void>>([])

  const clearMountedRoutes = (): void => {
    removeRouteCallbacks.value.forEach((removeRoute) => {
      removeRoute()
    })
    removeRouteCallbacks.value = []
    isRoutesMounted.value = false
  }

  const mountDynamicRoutes = (router: Router, routes: RouteRecordRaw[]): void => {
    if (isRoutesMounted.value) return

    routes.forEach((route: RouteRecordRaw) => {
      if (route.name && router.hasRoute(route.name)) return
      const removeRoute = router.addRoute('Root', route)
      removeRouteCallbacks.value.push(removeRoute)
    })

    isRoutesMounted.value = true
  }

  const reset = (): void => {
    clearMountedRoutes()
  }

  return {
    isRoutesMounted,
    mountDynamicRoutes,
    reset
  }
})
