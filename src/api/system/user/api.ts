import { request } from "@/utils/http";
import type {
  BatchDeleteUsersPayload,
  CreateUserPayload,
  RoleOption,
  UpdateUserPayload,
  UserListQuery,
  UserListResponse,
  UserMutationResponse,
} from "@/api/system/user/types";

export const getUserListApi = (params: UserListQuery) => {
  return request<UserListResponse>("/system/users/list", "MOCK", {
    method: "post",
    data: params,
  });
};

export const getRoleOptionsApi = () => {
  return request<RoleOption[]>("/system/roles/options", "MOCK", {
    method: "get",
  });
};

export const createUserApi = (payload: CreateUserPayload) => {
  return request<UserMutationResponse>("/system/users", "MOCK", {
    method: "post",
    data: payload,
  });
};

export const updateUserApi = (payload: UpdateUserPayload) => {
  return request<UserMutationResponse>("/system/users", "MOCK", {
    method: "put",
    data: payload,
  });
};

export const deleteUserApi = (id: number) => {
  return request<UserMutationResponse>("/system/users", "MOCK", {
    method: "delete",
    params: { id },
  });
};

export const batchDeleteUsersApi = (payload: BatchDeleteUsersPayload) => {
  return request<UserMutationResponse>("/system/users/batch-delete", "MOCK", {
    method: "post",
    data: payload,
  });
};
