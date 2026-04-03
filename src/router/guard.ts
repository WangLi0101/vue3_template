import { useAuthStore } from "@/stores/modules/auth";
import { useMenuStore } from "@/stores/modules/menu";
import { usePermissionStore } from "@/stores/modules/permission";
import { getAccessToken } from "@/utils/token";
import type { Router } from "vue-router";
import NProgress from "@/utils/progress";

const resolveRootRedirectTarget = (path: string, homeMenuPath: string): string | null => {
  if (path !== "/") return null;
  if (!homeMenuPath || homeMenuPath === "/") {
    return null;
  }

  return homeMenuPath;
};

export const setupRouterGuards = (router: Router): void => {
  router.beforeEach(async (to, from) => {
    if (to.fullPath !== from.fullPath) {
      NProgress.start();
    }
    const authStore = useAuthStore();
    const menuStore = useMenuStore();
    const permissionStore = usePermissionStore();

    if (to.meta.skipAuth) {
      if (to.name === "Login" && getAccessToken()) {
        return "/";
      }

      return true;
    }

    if (!getAccessToken()) {
      return {
        name: "Login",
        query: {
          redirect: to.fullPath,
        },
      };
    }

    if (!authStore.isInitialized) {
      try {
        const sessionReady = await authStore.initializeSession();
        if (!sessionReady) {
          await authStore.logoutLocal();
          return false;
        }

        permissionStore.mountDynamicRoutes(router, menuStore.dynamicRoutes);

        const rootRedirectTarget = resolveRootRedirectTarget(to.path, menuStore.homeMenuPath);
        if (rootRedirectTarget) {
          return {
            path: rootRedirectTarget,
            replace: true,
          };
        }

        return {
          path: to.fullPath,
          replace: true,
        };
      } catch (_error) {
        await authStore.logoutLocal();
        return false;
      }
    }

    const rootRedirectTarget = resolveRootRedirectTarget(to.path, menuStore.homeMenuPath);
    if (rootRedirectTarget) {
      return {
        path: rootRedirectTarget,
        replace: true,
      };
    }

    return true;
  });

  router.afterEach(() => {
    NProgress.done();
  });

  router.onError(() => {
    NProgress.done();
  });
};
