import { request } from "@/utils/http";
import type {
  CurrentUserResponse,
  LoginPayload,
  LoginResponse,
  MenusResponse,
  PermissionsResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RolesResponse,
} from "@/api/auth/types";

export const loginApi = (payload: LoginPayload) => {
  return request<LoginResponse>("/auth/login", "MOCK", {
    method: "post",
    data: payload,
    isPublic: true,
  });
};

export const refreshTokenApi = (payload: RefreshTokenPayload) => {
  return request<RefreshTokenResponse>("/auth/refresh", "MOCK", {
    method: "post",
    data: payload,
    isPublic: true,
    skipErrorToast: true,
  });
};

export const getCurrentUserApi = () => {
  return request<CurrentUserResponse>("/auth/me", "MOCK", {
    method: "get",
  });
};

export const getRolesApi = () => {
  return request<RolesResponse>("/auth/roles", "MOCK", {
    method: "get",
  });
};

export const getPermissionsApi = () => {
  return request<PermissionsResponse>("/auth/permissions", "MOCK", {
    method: "get",
  });
};

export const getMenusApi = () => {
  return request<MenusResponse>("/auth/menus", "MOCK", {
    method: "get",
  });
};
