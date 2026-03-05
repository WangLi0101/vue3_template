import { defineStore } from "pinia";
import { ref, watch } from "vue";

export type NavigationMode = "side" | "top" | "mix";
export type PageWidth = "fixed" | "fluid";
export type TabStyle = "smart" | "card" | "google";

export interface PersistedUiState {
  isSidebarCollapsed: boolean;
  navigationMode: NavigationMode;
  pageWidth: PageWidth;
  tabStyle: TabStyle;
  grayMode: boolean;
  colorWeaknessMode: boolean;
  hideTabs: boolean;
  hideFooter: boolean;
  showLogo: boolean;
  persistTabs: boolean;
}

const UI_STORAGE_KEY = "rbac-admin-ui";

const defaultState: PersistedUiState = {
  isSidebarCollapsed: false,
  navigationMode: "side",
  pageWidth: "fluid",
  tabStyle: "smart",
  grayMode: false,
  colorWeaknessMode: false,
  hideTabs: false,
  hideFooter: false,
  showLogo: true,
  persistTabs: false,
};

const readUiState = (): PersistedUiState => {
  if (typeof window === "undefined") return defaultState;
  const raw = window.localStorage.getItem(UI_STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
};

const persistUiState = (state: PersistedUiState): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(state));
};

const applyFiltersToDom = (grayMode: boolean, colorWeaknessMode: boolean) => {
  if (typeof document === "undefined") return;
  const rootStyle = document.documentElement.style;
  const filters: string[] = [];
  if (grayMode) filters.push("grayscale(1)");
  if (colorWeaknessMode) filters.push("invert(0.8)");

  if (filters.length > 0) {
    rootStyle.filter = filters.join(" ");
  } else {
    rootStyle.filter = "";
  }
};

export const useUiStore = defineStore("ui", () => {
  const initialState = readUiState();

  const isSidebarCollapsed = ref(initialState.isSidebarCollapsed);
  const navigationMode = ref<NavigationMode>(initialState.navigationMode);
  const pageWidth = ref<PageWidth>(initialState.pageWidth);
  const tabStyle = ref<TabStyle>(initialState.tabStyle);

  const grayMode = ref(initialState.grayMode);
  const colorWeaknessMode = ref(initialState.colorWeaknessMode);

  const hideTabs = ref(initialState.hideTabs);
  const hideFooter = ref(initialState.hideFooter);
  const showLogo = ref(initialState.showLogo);
  const persistTabs = ref(initialState.persistTabs);

  const saveState = () => {
    persistUiState({
      isSidebarCollapsed: isSidebarCollapsed.value,
      navigationMode: navigationMode.value,
      pageWidth: pageWidth.value,
      tabStyle: tabStyle.value,
      grayMode: grayMode.value,
      colorWeaknessMode: colorWeaknessMode.value,
      hideTabs: hideTabs.value,
      hideFooter: hideFooter.value,
      showLogo: showLogo.value,
      persistTabs: persistTabs.value,
    });
  };

  // Watchers for settings that affect DOM directly
  watch(
    [grayMode, colorWeaknessMode],
    ([gray, weak]) => {
      applyFiltersToDom(gray, weak);
    },
    { immediate: true },
  );

  // General watcher to persist state on any change
  watch(
    [
      isSidebarCollapsed,
      navigationMode,
      pageWidth,
      tabStyle,
      grayMode,
      colorWeaknessMode,
      hideTabs,
      hideFooter,
      showLogo,
      persistTabs,
    ],
    () => saveState(),
    { deep: true },
  );

  const toggleSidebar = (): void => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  };

  const setSidebarCollapsed = (collapsed: boolean): void => {
    isSidebarCollapsed.value = collapsed;
  };

  const clearCache = () => {
    window.localStorage.removeItem(UI_STORAGE_KEY);
    window.location.reload();
  };

  return {
    isSidebarCollapsed,
    navigationMode,
    pageWidth,
    tabStyle,
    grayMode,
    colorWeaknessMode,
    hideTabs,
    hideFooter,
    showLogo,
    persistTabs,

    toggleSidebar,
    setSidebarCollapsed,
    clearCache,
  };
});
