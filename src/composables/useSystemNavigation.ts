import { computed } from "vue";
import { useRouter } from "vue-router";
import { systemList } from "@/config/api";
import type { SystemItem } from "@/config/api";
import { usePermissionStore } from "@/stores/modules/permission";
import { getAuthTokens } from "@/utils/token";

const isExternalTarget = (target: string): boolean => /^https?:\/\//.test(target);

const buildExternalTargetUrl = (target: string): string => {
  const authTokens = getAuthTokens();
  const url = new URL(target, window.location.origin);
  url.searchParams.set("accessToken", authTokens.accessToken);
  url.searchParams.set("refreshToken", authTokens.refreshToken);
  return url.toString();
};

const navigateToExternalTarget = (target: string): void => {
  const externalUrl = buildExternalTargetUrl(target);
  window.location.replace(externalUrl);
};

export const useSystemNavigation = () => {
  const router = useRouter();
  const permissionStore = usePermissionStore();

  const canAccessSystem = (item: SystemItem): boolean => {
    if (!item.roles?.length) {
      return true;
    }

    return permissionStore.hasRole(item.roles);
  };

  const accessibleSystemList = computed<SystemItem[]>(() => {
    return systemList.filter((item) => canAccessSystem(item));
  });

  const navigateToTarget = async (target: string): Promise<void> => {
    if (isExternalTarget(target)) {
      navigateToExternalTarget(target);
      return;
    }

    await router.replace(target);
  };

  const navigateToSystem = async (item: SystemItem): Promise<boolean> => {
    if (!canAccessSystem(item)) {
      return false;
    }

    if (item.type === "external") {
      navigateToExternalTarget(item.url);
      return true;
    }

    await navigateToTarget(item.url);

    return true;
  };

  return {
    systemList,
    accessibleSystemList,
    canAccessSystem,
    navigateToTarget,
    navigateToSystem,
  };
};
