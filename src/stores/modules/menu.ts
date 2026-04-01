import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { buildRoutesFromMenus } from "@/router/dynamic-routes";
import { rootRouteModules } from "@/router/module-routes";
import type { AppMenu } from "@/types/menu";
import { mergeMenus, toMenuItems, toMenuItemsFromRoutes, toSidebarMenus } from "@/utils/menu";
import type { SidebarMenuItem } from "@/utils/menu";
import type { RouteRecordRaw } from "vue-router";

export const useMenuStore = defineStore("menu", () => {
  // 预留给动态路由链路使用；当前默认不赋值。
  const backendMenus = ref<AppMenu[]>([]);
  // 左侧菜单栏菜单展示。
  const sidebarBackendMenus = ref<AppMenu[]>([]);
  const staticMenus = computed<SidebarMenuItem[]>(() => toMenuItemsFromRoutes(rootRouteModules));
  // 完整菜单树同时兼容静态路由和可选的动态路由，供面包屑、隐藏页等场景复用。
  const allMenus = computed<SidebarMenuItem[]>(() =>
    mergeMenus(toMenuItems(backendMenus.value), staticMenus.value),
  );
  // 左侧菜单只展示后端返回的可见菜单，避免把所有本地路由都暴露出来。
  const sidebarMenus = computed<SidebarMenuItem[]>(() =>
    toSidebarMenus(toMenuItems(sidebarBackendMenus.value)),
  );
  const dynamicRoutes = computed<RouteRecordRaw[]>(() => buildRoutesFromMenus(backendMenus.value));
  const homeMenu = computed<SidebarMenuItem | null>(() => sidebarMenus.value[0] || null);
  const homeMenuPath = computed<string>(() => homeMenu.value?.path || "/");

  const setBackendMenus = (menus: AppMenu[]): void => {
    backendMenus.value = menus;
  };

  const setSidebarBackendMenus = (menus: AppMenu[]): void => {
    sidebarBackendMenus.value = menus;
  };

  const reset = (): void => {
    backendMenus.value = [];
    sidebarBackendMenus.value = [];
  };

  return {
    backendMenus,
    sidebarBackendMenus,
    staticMenus,
    allMenus,
    sidebarMenus,
    homeMenu,
    homeMenuPath,
    dynamicRoutes,
    setBackendMenus,
    setSidebarBackendMenus,
    reset,
  };
});
