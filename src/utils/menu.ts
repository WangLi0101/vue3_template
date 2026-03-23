import type { AppMenu } from "@/types/menu";
import type { RouteRecordRaw } from "vue-router";

export interface SidebarMenuItem {
  // 菜单唯一标识，优先复用后端或路由自身提供的 id/name。
  id: string;
  // 路由名称，给菜单组件或其他业务逻辑做区分使用。
  name: string;
  // 供侧边栏和面包屑直接消费的完整路径。
  path: string;
  // 侧边栏、面包屑展示文案。
  title: string;
  // 菜单图标标识，可选。
  icon?: string;
  // 排序权重，值越小越靠前。
  rank?: number;
  // 子菜单节点，叶子节点时为空。
  children?: SidebarMenuItem[];
}

export interface BreadcrumbItem {
  // 面包屑文案。
  title: string;
  // 对应的规范路由路径，用于标识当前面包屑节点。
  path: string;
}

// 统一拼接父子路径，避免出现重复斜杠，并兼容绝对路径子节点。
const joinPath = (parentPath: string, currentPath: string): string => {
  // 子节点如果已经是绝对路径，直接返回，避免重复拼接父路径。
  if (currentPath.startsWith("/")) return currentPath;

  // 父路径为根时不额外保留 "/"，避免出现 "//child"。
  const normalizedParent = parentPath === "/" ? "" : parentPath;
  const merged = `${normalizedParent}/${currentPath}`;
  // 清理重复斜杠，并把非根路径的尾部 "/" 去掉。
  return merged.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
};

// 没有配置 rank 时统一放到最后。
const DEFAULT_RANK = Number.MAX_SAFE_INTEGER;

// 只接受有限数字，其他情况全部回退到默认排序值。
const resolveRank = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : DEFAULT_RANK;

// 所有菜单和路由列表统一按 rank 排序；rank 相同时保持原始声明顺序。
const sortWithRank = <T>(list: T[], getRank: (item: T) => number): T[] => {
  return (
    list
      // 先记录原始索引，用于 rank 相同时稳定排序。
      .map((item, index) => ({ item, index }))
      .sort((left, right) => {
        const rankDelta = getRank(left.item) - getRank(right.item);
        return rankDelta === 0 ? left.index - right.index : rankDelta;
      })
      // 排序后再还原成原始数据结构。
      .map((record) => record.item)
  );
};

// 后端菜单树转换为侧边栏结构，隐藏菜单在这里直接剔除。
export const toSidebarMenus = (menus: AppMenu[], parentPath = ""): SidebarMenuItem[] => {
  return (
    sortWithRank(menus, (menu) => resolveRank(menu.meta.rank))
      // hidden 菜单不进入侧边栏树。
      .filter((menu) => !menu.meta.hidden)
      .map((menu) => {
        // 对后端返回的相对路径补齐父级路径，产出完整菜单路径。
        const currentPath = joinPath(parentPath, menu.path);
        // 递归转换子节点，保持侧边栏结构与菜单树一致。
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
      })
  );
};

// 模块路由也可参与侧边栏渲染；没有 title 的容器节点会被其子节点“抬平”。
export const toSidebarMenusFromRoutes = (
  routes: RouteRecordRaw[],
  parentPath = "",
): SidebarMenuItem[] => {
  return sortWithRank(routes, (route) =>
    resolveRank((route.meta as Record<string, unknown> | undefined)?.rank),
  ).flatMap((route, index) => {
    // RouteRecordRaw.meta 默认是宽泛类型，这里收敛成可安全读取的对象。
    const routeMeta = (route.meta || {}) as Record<string, unknown>;
    // 隐藏路由不参与侧边栏。
    if (routeMeta.hidden) return [];

    // 当前路由完整路径，用于后续侧边栏点击和面包屑展示。
    const currentPath = joinPath(parentPath, route.path);
    const routeChildren = (route.children || []) as RouteRecordRaw[];
    // 递归处理路由子节点。
    const children = toSidebarMenusFromRoutes(routeChildren, currentPath);
    const title = typeof routeMeta.title === "string" ? routeMeta.title : "";
    const icon = typeof routeMeta.icon === "string" ? routeMeta.icon : undefined;

    if (!title) {
      // 容器节点自身不展示时，直接提升其子节点。
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

// 侧边栏同时支持后端菜单和本地模块路由，按 path 去重后再统一排序。
export const mergeSidebarMenus = (
  backendMenus: SidebarMenuItem[],
  moduleMenus: SidebarMenuItem[],
): SidebarMenuItem[] => {
  const seenPath = new Set<string>();
  const merged: SidebarMenuItem[] = [];

  [...backendMenus, ...moduleMenus].forEach((menu) => {
    // 同一路径优先保留先出现的节点，避免侧边栏出现重复入口。
    if (seenPath.has(menu.path)) return;
    seenPath.add(menu.path);
    merged.push(menu);
  });

  // 合并完成后再统一按 rank 排序，保证最终展示顺序稳定。
  return sortWithRank(merged, (menu) => resolveRank(menu.rank));
};

// 菜单结构变化时一次性构建 path -> 面包屑链路索引，避免每次查询都 DFS 整棵树。
export const buildBreadcrumbChainMap = (
  menus: SidebarMenuItem[],
  parentChain: SidebarMenuItem[] = [],
  chainMap = new Map<string, SidebarMenuItem[]>(),
): Map<string, SidebarMenuItem[]> => {
  menus.forEach((menu) => {
    // 当前节点的链路等于父链路 + 当前节点。
    const chain = [...parentChain, menu];
    // 记录每个 path 对应的完整面包屑链路。
    chainMap.set(menu.path, chain);

    if (menu.children?.length) {
      // 把当前链路继续传给子节点。
      buildBreadcrumbChainMap(menu.children, chain, chainMap);
    }
  });

  return chainMap;
};
