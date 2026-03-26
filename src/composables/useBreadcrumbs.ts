import { computed } from "vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "@/stores/modules/menu";
import { buildBreadcrumbChainMap } from "@/utils/menu";
import type { BreadcrumbItem } from "@/utils/menu";

type BreadcrumbRouteLike = Pick<ReturnType<typeof useRoute>, "path" | "matched">;

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

export const useBreadcrumbs = () => {
  const route = useRoute();
  const menuStore = useMenuStore();
  const breadcrumbChainMap = computed(() => buildBreadcrumbChainMap(menuStore.allMenus));

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const home: BreadcrumbItem = {
      title: "首页",
      path: menuStore.homeMenuPath,
    };

    // 当前就在首页时直接返回单节点面包屑。
    if (route.path === menuStore.homeMenuPath) {
      return [home];
    }

    // 优先使用当前路由的 matched 链路，兼容隐藏页和不在侧边栏中的详情页。
    const routeChain = buildBreadcrumbsFromRoute(route);
    if (routeChain.length) {
      if (routeChain[0].path !== menuStore.homeMenuPath) {
        return [home, ...routeChain];
      }

      routeChain[0] = {
        ...home,
        path: menuStore.homeMenuPath,
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
    if (chain[0].path !== menuStore.homeMenuPath) {
      return [home, ...chain];
    }

    // 如果第一项本身就是首页，则统一替换成标准首页对象。
    chain[0] = {
      ...home,
      path: menuStore.homeMenuPath,
    };
    return chain;
  });

  return {
    breadcrumbs,
  };
};
