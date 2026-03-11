import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";
import { useTabsStore } from "@/stores/modules/tabs";

export const useLogoutAction = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const tabsStore = useTabsStore();

  const logout = async (): Promise<void> => {
    authStore.logoutLocal();
    tabsStore.reset();
    await router.replace("/login");
  };

  return {
    logout,
  };
};
