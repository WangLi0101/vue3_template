import { useAuthStore } from "@/stores/modules/auth";

export const useLogoutAction = () => {
  const authStore = useAuthStore();

  const logout = async (): Promise<void> => {
    await authStore.logoutLocal();
  };

  return {
    logout,
  };
};
