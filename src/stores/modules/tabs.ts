import { defineStore } from "pinia";
import { ref } from "vue";

export interface RouteTag {
  title: string;
  path: string;
  fullPath: string;
  closable: boolean;
}

interface AddTagPayload {
  title: string;
  path: string;
  fullPath: string;
  isPublic: boolean;
  hidden: boolean;
  name: string;
}

const createHomeTag = (): RouteTag => ({
  title: "首页",
  path: "/dashboard",
  fullPath: "/dashboard",
  closable: false,
});

export const useTabsStore = defineStore("tabs", () => {
  const tabs = ref<RouteTag[]>([createHomeTag()]);

  const isTrackableRoute = (payload: AddTagPayload): boolean => {
    if (payload.isPublic) return false;
    if (payload.hidden) return false;
    if (!payload.path || !payload.title) return false;
    if (payload.name === "Forbidden" || payload.name === "NotFound") return false;
    return true;
  };

  const addTag = (payload: AddTagPayload): void => {
    if (!isTrackableRoute(payload)) return;

    const exists = tabs.value.find((tag) => tag.path === payload.path);
    if (exists) {
      exists.title = payload.title;
      exists.fullPath = payload.fullPath;
      return;
    }

    tabs.value.push({
      title: payload.title,
      path: payload.path,
      fullPath: payload.fullPath,
      closable: payload.path !== "/dashboard",
    });
  };

  const removeTag = (path: string): string | null => {
    const index = tabs.value.findIndex((tag) => tag.path === path);
    if (index <= 0) return null;

    tabs.value.splice(index, 1);

    const fallback = tabs.value[index] || tabs.value[index - 1] || tabs.value[0];
    return fallback?.fullPath || "/dashboard";
  };

  const removeAllClosableTags = (): string | null => {
    const remainingTabs = tabs.value.filter((tag) => !tag.closable);
    if (remainingTabs.length === tabs.value.length) return null;

    tabs.value = remainingTabs;
    return remainingTabs[remainingTabs.length - 1]?.fullPath || "/dashboard";
  };

  const reset = (): void => {
    tabs.value = [createHomeTag()];
  };

  return {
    tabs,
    addTag,
    removeTag,
    removeAllClosableTags,
    reset,
  };
});
