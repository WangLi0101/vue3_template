import type { AuthUser, RoleCode } from "../../src/api/auth/types";
import type { AppMenu, PermissionCode } from "../../src/types/menu";

interface MockUserProfile {
  password: string;
  user: AuthUser;
  roles: RoleCode[];
  permissions: PermissionCode[];
  menus: AppMenu[];
}

const adminMenus: AppMenu[] = [
  {
    id: "100",
    name: "Dashboard",
    path: "dashboard",
    component: "dashboard/DashboardPage",
    meta: {
      title: "仪表盘",
      icon: "mdi:view-dashboard",
      rank: 1,
    },
  },
  {
    id: "200",
    name: "System",
    path: "system",
    meta: {
      title: "系统管理",
      icon: "mdi:cog-outline",
      rank: 3,
    },
    children: [
      {
        id: "210",
        name: "SystemUser",
        path: "user",
        component: "system/user/index",
        meta: {
          title: "用户管理",
          rank: 1,
          keepAlive: false,
        },
      },
      {
        id: "220",
        name: "SystemRole",
        path: "role",
        component: "system/role/index",
        meta: {
          title: "角色管理",
          rank: 2,
        },
      },
      {
        id: "230",
        name: "SystemMenu",
        path: "menu",
        component: "system/MenuPage",
        meta: {
          title: "菜单管理",
          rank: 3,
        },
      },
      {
        id: "240",
        name: "SystemPermission",
        path: "permission",
        component: "system/PermissionPage",
        meta: {
          title: "权限管理",
          rank: 4,
        },
      },
    ],
  },
];

const auditorMenus: AppMenu[] = [
  {
    id: "100",
    name: "Dashboard",
    path: "dashboard",
    component: "dashboard/DashboardPage",
    meta: {
      title: "仪表盘",
      icon: "mdi:view-dashboard",
      rank: 1,
    },
  },
  {
    id: "200",
    name: "System",
    path: "system",
    meta: {
      title: "系统管理",
      icon: "mdi:cog-outline",
      rank: 2,
    },
    children: [
      {
        id: "240",
        name: "SystemPermission",
        path: "permission",
        component: "system/PermissionPage",
        meta: {
          title: "权限管理",
          rank: 4,
        },
      },
    ],
  },
];

export const mockProfiles: Record<string, MockUserProfile> = {
  admin: {
    password: "admin123",
    user: { id: "1", username: "admin", displayName: "系统管理员" },
    roles: ["super_admin"],
    permissions: [
      "sys:user:view",
      "sys:user:create",
      "sys:user:edit",
      "sys:user:delete",
      "sys:role:view",
      "sys:role:create",
      "sys:menu:view",
      "sys:permission:view",
    ],
    menus: adminMenus,
  },
  auditor: {
    password: "auditor123",
    user: { id: "2", username: "auditor", displayName: "审计员" },
    roles: ["auditor"],
    permissions: ["sys:user:view", "sys:role:view"],
    menus: auditorMenus,
  },
};

export const cloneMenus = (menus: AppMenu[]): AppMenu[] => JSON.parse(JSON.stringify(menus));
