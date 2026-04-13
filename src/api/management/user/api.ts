import { request } from "@/utils/http";
import type { PageResponse } from "@/types/common";
import type {
  BatchDeleteUsersPayload,
  CreateUserPayload,
  RoleOption,
  UpdateUserPayload,
  UserItem,
  UserListPayload,
  UserMutationResponse,
} from "./types";

export const getUserListApi = (payload: UserListPayload) => {
  return request<PageResponse<UserItem>>("/management/users/list", "MOCK", {
    method: "post",
    data: payload,
  });
};

export const getRoleOptionsApi = () => {
  return request<RoleOption[]>("/management/roles/options", "MOCK", {
    method: "get",
  });
};

export const createUserApi = (payload: CreateUserPayload) => {
  return request<UserMutationResponse>("/management/users", "MOCK", {
    method: "post",
    data: payload,
  });
};

export const updateUserApi = (payload: UpdateUserPayload) => {
  return request<UserMutationResponse>("/management/users", "MOCK", {
    method: "put",
    data: payload,
  });
};

export const deleteUserApi = (id: number) => {
  return request<UserMutationResponse>("/management/users", "MOCK", {
    method: "delete",
    params: { id },
  });
};

export const batchDeleteUsersApi = (payload: BatchDeleteUsersPayload) => {
  return request<UserMutationResponse>("/management/users/batch-delete", "MOCK", {
    method: "post",
    data: payload,
  });
};
