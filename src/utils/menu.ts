import type { SysMenu } from "@/api/auth";
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
  // 是否隐藏，仅用于控制导航展示，不影响路由和面包屑索引。
  hidden?: boolean;
  // 子菜单节点，叶子节点时为空。
  children?: SidebarMenuItem[];
}

export interface BreadcrumbItem {
  // 面包屑文案。
  title: string;
  // 对应的规范路由路径，用于标识当前面包屑节点。
  path: string;
}

const trimSlashes = (path: string): string => path.replace(/^\/+/, "").replace(/\/+$/, "");

const normalizeFullPath = (path: string): string => {
  const normalized = trimSlashes(path);
  return normalized ? `/${normalized}` : "/";
};

// 兼容后端直接返回完整路径，如 "system/user"。
const isNestedFullPath = (parentPath: string, currentPath: string): boolean => {
  const normalizedParent = trimSlashes(parentPath);
  const normalizedCurrent = trimSlashes(currentPath);

  if (!normalizedParent || !normalizedCurrent) return false;
  return (
    normalizedCurrent === normalizedParent || normalizedCurrent.startsWith(`${normalizedParent}/`)
  );
};

// 统一拼接父子路径，避免出现重复斜杠，并兼容绝对路径子节点和完整路径子节点。
const joinPath = (parentPath: string, currentPath: string): string => {
  // 子节点如果已经是绝对路径，直接返回，避免重复拼接父路径。
  if (currentPath.startsWith("/")) return normalizeFullPath(currentPath);
  if (isNestedFullPath(parentPath, currentPath)) return normalizeFullPath(currentPath);

  const normalizedParent = trimSlashes(parentPath);
  const normalizedCurrent = trimSlashes(currentPath);

  if (!normalizedParent) return normalizeFullPath(normalizedCurrent);
  if (!normalizedCurrent) return normalizeFullPath(normalizedParent);
  return normalizeFullPath(`${normalizedParent}/${normalizedCurrent}`);
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

// 后端菜单树转换为完整菜单结构，保留 hidden 信息供不同场景决定是否展示。
export const toMenuItems = (menus: AppMenu[], parentPath = ""): SidebarMenuItem[] => {
  return sortWithRank(menus, (menu) => resolveRank(menu.meta.rank)).map((menu) => {
    // 对后端返回的相对路径补齐父级路径，产出完整菜单路径。
    const currentPath = joinPath(parentPath, menu.path);
    // 递归转换子节点，保持菜单树结构与源数据一致。
    const children = menu.children?.length ? toMenuItems(menu.children, currentPath) : undefined;

    return {
      id: menu.id,
      name: menu.name,
      path: currentPath,
      title: menu.meta.title,
      icon: menu.meta.icon,
      rank: resolveRank(menu.meta.rank),
      hidden: Boolean(menu.meta.hidden),
      children,
    };
  });
};

// 模块路由转换为完整菜单结构；没有 title 的容器节点会被其子节点“抬平”。
export const toMenuItemsFromRoutes = (
  routes: RouteRecordRaw[],
  parentPath = "",
): SidebarMenuItem[] => {
  return sortWithRank(routes, (route) =>
    resolveRank((route.meta as Record<string, unknown> | undefined)?.rank),
  ).flatMap((route, index) => {
    // RouteRecordRaw.meta 默认是宽泛类型，这里收敛成可安全读取的对象。
    const routeMeta = (route.meta || {}) as Record<string, unknown>;

    // 当前路由完整路径，用于后续侧边栏点击和面包屑展示。
    const currentPath = joinPath(parentPath, route.path);
    const routeChildren = (route.children || []) as RouteRecordRaw[];
    // 递归处理路由子节点。
    const children = toMenuItemsFromRoutes(routeChildren, currentPath);
    const title = typeof routeMeta.title === "string" ? routeMeta.title : "";
    const icon = typeof routeMeta.icon === "string" ? routeMeta.icon : undefined;
    const hidden = Boolean(routeMeta.hidden);

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
        hidden,
        children: children.length ? children : undefined,
      },
    ];
  });
};

// 合并后端菜单和本地模块路由，按 path 去重后再统一排序。
export const mergeMenus = (
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

// 侧边栏只展示非 hidden 菜单；隐藏父节点的可见子节点会被提升，避免整支丢失。
export const toSidebarMenus = (menus: SidebarMenuItem[]): SidebarMenuItem[] => {
  return menus.flatMap((menu) => {
    const children = menu.children?.length ? toSidebarMenus(menu.children) : undefined;

    if (menu.hidden) {
      return children || [];
    }

    return [
      {
        ...menu,
        children: children?.length ? children : undefined,
      },
    ];
  });
};

export const findFirstLeafMenu = (menus: SidebarMenuItem[]): SidebarMenuItem | null => {
  for (const menu of menus) {
    if (menu.children?.length) {
      const firstLeafChild = findFirstLeafMenu(menu.children);
      if (firstLeafChild) {
        return firstLeafChild;
      }
    }

    return menu;
  }

  return null;
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

export const transformMenusToTree = (menus: SysMenu[]): AppMenu[] => {
  const menuMap = new Map<string, AppMenu>();
  const rootMenus: AppMenu[] = [];

  menus.forEach((menu) => {
    const appMenu: AppMenu = {
      id: menu.menuId,
      name: menu.menuId,
      path: menu.routePath,
      component: menu.componentPath,
      meta: {
        title: menu.menuName,
        icon: menu.icon,
        rank: menu.sortNo,
        hidden: !menu.visible,
      },
    };
    menuMap.set(menu.menuId, appMenu);
  });

  menus.forEach((menu) => {
    const appMenu = menuMap.get(menu.menuId);
    if (!appMenu) return;

    if (!menu.parentMenuId || menu.parentMenuId === "0" || menu.parentMenuId === "") {
      rootMenus.push(appMenu);
    } else {
      const parentMenu = menuMap.get(menu.parentMenuId);
      if (parentMenu) {
        if (!parentMenu.children) {
          parentMenu.children = [];
        }
        parentMenu.children.push(appMenu);
      } else {
        rootMenus.push(appMenu);
      }
    }
  });

  const sortAppMenus = (items: AppMenu[]): AppMenu[] => {
    return sortWithRank(items, (item) => resolveRank(item.meta.rank)).map((item) => {
      if (item.children?.length) {
        return { ...item, children: sortAppMenus(item.children) };
      }
      return item;
    });
  };

  return sortAppMenus(rootMenus);
};
