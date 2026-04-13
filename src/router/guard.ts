import { useAuthStore } from "@/stores/modules/auth";
import { useMenuStore } from "@/stores/modules/menu";
import { getAccessToken, setAuthTokens } from "@/utils/token";
import type { Router } from "vue-router";
import NProgress from "@/utils/progress";

const APP_TITLE = "Vue3 RBAC 管理后台";

const resolveRootRedirectTarget = (path: string, homeMenuPath: string): string | null => {
  if (path !== "/") return null;
  if (!homeMenuPath || homeMenuPath === "/") {
    return null;
  }

  return homeMenuPath;
};

const resolveDocumentTitle = (title: unknown): string => {
  if (typeof title !== "string" || !title.trim()) {
    return APP_TITLE;
  }

  return title === APP_TITLE ? title : `${title} - ${APP_TITLE}`;
};

export const setupRouterGuards = (router: Router): void => {
  router.beforeEach(async (to, from) => {
    if (to.fullPath !== from.fullPath) {
      NProgress.start();
    }
    const authStore = useAuthStore();
    const menuStore = useMenuStore();

    if (to.meta.skipAuth) {
      return true;
    }
    // 如果有token，需要设置token
    const { accessToken, refreshToken } = to.query;
    if (accessToken && refreshToken) {
      setAuthTokens({ accessToken: accessToken as string, refreshToken: refreshToken as string });
      return {
        path: to.path,
        replace: true,
      };
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

    // 如果是/，重定向到首页
    const rootRedirectTarget = resolveRootRedirectTarget(to.path, menuStore.homeMenuPath);
    if (rootRedirectTarget) {
      return {
        path: rootRedirectTarget,
        replace: true,
      };
    }

    return true;
  });

  router.afterEach((to) => {
    document.title = resolveDocumentTitle(to.meta.title);
    NProgress.done();
  });

  router.onError(() => {
    NProgress.done();
  });
};
