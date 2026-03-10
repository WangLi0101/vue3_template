import type { AppMenu } from "@/types/menu";
import AppRouterView from "@/components/AppRouterView.vue";
import type { RouteRecordRaw } from "vue-router";

const viewModules = import.meta.glob("../views/**/*.vue");
const DEFAULT_RANK = Number.MAX_SAFE_INTEGER;

const normalizeComponent = (component: string): string =>
  component.replace(/^\/+/, "").replace(/\/+$/, "");
const joinPath = (parentPath: string, currentPath: string): string => {
  if (currentPath.startsWith("/")) return currentPath;

  const normalizedParent = parentPath === "/" ? "" : parentPath;
  const merged = `${normalizedParent}/${currentPath}`;
  return merged.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
};
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

const normalizeMenuComponent = (component?: string): string => (component || "").trim();

const resolveLeafComponent = (component: string): RouteRecordRaw["component"] => {
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

const resolveComponent = (menu: AppMenu): RouteRecordRaw["component"] => {
  const component = normalizeMenuComponent(menu.component);
  const hasChildren = Boolean(menu.children?.length);

  if (component === "router-view") {
    return AppRouterView;
  }

  // Nested menu nodes can omit component; fallback to a generic RouterView container.
  if (hasChildren && !component) {
    return AppRouterView;
  }

  if (!component) {
    console.warn(`[RBAC] 菜单缺少组件配置: ${menu.name}`);
    return () => import("@/views/error/NotFoundPage.vue");
  }

  return resolveLeafComponent(component);
};

const resolveAutoRedirect = (
  children: AppMenu[],
  parentPath: string,
): RouteRecordRaw["redirect"] => {
  const firstVisibleChild = children.find((child) => !child.meta.hidden) || children[0];
  return joinPath(parentPath, firstVisibleChild.path);
};

const menuToRoute = (menu: AppMenu, parentPath = ""): RouteRecordRaw => {
  const currentPath = joinPath(parentPath, menu.path);
  const sortedChildren = menu.children?.length ? sortMenusByRank(menu.children) : [];
  const route = {
    path: menu.path,
    name: menu.name,
    component: resolveComponent(menu),
    meta: {
      ...menu.meta,
      requiresAuth: true,
    },
  } as RouteRecordRaw;

  if (menu.redirect) {
    route.redirect = menu.redirect;
  } else if (sortedChildren.length) {
    route.redirect = resolveAutoRedirect(sortedChildren, currentPath);
  }

  if (sortedChildren.length) {
    route.children = sortedChildren.map((child) => menuToRoute(child, currentPath));
  }

  return route;
};

export const buildRoutesFromMenus = (menus: AppMenu[]): RouteRecordRaw[] =>
  sortMenusByRank(menus).map((menu) => menuToRoute(menu));
