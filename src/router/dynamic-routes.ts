import type { AppMenu } from "@/types/menu";
import AppRouterView from "@/components/AppRouterView.vue";
import type { RouteRecordRaw } from "vue-router";

// 预加载视图目录下的所有页面组件，供动态路由按路径匹配加载。
const viewModules = import.meta.glob("../views/**/*.vue");
// 未配置排序权重时，默认排在最后。
const DEFAULT_RANK = Number.MAX_SAFE_INTEGER;

// 统一去掉组件路径两端的斜杠，避免拼接视图路径时出现重复分隔符。
const normalizeComponent = (component: string): string =>
  component.replace(/^\/+/, "").replace(/\/+$/, "");

const trimSlashes = (path: string): string => path.replace(/^\/+/, "").replace(/\/+$/, "");

const normalizeFullPath = (path: string): string => {
  const normalized = trimSlashes(path);
  return normalized ? `/${normalized}` : "/";
};

const isNestedFullPath = (parentPath: string, currentPath: string): boolean => {
  const normalizedParent = trimSlashes(parentPath);
  const normalizedCurrent = trimSlashes(currentPath);

  if (!normalizedParent || !normalizedCurrent) return false;
  return (
    normalizedCurrent === normalizedParent || normalizedCurrent.startsWith(`${normalizedParent}/`)
  );
};

// 合并父子路由路径，同时兼容绝对路径、相对路径和完整路径场景。
const joinPath = (parentPath: string, currentPath: string): string => {
  if (currentPath.startsWith("/")) return normalizeFullPath(currentPath);
  if (isNestedFullPath(parentPath, currentPath)) return normalizeFullPath(currentPath);

  const normalizedParent = trimSlashes(parentPath);
  const normalizedCurrent = trimSlashes(currentPath);

  if (!normalizedParent) return normalizeFullPath(normalizedCurrent);
  if (!normalizedCurrent) return normalizeFullPath(normalizedParent);
  return normalizeFullPath(`${normalizedParent}/${normalizedCurrent}`);
};

// 动态路由的 child.path 仍需保持相对父级，完整路径要转换成相对段。
const resolveRoutePath = (parentPath: string, currentPath: string): string => {
  if (currentPath.startsWith("/")) return normalizeFullPath(currentPath);

  const normalizedParent = trimSlashes(parentPath);
  const normalizedCurrent = trimSlashes(currentPath);

  if (!normalizedParent || !normalizedCurrent) return normalizedCurrent || "/";
  if (!isNestedFullPath(parentPath, currentPath)) return normalizedCurrent;

  const relativePath = normalizedCurrent.slice(normalizedParent.length).replace(/^\/+/, "");
  return relativePath || normalizedCurrent;
};

// 提取菜单排序权重，非法值统一回退到默认值。
const getMenuRank = (menu: AppMenu): number =>
  typeof menu.meta.rank === "number" && Number.isFinite(menu.meta.rank)
    ? menu.meta.rank
    : DEFAULT_RANK;

// 按 rank 升序排序；rank 相同则保持原始顺序，避免菜单顺序抖动。
const sortMenusByRank = (menus: AppMenu[]): AppMenu[] =>
  menus
    .map((menu, index) => ({ menu, index }))
    .sort((left, right) => {
      const rankDelta = getMenuRank(left.menu) - getMenuRank(right.menu);
      return rankDelta === 0 ? left.index - right.index : rankDelta;
    })
    .map((item) => item.menu);

// 清理组件配置中的空白字符，便于后续统一判断。
const normalizeMenuComponent = (component?: string): string => (component || "").trim();

// 解析叶子节点组件；如果配置为 router-view，则使用通用容器组件。
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

// 根据菜单节点类型决定路由组件，兼容目录节点和页面节点。
const resolveComponent = (menu: AppMenu): RouteRecordRaw["component"] => {
  const component = normalizeMenuComponent(menu.component);
  const hasChildren = Boolean(menu.children?.length);

  if (component === "router-view") {
    return AppRouterView;
  }

  // 目录型菜单允许省略 component，此时回退到通用 RouterView 容器。
  if (hasChildren && !component) {
    return AppRouterView;
  }

  if (!component) {
    console.warn(`[RBAC] 菜单缺少组件配置: ${menu.name}`);
    return () => import("@/views/error/NotFoundPage.vue");
  }

  return resolveLeafComponent(component);
};

// 自动跳转到第一个可见子菜单，隐藏菜单仅作为兜底。
const resolveAutoRedirect = (
  children: AppMenu[],
  parentPath: string,
): RouteRecordRaw["redirect"] => {
  const firstVisibleChild = children.find((child) => !child.meta.hidden) || children[0];
  return joinPath(parentPath, firstVisibleChild.path);
};

// 递归将菜单树转换为 Vue Router 路由配置。
const menuToRoute = (menu: AppMenu, parentPath = ""): RouteRecordRaw => {
  const currentPath = joinPath(parentPath, menu.path);
  const sortedChildren = menu.children?.length ? sortMenusByRank(menu.children) : [];
  const route = {
    path: resolveRoutePath(parentPath, menu.path),
    name: menu.name,
    component: resolveComponent(menu),
    meta: {
      ...menu.meta,
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

// 入口方法：先排序顶层菜单，再批量生成动态路由。
export const buildRoutesFromMenus = (menus: AppMenu[]): RouteRecordRaw[] =>
  sortMenusByRank(menus).map((menu) => menuToRoute(menu));
