import type { App } from "vue";
import { setupPermissionDirective } from "./modules/permission";
import { setupRoleDirective } from "./modules/role";

export const setupDirectives = (app: App): void => {
  setupPermissionDirective(app);
  setupRoleDirective(app);
};
