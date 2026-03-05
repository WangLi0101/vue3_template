import type { AppMenu, ProfileResponse } from "../../src/types/auth";

interface MockUserProfile extends Omit<ProfileResponse, "menus"> {
  password: string;
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
      icon: "icon:mdi:view-dashboard",
    },
  },
  {
    id: "200",
    name: "System",
    path: "system",
    component: "router-view",
    redirect: "/system/user",
    meta: {
      title: "系统管理",
      icon: "el:Setting",
    },
    children: [
      {
        id: "210",
        name: "SystemUser",
        path: "user",
        component: "system/UserPage",
        meta: {
          title: "用户管理",
          icon: "icon:mdi:account-group",
          permission: "sys:user:view",
          keepAlive: true,
        },
      },
      {
        id: "220",
        name: "SystemRole",
        path: "role",
        component: "system/RolePage",
        meta: {
          title: "角色管理",
          icon: "el:UserFilled",
          permission: "sys:role:view",
        },
      },
      {
        id: "230",
        name: "SystemMenu",
        path: "menu",
        component: "system/MenuPage",
        meta: {
          title: "菜单管理",
          icon: "icon:mdi:sitemap",
          permission: "sys:menu:view",
        },
      },
      {
        id: "240",
        name: "SystemPermission",
        path: "permission",
        component: "system/PermissionPage",
        meta: {
          title: "权限管理",
          icon: "icon:mdi:shield-key",
          permission: "sys:permission:view",
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
      icon: "icon:mdi:view-dashboard",
    },
  },
  {
    id: "200",
    name: "System",
    path: "system",
    component: "router-view",
    redirect: "/system/user",
    meta: {
      title: "系统管理",
      icon: "el:Setting",
    },
    children: [
      {
        id: "210",
        name: "SystemUser",
        path: "user",
        component: "system/UserPage",
        meta: {
          title: "用户管理",
          icon: "icon:mdi:account-group",
          permission: "sys:user:view",
          keepAlive: true,
        },
      },
      {
        id: "220",
        name: "SystemRole",
        path: "role",
        component: "system/RolePage",
        meta: {
          title: "角色管理",
          icon: "el:UserFilled",
          permission: "sys:role:view",
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

export const cloneMenus = (menus: AppMenu[]): AppMenu[] =>
  JSON.parse(JSON.stringify(menus));
