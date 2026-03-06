import type { App, Directive } from "vue";
import { useAuthStore } from "@/stores/modules/auth";

type RoleValue = string[];

export const checkRole = (value: RoleValue): boolean => {
  const authStore = useAuthStore();
  const roles = Array.isArray(value) ? value : [value];
  return roles.some((role) => authStore.roles.includes(role));
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
