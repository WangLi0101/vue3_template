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

const DEFAULT_HOME_TITLE = "首页";
const DEFAULT_HOME_PATH = "/dashboard";

const createHomeTag = (
  title = DEFAULT_HOME_TITLE,
  path = DEFAULT_HOME_PATH,
  fullPath = path,
): RouteTag => ({
  title,
  path,
  fullPath,
  closable: false,
});

export const useTabsStore = defineStore("tabs", () => {
  const menuStore = useMenuStore();
  const tabs = ref<RouteTag[]>([createHomeTag()]);

  const resolveHomeTag = (): RouteTag => {
    const homeMenu = menuStore.sidebarMenus[0];
    if (!homeMenu) {
      return createHomeTag();
    }

    return createHomeTag(homeMenu.title, homeMenu.path);
  };

  const syncHomeTag = (): void => {
    const nextHomeTag = resolveHomeTag();
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
      closable: payload.path !== resolveHomeTag().path,
    });
  };

  const removeTag = (path: string): string | null => {
    const index = tabs.value.findIndex((tag) => tag.path === path);
    if (index <= 0) return null;

    tabs.value.splice(index, 1);

    const fallback = tabs.value[index] || tabs.value[index - 1] || tabs.value[0];
    return fallback?.fullPath || resolveHomeTag().fullPath;
  };

  const removeAllClosableTags = (): string | null => {
    const remainingTabs = tabs.value.filter((tag) => !tag.closable);
    if (remainingTabs.length === tabs.value.length) return null;

    tabs.value = remainingTabs;
    return remainingTabs[remainingTabs.length - 1]?.fullPath || resolveHomeTag().fullPath;
  };

  const reset = (): void => {
    tabs.value = [resolveHomeTag()];
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
