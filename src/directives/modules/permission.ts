import type { App, Directive } from "vue";
import { usePermissionStore } from "@/stores/modules/permission";

type PermissionValue = string | string[];

export const checkPermission = (value: PermissionValue): boolean => {
  const permissionStore = usePermissionStore();
  return permissionStore.hasAny(value);
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
