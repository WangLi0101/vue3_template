import type { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { staticRoutes } from "@/router/static-routes";

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
  scrollBehavior() {
    return { top: 0 };
  },
});
export const setupRouter = (app: App<Element>) => {
  app.use(router);
};
export default router;
