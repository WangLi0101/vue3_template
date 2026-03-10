import AppLayout from "@/layout/AppLayout.vue";
import { rootRouteModules } from "@/router/module-routes";
import type { RouteRecordRaw } from "vue-router";

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/LoginPage.vue"),
    meta: {
      title: "登录",
      public: true,
    },
  },
  {
    path: "/403",
    name: "Forbidden",
    component: () => import("@/views/error/ForbiddenPage.vue"),
    meta: {
      title: "无权限",
      requiresAuth: true,
    },
  },
  {
    path: "/",
    name: "Root",
    component: AppLayout,
    redirect: "/dashboard",
    meta: {
      title: "首页",
      requiresAuth: true,
    },
    children: [...rootRouteModules],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/error/NotFoundPage.vue"),
    meta: {
      title: "404",
      requiresAuth: true,
    },
  },
];
