import type { AppMenu, PermissionCode } from "@/types/menu";
export type { AppMenu, AppRouteMeta, PermissionCode } from "@/types/menu";

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface ProfileResponse {
  user: AuthUser;
  roles: string[];
  permissions: PermissionCode[];
  menus: AppMenu[];
}
