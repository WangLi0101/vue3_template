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
      rank: 2,
      icon: "material-symbols:account-tree",
    },
    children: [
      {
        path: "group",
        name: "NestedStaticGroup",
        component: AppRouterView,
        redirect: "/nested-static/group/menu",
        meta: {
          title: "二级分组",
          rank: 1,
          icon: "material-symbols:account-tree",
        },
        children: [
          {
            path: "menu",
            name: "NestedStaticMenu",
            component: () => import("@/views/system/MenuPage.vue"),
            meta: {
              title: "三级-菜单页",
              rank: 1,
              keepAlive: false,
            },
          },
          {
            path: "role",
            name: "NestedStaticRole",
            component: () => import("@/views/system/RolePage.vue"),
            meta: {
              title: "三级-角色页",
              rank: 2,
              keepAlive: false,
            },
          },
        ],
      },
    ],
  },
];
