import type { RouteRecordRaw } from "vue-router";
import AppRouterView from "@/components/AppRouterView.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "nested-static",
    name: "NestedStatic",
    component: AppRouterView,
    redirect: "/nested-static/group/menu",
    meta: {
      title: "三级路由示例",
      requiresAuth: true,
    },
    children: [
      {
        path: "group",
        name: "NestedStaticGroup",
        component: AppRouterView,
        redirect: "/nested-static/group/menu",
        meta: {
          title: "二级分组",
          requiresAuth: true,
        },
        children: [
          {
            path: "menu",
            name: "NestedStaticMenu",
            component: () => import("@/views/system/MenuPage.vue"),
            meta: {
              title: "三级-菜单页",
              requiresAuth: true,
              keepAlive: true,
            },
          },
          {
            path: "role",
            name: "NestedStaticRole",
            component: () => import("@/views/system/RolePage.vue"),
            meta: {
              title: "三级-角色页",
              requiresAuth: true,
              keepAlive: true,
            },
          },
        ],
      },
    ],
  },
];
