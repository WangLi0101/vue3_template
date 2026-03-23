import type { AppMenu, PermissionCode } from "@/types/menu";
export type { AppMenu, AppRouteMeta, PermissionCode } from "@/types/menu";

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

export type RoleCode = string;

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface CurrentUserResponse {
  user: AuthUser;
}

export interface RolesResponse {
  roles: RoleCode[];
}

export interface PermissionsResponse {
  permissions: PermissionCode[];
}

export interface MenusResponse {
  menus: AppMenu[];
}
