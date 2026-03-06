import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { buildRoutesFromMenus } from "@/router/dynamic-routes";
import { rootRouteModules } from "@/router/module-routes";
import type { AppMenu } from "@/api/auth/types";
import type { RouteRecordRaw } from "vue-router";

export interface SidebarMenuItem {
  id: string;
  name: string;
  path: string;
  title: string;
  icon?: string;
  rank?: number;
  children?: SidebarMenuItem[];
}

export interface BreadcrumbItem {
  title: string;
  to: string;
}

const joinPath = (parentPath: string, currentPath: string): string => {
  if (currentPath.startsWith("/")) return currentPath;

  const normalizedParent = parentPath === "/" ? "" : parentPath;
  const merged = `${normalizedParent}/${currentPath}`;
  return merged.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
};
const DEFAULT_RANK = Number.MAX_SAFE_INTEGER;
const resolveRank = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : DEFAULT_RANK;
const sortWithRank = <T>(
  list: T[],
  getRank: (item: T) => number,
): T[] => {
  return list
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const rankDelta = getRank(left.item) - getRank(right.item);
      return rankDelta === 0 ? left.index - right.index : rankDelta;
    })
    .map((record) => record.item);
};

const toSidebarMenus = (
  menus: AppMenu[],
  parentPath = "",
): SidebarMenuItem[] => {
  return sortWithRank(
    menus,
    (menu) => resolveRank(menu.meta.rank),
  )
    .filter((menu) => !menu.meta.hidden)
    .map((menu) => {
      const currentPath = joinPath(parentPath, menu.path);
      const children = menu.children?.length
        ? toSidebarMenus(menu.children, currentPath)
        : undefined;

      return {
        id: menu.id,
        name: menu.name,
        path: currentPath,
        title: menu.meta.title,
        icon: menu.meta.icon,
        rank: resolveRank(menu.meta.rank),
        children,
      };
    });
};

const toSidebarMenusFromRoutes = (
  routes: RouteRecordRaw[],
  parentPath = "",
): SidebarMenuItem[] => {
  return sortWithRank(
    routes,
    (route) => resolveRank((route.meta as Record<string, unknown> | undefined)?.rank),
  ).flatMap((route, index) => {
    const routeMeta = (route.meta || {}) as Record<string, unknown>;
    if (routeMeta.hidden) return [];

    const currentPath = joinPath(parentPath, route.path);
    const routeChildren = (route.children || []) as RouteRecordRaw[];
    const children = toSidebarMenusFromRoutes(routeChildren, currentPath);
    const title = typeof routeMeta.title === "string" ? routeMeta.title : "";
    const icon = typeof routeMeta.icon === "string" ? routeMeta.icon : undefined;

    if (!title) {
      return children;
    }

    return [
      {
        id: String(route.name || `${currentPath}-${index}`),
        name: String(route.name || currentPath),
        path: currentPath,
        title,
        icon,
        rank: resolveRank(routeMeta.rank),
        children: children.length ? children : undefined,
      },
    ];
  });
};

const mergeSidebarMenus = (
  backendMenus: SidebarMenuItem[],
  moduleMenus: SidebarMenuItem[],
): SidebarMenuItem[] => {
  const seenPath = new Set<string>();
  const merged: SidebarMenuItem[] = [];

  [...backendMenus, ...moduleMenus].forEach((menu) => {
    if (seenPath.has(menu.path)) return;
    seenPath.add(menu.path);
    merged.push(menu);
  });

  return sortWithRank(merged, (menu) => resolveRank(menu.rank));
};

const findBreadcrumbChain = (
  menus: SidebarMenuItem[],
  targetPath: string,
  parentChain: SidebarMenuItem[] = [],
): SidebarMenuItem[] => {
  for (const menu of menus) {
    const chain = [...parentChain, menu];
    if (menu.path === targetPath) {
      return chain;
    }

    if (!menu.children?.length) continue;
    const childChain = findBreadcrumbChain(menu.children, targetPath, chain);
    if (childChain.length) {
      return childChain;
    }
  }

  return [];
};

export const useMenuStore = defineStore("menu", () => {
  const rawMenus = ref<AppMenu[]>([]);
  const pathFullPathMap = ref<Record<string, string>>({});

  const backendSidebarMenus = computed<SidebarMenuItem[]>(() =>
    toSidebarMenus(rawMenus.value),
  );
  const moduleSidebarMenus = computed<SidebarMenuItem[]>(() =>
    toSidebarMenusFromRoutes(rootRouteModules),
  );
  const sidebarMenus = computed<SidebarMenuItem[]>(() =>
    mergeSidebarMenus(backendSidebarMenus.value, moduleSidebarMenus.value),
  );
  const dynamicRoutes = computed<RouteRecordRaw[]>(() =>
    buildRoutesFromMenus(rawMenus.value),
  );

  const setMenus = (menus: AppMenu[]): void => {
    rawMenus.value = menus;
  };

  const rememberRoute = (path: string, fullPath: string): void => {
    if (!path || !fullPath) return;
    pathFullPathMap.value[path] = fullPath;
  };

  const getBreadcrumbs = (path: string): BreadcrumbItem[] => {
    const home: BreadcrumbItem = {
      title: "首页",
      to: pathFullPathMap.value["/dashboard"] || "/dashboard",
    };

    if (path === "/dashboard") {
      return [home];
    }

    const chain = findBreadcrumbChain(sidebarMenus.value, path).map((menu) => ({
      title: menu.title,
      to: pathFullPathMap.value[menu.path] || menu.path,
    }));

    if (!chain.length) {
      return [home];
    }

    if (
      chain[0].to !== "/dashboard" &&
      !chain[0].to.startsWith("/dashboard?")
    ) {
      return [home, ...chain];
    }

    chain[0] = home;
    return chain;
  };

  const reset = (): void => {
    rawMenus.value = [];
    pathFullPathMap.value = {};
  };

  return {
    rawMenus,
    sidebarMenus,
    dynamicRoutes,
    setMenus,
    rememberRoute,
    getBreadcrumbs,
    reset,
  };
});
