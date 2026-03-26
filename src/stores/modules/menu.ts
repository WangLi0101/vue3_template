import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { buildRoutesFromMenus } from "@/router/dynamic-routes";
import { rootRouteModules } from "@/router/module-routes";
import type { AppMenu } from "@/types/menu";
import { mergeMenus, toMenuItems, toMenuItemsFromRoutes, toSidebarMenus } from "@/utils/menu";
import type { SidebarMenuItem } from "@/utils/menu";
import type { RouteRecordRaw } from "vue-router";

export const useMenuStore = defineStore("menu", () => {
  const backendMenus = ref<AppMenu[]>([]);
  const staticMenus = computed<SidebarMenuItem[]>(() => toMenuItemsFromRoutes(rootRouteModules));
  const allMenus = computed<SidebarMenuItem[]>(() =>
    mergeMenus(toMenuItems(backendMenus.value), staticMenus.value),
  );
  const sidebarMenus = computed<SidebarMenuItem[]>(() => toSidebarMenus(allMenus.value));
  const dynamicRoutes = computed<RouteRecordRaw[]>(() => buildRoutesFromMenus(backendMenus.value));
  const homeMenu = computed<SidebarMenuItem | null>(() => sidebarMenus.value[0] || null);
  const homeMenuPath = computed<string>(() => homeMenu.value?.path || "/");

  const setBackendMenus = (menus: AppMenu[]): void => {
    backendMenus.value = menus;
  };

  const reset = (): void => {
    backendMenus.value = [];
  };

  return {
    backendMenus,
    staticMenus,
    allMenus,
    sidebarMenus,
    homeMenu,
    homeMenuPath,
    dynamicRoutes,
    setBackendMenus,
    reset,
  };
});
