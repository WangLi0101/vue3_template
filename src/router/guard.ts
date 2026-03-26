import { useAuthStore } from "@/stores/modules/auth";
import { useMenuStore } from "@/stores/modules/menu";
import { usePermissionStore } from "@/stores/modules/permission";
import type { Router } from "vue-router";
import NProgress from "@/utils/progress";

export const setupRouterGuards = (router: Router): void => {
  router.beforeEach(async (to, from) => {
    if (to.fullPath !== from.fullPath) {
      NProgress.start();
    }
    const authStore = useAuthStore();
    const menuStore = useMenuStore();
    const permissionStore = usePermissionStore();

    if (to.meta.public) {
      if (to.name === "Login" && authStore.isLoggedIn) {
        return "/";
      }

      return true;
    }

    if (!authStore.token) {
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
          authStore.logoutLocal();
          return {
            name: "Login",
            query: {
              redirect: to.fullPath,
            },
          };
        }

        permissionStore.mountDynamicRoutes(router, menuStore.dynamicRoutes);

        const rootRedirectTarget = menuStore.resolveRootRedirectTarget(to.path);
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
        authStore.logoutLocal();
        return {
          name: "Login",
          query: {
            redirect: to.fullPath,
          },
        };
      }
    }

    const rootRedirectTarget = menuStore.resolveRootRedirectTarget(to.path);
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
