import type { App, Directive } from "vue";
import { useAuthStore } from "@/stores/modules/auth";

type PermissionValue = string | string[];

export const checkPermission = (value: PermissionValue): boolean => {
  const authStore = useAuthStore();
  const permissions = Array.isArray(value) ? value : [value];
  return permissions.some((permission) =>
    authStore.permissions.has(permission),
  );
};

const removeWhenForbidden = (
  el: HTMLElement,
  required?: PermissionValue,
): void => {
  if (!required) {
    return;
  }

  if (!checkPermission(required)) {
    el.remove();
  }
};

const permissionDirective: Directive<HTMLElement, PermissionValue> = {
  mounted(el, binding) {
    removeWhenForbidden(el, binding.value);
  },
};

export const setupPermissionDirective = (app: App): void => {
  app.directive("permission", permissionDirective);
};
