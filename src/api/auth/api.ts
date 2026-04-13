import { request } from "@/utils/http";
import type {
  AuthUser,
  LoginPayload,
  LoginResponse,
  PermissionCode,
  RefreshTokenPayload,
  RoleCode,
  SysMenu,
  TokenPair,
} from "@/api/auth/types";

export const loginApi = (payload: LoginPayload) => {
  return request<LoginResponse>("/auth/login", "MOCK", {
    method: "post",
    data: payload,
    isPublic: true,
  });
};

export const refreshTokenApi = (payload: RefreshTokenPayload) => {
  return request<TokenPair>("/auth/refresh", "MOCK", {
    method: "post",
    data: payload,
    isPublic: true,
    skipErrorToast: true,
  });
};

export const getCurrentUserApi = () => {
  return request<AuthUser>("/auth/me", "MOCK", {
    method: "get",
  });
};

export const getRolesApi = () => {
  return request<RoleCode[]>("/auth/roles", "MOCK", {
    method: "get",
  });
};

export const getPermissionsApi = () => {
  return request<PermissionCode[]>("/auth/permissions", "MOCK", {
    method: "get",
  });
};

export const getMenusApi = () => {
  return request<SysMenu[]>("/auth/menus", "MOCK", {
    method: "get",
  });
};
