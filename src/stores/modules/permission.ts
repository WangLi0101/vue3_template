import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { RouteRecordRaw, Router } from "vue-router";

type AccessValue = string | string[];

export const usePermissionStore = defineStore("permission", () => {
  const roles = ref<string[]>([]);
  const permissions = ref<Set<string>>(new Set());
  const isRoutesMounted = ref(false);
  const removeRouteCallbacks = ref<Array<() => void>>([]);

  const roleSet = computed(() => new Set(roles.value));

  const asArray = (required: AccessValue): string[] =>
    Array.isArray(required) ? required : [required];

  const hasAny = (required: AccessValue): boolean => {
    const targets = asArray(required);
    return targets.some((permission) => permissions.value.has(permission));
  };

  const hasAll = (required: AccessValue): boolean => {
    const targets = asArray(required);
    return targets.every((permission) => permissions.value.has(permission));
  };

  const hasRole = (required: AccessValue): boolean => {
    const targets = asArray(required);
    return targets.some((role) => roleSet.value.has(role));
  };

  const setAccess = (nextRoles: string[], nextPermissions: string[]): void => {
    roles.value = nextRoles;
    permissions.value = new Set(nextPermissions);
  };

  const clearMountedRoutes = (): void => {
    removeRouteCallbacks.value.forEach((removeRoute) => {
      removeRoute();
    });
    removeRouteCallbacks.value = [];
    isRoutesMounted.value = false;
  };

  const mountDynamicRoutes = (
    router: Router,
    routes: RouteRecordRaw[],
  ): void => {
    if (isRoutesMounted.value) return;

    routes.forEach((route: RouteRecordRaw) => {
      if (route.name && router.hasRoute(route.name)) return;
      const removeRoute = router.addRoute("Root", route);
      removeRouteCallbacks.value.push(removeRoute);
    });

    isRoutesMounted.value = true;
  };

  const reset = (): void => {
    roles.value = [];
    permissions.value = new Set();
    clearMountedRoutes();
  };

  return {
    roles,
    permissions,
    isRoutesMounted,
    hasAny,
    hasAll,
    hasRole,
    setAccess,
    mountDynamicRoutes,
    reset,
  };
});
