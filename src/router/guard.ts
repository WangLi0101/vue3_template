import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useAuthStore } from "@/stores/modules/auth";
import { useMenuStore } from "@/stores/modules/menu";
import { usePermissionStore } from "@/stores/modules/permission";
import type { Router } from "vue-router";

export const setupRouterGuards = (router: Router): void => {
  NProgress.configure({ showSpinner: false });

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
        const profileReady = await authStore.fetchProfile();
        if (!profileReady) {
          authStore.logoutLocal();
          return {
            name: "Login",
            query: {
              redirect: to.fullPath,
            },
          };
        }

        permissionStore.mountDynamicRoutes(router, menuStore.dynamicRoutes);

        return {
          path: to.fullPath,
          replace: true,
        };
      } catch (error) {
        authStore.logoutLocal();
        return {
          name: "Login",
          query: {
            redirect: to.fullPath,
          },
        };
      }
    }

    const requiredPermission = to.meta.permission as
      | string
      | string[]
      | undefined;
    if (requiredPermission && !permissionStore.hasAll(requiredPermission)) {
      return {
        name: "Forbidden",
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
