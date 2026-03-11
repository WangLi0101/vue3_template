import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getProfileApi, loginApi } from "@/api/auth/api";
import type { AuthUser, LoginPayload } from "@/api/auth/types";
import { clearToken, getToken, setToken } from "@/utils/token";
import { useMenuStore } from "./menu";
import { usePermissionStore } from "./permission";

export const useAuthStore = defineStore("auth", () => {
  const menuStore = useMenuStore();
  const permissionStore = usePermissionStore();
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

  const fetchProfile = async (): Promise<boolean> => {
    if (!token.value) {
      throw new Error("缺少登录态");
    }

    const response = await getProfileApi();
    if (!response.data) {
      isInitialized.value = false;
      return false;
    }

    const profile = response.data;
    user.value = profile.user;
    permissionStore.setAccess(profile.roles, profile.permissions);
    menuStore.setMenus(profile.menus);
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
    fetchProfile,
    logoutLocal,
  };
});
