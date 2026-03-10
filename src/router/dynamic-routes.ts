import type { AppMenu } from "@/api/auth/types";
import AppRouterView from "@/components/AppRouterView.vue";
import type { RouteRecordRaw } from "vue-router";

const viewModules = import.meta.glob("../views/**/*.vue");
const DEFAULT_RANK = Number.MAX_SAFE_INTEGER;

const normalizeComponent = (component: string): string =>
  component.replace(/^\/+/, "").replace(/\/+$/, "");
const getMenuRank = (menu: AppMenu): number =>
  typeof menu.meta.rank === "number" && Number.isFinite(menu.meta.rank)
    ? menu.meta.rank
    : DEFAULT_RANK;
const sortMenusByRank = (menus: AppMenu[]): AppMenu[] =>
  menus
    .map((menu, index) => ({ menu, index }))
    .sort((left, right) => {
      const rankDelta = getMenuRank(left.menu) - getMenuRank(right.menu);
      return rankDelta === 0 ? left.index - right.index : rankDelta;
    })
    .map((item) => item.menu);

const resolveComponent = (component: string): RouteRecordRaw["component"] => {
  if (component === "router-view") {
    return AppRouterView;
  }

  const key = `../views/${normalizeComponent(component)}.vue`;
  const loader = viewModules[key];

  if (!loader) {
    console.warn(`[RBAC] 未找到组件: ${component}`);
    return () => import("@/views/error/NotFoundPage.vue");
  }

  return loader;
};

const menuToRoute = (menu: AppMenu): RouteRecordRaw => {
  const route = {
    path: menu.path,
    name: menu.name,
    component: resolveComponent(menu.component),
    meta: {
      ...menu.meta,
      requiresAuth: true,
    },
  } as RouteRecordRaw;

  if (menu.redirect) {
    route.redirect = menu.redirect;
  }

  if (menu.children?.length) {
    route.children = sortMenusByRank(menu.children).map(menuToRoute);
  }

  return route;
};

export const buildRoutesFromMenus = (menus: AppMenu[]): RouteRecordRaw[] =>
  sortMenusByRank(menus).map(menuToRoute);
