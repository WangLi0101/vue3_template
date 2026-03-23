import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { buildRoutesFromMenus } from "@/router/dynamic-routes";
import { rootRouteModules } from "@/router/module-routes";
import type { AppMenu } from "@/types/menu";
import {
  buildBreadcrumbChainMap,
  mergeSidebarMenus,
  toSidebarMenus,
  toSidebarMenusFromRoutes,
} from "@/utils/menu";
import type { BreadcrumbItem, SidebarMenuItem } from "@/utils/menu";
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from "vue-router";

export type { BreadcrumbItem, SidebarMenuItem } from "@/utils/menu";

type BreadcrumbRouteLike = Pick<RouteLocationNormalizedLoaded, "path" | "matched">;

export const useMenuStore = defineStore("menu", () => {
  // 原始后端菜单，作为动态路由和侧边栏的唯一源数据。
  const rawMenus = ref<AppMenu[]>([]);

  // 后端菜单转换后的侧边栏树。
  const backendSidebarMenus = computed<SidebarMenuItem[]>(() => toSidebarMenus(rawMenus.value));
  // 本地静态模块路由转换后的侧边栏树。
  const moduleSidebarMenus = computed<SidebarMenuItem[]>(() =>
    toSidebarMenusFromRoutes(rootRouteModules),
  );
  // 合并后端菜单和本地模块路由，得到最终展示的侧边栏。
  const sidebarMenus = computed<SidebarMenuItem[]>(() =>
    mergeSidebarMenus(backendSidebarMenus.value, moduleSidebarMenus.value),
  );
  // 菜单变化时预计算面包屑索引，查询阶段直接按 path 命中。
  const breadcrumbChainMap = computed<Map<string, SidebarMenuItem[]>>(() =>
    buildBreadcrumbChainMap(sidebarMenus.value),
  );
  // 根据后端菜单生成需要动态挂载的路由记录。
  const dynamicRoutes = computed<RouteRecordRaw[]>(() => buildRoutesFromMenus(rawMenus.value));

  // 当前菜单体系下“首页”的规范 path。
  const resolveHomeMenuPath = (): string => sidebarMenus.value[0]?.path || "/";
  // 统一生成首页面包屑节点，避免首页定义分散在多个方法里。
  const createHomeBreadcrumb = (): BreadcrumbItem => ({
    title: "首页",
    path: resolveHomeMenuPath(),
  });
  // 将路由 matched 链路转换成面包屑链路，兼容隐藏页和详情页。
  const buildBreadcrumbsFromRoute = (route: BreadcrumbRouteLike): BreadcrumbItem[] =>
    route.matched.reduce<BreadcrumbItem[]>((chain, record) => {
      const title = typeof record.meta.title === "string" ? record.meta.title : "";
      if (!title || record.path === "/") {
        return chain;
      }

      chain.push({
        title,
        path: record.path,
      });
      return chain;
    }, []);

  // 登录后写入当前用户可访问的后端菜单。
  const setMenus = (menus: AppMenu[]): void => {
    rawMenus.value = menus;
  };

  // 仅在访问根路径时，根据当前可见菜单决定首页重定向目标。
  const resolveRootRedirectTarget = (path: string): string | null => {
    // 只处理访问根路径的场景，避免干扰其他页面导航。
    if (path !== "/") return null;

    const homeMenuPath = resolveHomeMenuPath();
    // 没有候选首页或候选首页仍是根路径时都不重定向。
    if (!homeMenuPath || homeMenuPath === "/") {
      return null;
    }

    return homeMenuPath;
  };

  // 面包屑始终补齐“首页”，并统一返回规范路径。
  const getBreadcrumbs = (route: BreadcrumbRouteLike): BreadcrumbItem[] => {
    const home = createHomeBreadcrumb();
    const homeMenuPath = resolveHomeMenuPath();

    // 当前就在首页时直接返回单节点面包屑。
    if (route.path === homeMenuPath) {
      return [home];
    }

    // 优先使用当前路由的 matched 链路，兼容隐藏页和不在侧边栏中的详情页。
    const routeChain = buildBreadcrumbsFromRoute(route);
    if (routeChain.length) {
      if (routeChain[0].path !== homeMenuPath) {
        return [home, ...routeChain];
      }

      routeChain[0] = {
        ...home,
        path: homeMenuPath,
      };
      return routeChain;
    }

    // 再退回到菜单索引，兼容普通菜单页的快速查找。
    const chain = (breadcrumbChainMap.value.get(route.path) || []).map((menu) => ({
      title: menu.title,
      path: menu.path,
    }));

    // 菜单树里找不到当前路径时，至少保证还能展示首页。
    if (!chain.length) {
      return [home];
    }

    // 如果链路不是从首页开始，就在前面手动补一个首页节点。
    if (chain[0].path !== homeMenuPath) {
      return [home, ...chain];
    }

    // 如果第一项本身就是首页，则统一替换成标准首页对象。
    chain[0] = {
      ...home,
      path: homeMenuPath,
    };
    return chain;
  };

  // 登出或切换账号时清空菜单数据。
  const reset = (): void => {
    rawMenus.value = [];
  };

  return {
    rawMenus,
    sidebarMenus,
    dynamicRoutes,
    setMenus,
    resolveRootRedirectTarget,
    getBreadcrumbs,
    reset,
  };
});
