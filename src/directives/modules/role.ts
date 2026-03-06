import type { App, Directive } from "vue";
import { usePermissionStore } from "@/stores/modules/permission";

type RoleValue = string[];

export const checkRole = (value: RoleValue): boolean => {
  const permissionStore = usePermissionStore();
  return permissionStore.hasRole(value);
};

const removeWhenForbidden = (el: HTMLElement, required?: RoleValue): void => {
  if (!required) {
    return;
  }

  if (!checkRole(required)) {
    el.remove();
  }
};

const roleDirective: Directive<HTMLElement, RoleValue> = {
  mounted(el, binding) {
    removeWhenForbidden(el, binding.value);
  },
};

export const setupRoleDirective = (app: App): void => {
  app.directive("role", roleDirective);
};
