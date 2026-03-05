import type { Pinia } from "pinia";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/modules/auth";
import { useMenuStore } from "@/stores/modules/menu";
import { usePermissionStore } from "@/stores/modules/permission";
import { ApiRequestError } from "@/types/http";
import type { Router } from "vue-router";

export const setupRouterGuards = (router: Router): void => {
  router.beforeEach(async (to) => {
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
        await authStore.fetchProfile();
        menuStore.setMenus(authStore.menus);
        permissionStore.mountDynamicRoutes(router, menuStore.dynamicRoutes);

        return {
          path: to.fullPath,
          replace: true,
        };
      } catch (error) {
        authStore.resetAuth();
        menuStore.reset();
        permissionStore.reset();

        if (error instanceof ApiRequestError) {
          ElMessage.error(
            `${error.message} (HTTP ${error.httpStatus} / CODE ${error.businessCode})`,
          );
        } else {
          ElMessage.error(
            error instanceof Error ? error.message : "初始化权限失败",
          );
        }

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
    if (requiredPermission && !authStore.hasPermission(requiredPermission)) {
      return {
        name: "Forbidden",
        replace: true,
      };
    }

    return true;
  });
};
