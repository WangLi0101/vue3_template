import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getProfileApi, loginApi } from "@/api/auth/api";
import type { AppMenu, AuthUser, LoginPayload } from "@/api/auth/types";
import { clearToken, getToken, setToken } from "@/utils/token";
import { usePermissionStore } from "./permission";

export const useAuthStore = defineStore("auth", () => {
  const permissionStore = usePermissionStore();
  const token = ref<string>(getToken());
  const user = ref<AuthUser | null>(null);
  const roles = ref<string[]>([]);
  const permissions = ref<Set<string>>(new Set());
  const menus = ref<AppMenu[]>([]);
  const isInitialized = ref(false);
  const isLoggedIn = computed(() => Boolean(token.value));

  const hasPermission = (required: string | string[]): boolean => {
    const target = Array.isArray(required) ? required : [required];
    return target.every((permission) => permissions.value.has(permission));
  };

  const login = async (payload: LoginPayload): Promise<boolean> => {
    const response = await loginApi(payload);
    if (response.code !== 0 || !response.data?.accessToken) {
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
    if (response.code !== 0 || !response.data) {
      isInitialized.value = false;
      return false;
    }

    const profile = response.data;

    user.value = profile.user;
    roles.value = profile.roles;
    permissions.value = new Set(profile.permissions);
    menus.value = profile.menus;
    isInitialized.value = true;
    return true;
  };

  const resetAuth = (): void => {
    token.value = "";
    user.value = null;
    roles.value = [];
    permissions.value = new Set();
    menus.value = [];
    isInitialized.value = false;
    clearToken();
  };

  const logout = async (): Promise<void> => {
    // 清除动态路由
    permissionStore.reset();
    resetAuth();
  };

  return {
    token,
    user,
    roles,
    permissions,
    menus,
    isInitialized,
    isLoggedIn,
    hasPermission,
    login,
    fetchProfile,
    resetAuth,
    logout,
  };
});
