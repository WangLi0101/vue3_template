import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  getCurrentUserApi,
  getMenusApi,
  getPermissionsApi,
  getRolesApi,
  loginApi,
} from "@/api/auth/api";
import type { AuthUser, LoginPayload } from "@/api/auth/types";
import { clearToken, getToken, setToken } from "@/utils/token";
import { useMenuStore } from "./menu";
import { usePermissionStore } from "./permission";
import { useTabsStore } from "./tabs";

export const useAuthStore = defineStore("auth", () => {
  const menuStore = useMenuStore();
  const permissionStore = usePermissionStore();
  const tabsStore = useTabsStore();
  const token = ref<string>(getToken());
  const user = ref<AuthUser | null>(null);
  const isInitialized = ref(false);
  const isLoggedIn = computed(() => Boolean(token.value));

  const login = async (payload: LoginPayload): Promise<boolean> => {
    const response = await loginApi(payload);
    if (response.code !== 0) {
      return false;
    }

    token.value = response.data.accessToken;
    setToken(response.data.accessToken);
    isInitialized.value = false;
    return true;
  };

  const initializeSession = async (): Promise<boolean> => {
    if (!token.value) {
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
    menuStore.setMenus(menusResponse.data.menus);
    tabsStore.syncHomeTag();
    isInitialized.value = true;
    return true;
  };

  const logoutLocal = (): void => {
    token.value = "";
    user.value = null;
    isInitialized.value = false;
    clearToken();
    permissionStore.reset();
    menuStore.reset();
  };

  return {
    token,
    user,
    isInitialized,
    isLoggedIn,
    login,
    initializeSession,
    logoutLocal,
  };
});
