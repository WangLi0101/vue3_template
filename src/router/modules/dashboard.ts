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
];
