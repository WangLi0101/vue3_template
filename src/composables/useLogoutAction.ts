import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";

export const useLogoutAction = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const logout = async (): Promise<void> => {
    authStore.logoutLocal();
    await router.replace("/login");
  };

  return {
    logout,
  };
};
