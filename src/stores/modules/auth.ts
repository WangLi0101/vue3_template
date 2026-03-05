import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getProfileApi, loginApi } from "@/api/auth";
import type { AppMenu, AuthUser, LoginPayload } from "@/types/auth";
import { clearToken, getToken, setToken } from "@/utils/token";

export const useAuthStore = defineStore("auth", () => {
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

  const login = async (payload: LoginPayload): Promise<void> => {
    const response = await loginApi(payload);
    token.value = response.accessToken;
    setToken(response.accessToken);
    isInitialized.value = false;
  };

  const fetchProfile = async (): Promise<void> => {
    if (!token.value) {
      throw new Error("缺少登录态");
    }

    const profile = await getProfileApi();

    user.value = profile.user;
    roles.value = profile.roles;
    permissions.value = new Set(profile.permissions);
    menus.value = profile.menus;
    isInitialized.value = true;
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
