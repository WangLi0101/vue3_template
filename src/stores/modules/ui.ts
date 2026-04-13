import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore(
  "ui",
  () => {
    const isSidebarCollapsed = ref(false);

    const toggleSidebar = (): void => {
      isSidebarCollapsed.value = !isSidebarCollapsed.value;
    };

    return {
      isSidebarCollapsed,
      toggleSidebar,
    };
  },
  {
    persist: {
      key: "rbac-admin-ui",
      pick: ["isSidebarCollapsed"],
    },
  },
);
