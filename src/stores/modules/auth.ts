import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getCurrentUserApi,
  getMenusApi,
  getPermissionsApi,
  getRolesApi,
  refreshTokenApi,
} from "@/api/auth/api";
import type { AuthUser, TokenPair } from "@/api/auth/types";
import router from "@/router";
import { ApiRequestError } from "@/types/http";
import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from "@/utils/token";
import { useMenuStore } from "./menu";
import { usePermissionStore } from "./permission";
import { useTabsStore } from "./tabs";

export const useAuthStore = defineStore("auth", () => {
  const menuStore = useMenuStore();
  const permissionStore = usePermissionStore();
  const tabsStore = useTabsStore();
  const user = ref<AuthUser | null>(null);
  const isInitialized = ref(false);

  const resetSessionState = (): void => {
    user.value = null;
    isInitialized.value = false;
    tabsStore.reset();
    permissionStore.reset();
    menuStore.reset();
  };

  const establishSession = (tokens: TokenPair): void => {
    resetSessionState();
    setAuthTokens(tokens);
  };

  const refreshToken = async (): Promise<string> => {
    const currentRefreshToken = getRefreshToken();
    if (!currentRefreshToken) {
      throw new ApiRequestError("缺少刷新令牌", 40102);
    }

    const response = await refreshTokenApi({
      refreshToken: currentRefreshToken,
    });

    if (response.code !== 0) {
      throw new ApiRequestError(response.message, response.code);
    }

    setAuthTokens(response.data);
    return response.data.accessToken;
  };

  const initializeSession = async (): Promise<boolean> => {
    if (!getAccessToken()) {
      throw new Error("缺少登录态");
    }

    const responses = await Promise.all([
      getCurrentUserApi(),
      getRolesApi(),
      getPermissionsApi(),
      getMenusApi(),
    ]);

    if (responses.some((response) => response.code !== 0)) {
      isInitialized.value = false;
      return false;
    }

    const [userResponse, rolesResponse, permissionsResponse, menusResponse] = responses;

    user.value = userResponse.data.user;
    permissionStore.setRoles(rolesResponse.data.roles);
    permissionStore.setPermissions(permissionsResponse.data.permissions);
    menuStore.setSidebarBackendMenus(menusResponse.data.menus);
    tabsStore.syncHomeTag();
    isInitialized.value = true;
    return true;
  };

  const logoutLocal = async (): Promise<void> => {
    resetSessionState();
    clearAuthTokens();

    if (router.currentRoute.value.name === "Login") {
      return;
    }

    await router.replace({
      name: "Login",
    });
  };

  return {
    user,
    isInitialized,
    establishSession,
    refreshToken,
    initializeSession,
    logoutLocal,
  };
});
