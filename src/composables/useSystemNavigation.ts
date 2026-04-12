import { ElMessage } from "element-plus";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { systemList } from "@/config/api";
import type { SystemItem } from "@/config/api";
import { useAuthStore } from "@/stores/modules/auth";
import { usePermissionStore } from "@/stores/modules/permission";
import { getAccessToken, getAuthTokens } from "@/utils/token";

// 判断目标地址是否为外部系统地址。
const isExternalTarget = (target: string): boolean => /^https?:\/\//.test(target);

// 统一规范化目标地址，便于后续做系统匹配。
const normalizeTarget = (target: string): string => {
  if (!target) {
    return "";
  }

  try {
    const url = isExternalTarget(target)
      ? new URL(target)
      : new URL(target, window.location.origin);
    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return url.toString();
  } catch (_error) {
    return target;
  }
};

// 为外部系统地址补上当前登录态 token。
const buildExternalTargetUrl = (target: string): string => {
  const authTokens = getAuthTokens();
  const url = new URL(target, window.location.origin);
  const [hashPath = "/", hashQuery = ""] = url.hash.replace(/^#/, "").split("?");
  const hashSearchParams = new URLSearchParams(hashQuery);

  hashSearchParams.set("accessToken", authTokens.accessToken);
  hashSearchParams.set("refreshToken", authTokens.refreshToken);

  const nextHashQuery = hashSearchParams.toString();
  url.hash = nextHashQuery ? `${hashPath}?${nextHashQuery}` : hashPath;
  return url.toString();
};

// 执行外部系统跳转。
const navigateToExternalTarget = (target: string): void => {
  const externalUrl = buildExternalTargetUrl(target);
  window.location.replace(externalUrl);
};

export const useSystemNavigation = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();

  // 判断当前账号是否有权限访问指定系统。
  const canAccessSystem = (item: SystemItem): boolean => {
    if (!item.roles?.length) {
      return true;
    }

    return permissionStore.hasRole(item.roles);
  };

  // 过滤出当前账号实际可访问的系统列表。
  const accessibleSystemList = computed<SystemItem[]>(() => {
    return systemList.filter((item) => canAccessSystem(item));
  });

  // 根据目标地址反查对应的系统配置。
  const resolveSystemByTarget = (target: string): SystemItem | null => {
    const normalizedTarget = normalizeTarget(target);
    if (!normalizedTarget) {
      return null;
    }

    return systemList.find((item) => normalizeTarget(item.url) === normalizedTarget) || null;
  };

  // 根据地址类型执行站内或站外跳转。
  const performNavigation = async (target: string): Promise<void> => {
    if (isExternalTarget(target)) {
      navigateToExternalTarget(target);
      return;
    }

    await router.replace(target);
  };

  // 确保当前登录态和会话数据已经准备完成。
  const ensureSessionReady = async (): Promise<boolean> => {
    if (!getAccessToken()) {
      return false;
    }

    if (!authStore.isInitialized) {
      const sessionReady = await authStore.initializeSession();
      if (!sessionReady) {
        await authStore.logoutLocal();
        return false;
      }
    }

    return true;
  };

  // 统一处理系统目标校验、权限判断和最终跳转。
  const navigateBySystemTarget = async (
    target: string,
    fallback = "/systemList",
  ): Promise<void> => {
    const sessionReady = await ensureSessionReady();
    if (!sessionReady) {
      ElMessage.warning("登录状态已失效，请重新登录");
      return;
    }

    const system = resolveSystemByTarget(target);
    if (!system) {
      await performNavigation(fallback);
      ElMessage.warning("目标系统不存在，已为您返回系统列表");
      return;
    }

    if (!canAccessSystem(system)) {
      await performNavigation(fallback);
      ElMessage.warning("当前账号无权进入目标系统，已为您返回系统列表");
      return;
    }

    await performNavigation(system.url);
  };

  return {
    systemList,
    accessibleSystemList,
    canAccessSystem,
    resolveSystemByTarget,
    navigateBySystemTarget,
  };
};
