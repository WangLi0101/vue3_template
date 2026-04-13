import { request } from "@/utils/http";
import type { PageResponse } from "@/types/common";
import type {
  BatchDeleteRolesPayload,
  CreateRolePayload,
  RoleItem,
  RoleListPayload,
  RoleMutationResponse,
  UpdateRolePayload,
} from "./types";

export const getRoleListApi = (payload: RoleListPayload) => {
  return request<PageResponse<RoleItem>>("/management/roles/list", "MOCK", {
    method: "post",
    data: payload,
  });
};

export const createRoleApi = (payload: CreateRolePayload) => {
  return request<RoleMutationResponse>("/management/roles", "MOCK", {
    method: "post",
    data: payload,
  });
};

export const updateRoleApi = (payload: UpdateRolePayload) => {
  return request<RoleMutationResponse>("/management/roles", "MOCK", {
    method: "put",
    data: payload,
  });
};

export const deleteRoleApi = (id: number) => {
  return request<RoleMutationResponse>("/management/roles", "MOCK", {
    method: "delete",
    params: { id },
  });
};

export const batchDeleteRolesApi = (payload: BatchDeleteRolesPayload) => {
  return request<RoleMutationResponse>("/management/roles/batch-delete", "MOCK", {
    method: "post",
    data: payload,
  });
};
