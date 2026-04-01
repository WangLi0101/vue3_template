import AppRouterView from "@/components/AppRouterView.vue";
import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "dashboard",
    name: "Dashboard",
    component: () => import("@/views/dashboard/DashboardPage.vue"),
    meta: {
      title: "仪表盘",
      icon: "mdi:view-dashboard",
      rank: 1,
    },
  },
  {
    path: "system",
    name: "System",
    component: AppRouterView,
    meta: {
      title: "系统管理",
      icon: "mdi:cog-outline",
      rank: 3,
    },
    children: [
      {
        path: "user",
        name: "SystemUser",
        component: () => import("@/views/system/user/index.vue"),
        meta: {
          title: "用户管理",
          rank: 1,
          keepAlive: false,
        },
      },
      {
        path: "role",
        name: "SystemRole",
        component: () => import("@/views/system/role/index.vue"),
        meta: {
          title: "角色管理",
          rank: 2,
        },
      },
      {
        path: "menu",
        name: "SystemMenu",
        component: () => import("@/views/system/menu/index.vue"),
        meta: {
          title: "菜单管理",
          rank: 3,
        },
      },
      {
        path: "permission",
        name: "SystemPermission",
        component: () => import("@/views/system/permission/index.vue"),
        meta: {
          title: "权限管理",
          rank: 4,
        },
      },
    ],
  },
];
