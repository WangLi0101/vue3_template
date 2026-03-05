import type { App, Directive } from "vue";
import { useAuthStore } from "@/stores/modules/auth";

const checkPermission = (
  value: string | string[],
  authStore: ReturnType<typeof useAuthStore>,
): boolean => {
  const permissions = Array.isArray(value) ? value : [value];
  return permissions.every((permission) =>
    authStore.permissions.has(permission),
  );
};

const permissionDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    const authStore = useAuthStore();
    const required = binding.value;

    if (!required) return;

    if (!checkPermission(required, authStore)) {
      el.style.display = "none";
    }
  },
  updated(el, binding) {
    const authStore = useAuthStore();
    const required = binding.value;

    if (!required) {
      el.style.removeProperty("display");
      return;
    }

    if (!checkPermission(required, authStore)) {
      el.style.display = "none";
      return;
    }

    el.style.removeProperty("display");
  },
};

export const setupPermissionDirective = (app: App): void => {
  app.directive("permission", permissionDirective);
};
