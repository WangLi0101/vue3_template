import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getProfileApi, loginApi } from "@/api/auth/api";
import type { AuthUser, LoginPayload, ProfileResponse } from "@/api/auth/types";
import { clearToken, getToken, setToken } from "@/utils/token";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string>(getToken());
  const user = ref<AuthUser | null>(null);
  const isInitialized = ref(false);
  const isLoggedIn = computed(() => Boolean(token.value));

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

  const fetchProfile = async (): Promise<ProfileResponse | null> => {
    if (!token.value) {
      throw new Error("缺少登录态");
    }

    const response = await getProfileApi();
    if (response.code !== 0 || !response.data) {
      isInitialized.value = false;
      return null;
    }

    user.value = response.data.user;
    isInitialized.value = true;
    return response.data;
  };

  const logoutLocal = (): void => {
    token.value = "";
    user.value = null;
    isInitialized.value = false;
    clearToken();
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
