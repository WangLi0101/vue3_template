import { defineStore } from "pinia";
import { ref, watch } from "vue";

interface PersistedUiState {
  isSidebarCollapsed: boolean;
}

const UI_STORAGE_KEY = "rbac-admin-ui";

const defaultState: PersistedUiState = {
  isSidebarCollapsed: false,
};

const readUiState = (): PersistedUiState => {
  if (typeof window === "undefined") return defaultState;

  const raw = window.localStorage.getItem(UI_STORAGE_KEY);
  if (!raw) return defaultState;

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedUiState>;

    return {
      isSidebarCollapsed:
        typeof parsed.isSidebarCollapsed === "boolean"
          ? parsed.isSidebarCollapsed
          : defaultState.isSidebarCollapsed,
    };
  } catch {
    return defaultState;
  }
};

const persistUiState = (state: PersistedUiState): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(state));
};

export const useUiStore = defineStore("ui", () => {
  const initialState = readUiState();
  const isSidebarCollapsed = ref(initialState.isSidebarCollapsed);

  watch(isSidebarCollapsed, (collapsed) => {
    persistUiState({
      isSidebarCollapsed: collapsed,
    });
  });

  const toggleSidebar = (): void => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  };

  return {
    isSidebarCollapsed,
    toggleSidebar,
  };
});
