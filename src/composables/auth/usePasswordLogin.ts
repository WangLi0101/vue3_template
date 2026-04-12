import { ref } from "vue";
import { loginApi } from "@/api/auth/api";
import type { LoginPayload } from "@/api/auth/types";
import { useAuthStore } from "@/stores/modules/auth";

export const usePasswordLogin = () => {
  const authStore = useAuthStore();
  const isLoginLoading = ref(false);

  const loginByPassword = async (payload: LoginPayload): Promise<boolean> => {
    if (isLoginLoading.value) {
      return false;
    }

    isLoginLoading.value = true;

    try {
      const response = await loginApi(payload);
      if (response.code !== 0) {
        return false;
      }
      authStore.establishSession(response.data);
      return true;
    } finally {
      isLoginLoading.value = false;
    }
  };

  return {
    isLoginLoading,
    loginByPassword,
  };
};
