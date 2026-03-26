import { defineStore } from "pinia";
import { ref } from "vue";
import { useMenuStore } from "./menu";

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

const createHomeTag = (title: string, path: string, fullPath = path): RouteTag => ({
  title,
  path,
  fullPath,
  closable: false,
});

export const useTabsStore = defineStore("tabs", () => {
  const menuStore = useMenuStore();
  const tabs = ref<RouteTag[]>([]);

  const resolveHomeTag = (): RouteTag | null => {
    const homeMenu = menuStore.resolveHomeMenu();
    if (!homeMenu) {
      return null;
    }

    return createHomeTag(homeMenu.title, homeMenu.path);
  };

  const syncHomeTag = (): void => {
    const nextHomeTag = resolveHomeTag();
    if (!nextHomeTag) {
      tabs.value = [];
      return;
    }

    const currentHomeIndex = tabs.value.findIndex((tag) => !tag.closable);

    if (currentHomeIndex === -1) {
      tabs.value.unshift(nextHomeTag);
      return;
    }

    tabs.value[currentHomeIndex] = {
      ...tabs.value[currentHomeIndex],
      ...nextHomeTag,
      closable: false,
    };

    tabs.value = tabs.value.filter(
      (tag, index) => index === currentHomeIndex || tag.path !== nextHomeTag.path,
    );
  };

  const isTrackableRoute = (payload: AddTagPayload): boolean => {
    if (payload.isPublic) return false;
    if (payload.hidden) return false;
    if (!payload.path || !payload.title) return false;
    if (payload.path === "/" || payload.name === "Root") return false;
    if (payload.name === "Forbidden" || payload.name === "NotFound") return false;
    return true;
  };

  const addTag = (payload: AddTagPayload): void => {
    if (!isTrackableRoute(payload)) return;

    syncHomeTag();

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
      closable: payload.path !== nextHomePath(),
    });
  };

  const nextHomePath = (): string | null => resolveHomeTag()?.path || null;

  const removeTag = (path: string): string | null => {
    const index = tabs.value.findIndex((tag) => tag.path === path);
    if (index <= 0) return null;

    tabs.value.splice(index, 1);

    const fallback = tabs.value[index] || tabs.value[index - 1] || tabs.value[0];
    return fallback?.fullPath || nextHomePath();
  };

  const removeAllClosableTags = (): string | null => {
    const remainingTabs = tabs.value.filter((tag) => !tag.closable);
    if (remainingTabs.length === tabs.value.length) return null;

    tabs.value = remainingTabs;
    return remainingTabs[remainingTabs.length - 1]?.fullPath || nextHomePath();
  };

  const reset = (): void => {
    tabs.value = [];
  };

  return {
    tabs,
    addTag,
    removeTag,
    removeAllClosableTags,
    syncHomeTag,
    reset,
  };
});
