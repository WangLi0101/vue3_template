export type { AppMenu, AppRouteMeta } from "@/types/menu";

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

export type PermissionCode = string;

export type RoleCode = string;

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = TokenPair;

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface SysMenu {
  menuId: string;
  parentMenuId: string | null;
  menuName: string;
  menuType: string;
  routePath: string;
  componentPath: string;
  icon: string;
  sortNo: number;
  visible: boolean;
  status: number;
  permissionCode: string | null;
  remark: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
