import { watch } from "vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "@/stores/modules/menu";
import { useTabsStore } from "@/stores/modules/tabs";

export const useRouteTabTracking = (): void => {
  const route = useRoute();
  const menuStore = useMenuStore();
  const tabsStore = useTabsStore();

  watch(
    () => route.fullPath,
    () => {
      menuStore.rememberRoute(route.path, route.fullPath);
      tabsStore.addTag({
        title: (route.meta.title as string) || "未命名页面",
        path: route.path,
        fullPath: route.fullPath,
        isPublic: Boolean(route.meta.public),
        hidden: Boolean(route.meta.hidden),
        name: route.name ? String(route.name) : "",
      });
    },
    { immediate: true },
  );
};
