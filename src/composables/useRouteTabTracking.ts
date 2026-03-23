import { watch } from "vue";
import { useRoute } from "vue-router";
import { useTabsStore } from "@/stores/modules/tabs";

export const useRouteTabTracking = (): void => {
  const route = useRoute();
  const tabsStore = useTabsStore();

  watch(
    [() => route.fullPath, () => route.meta.title],
    () => {
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
