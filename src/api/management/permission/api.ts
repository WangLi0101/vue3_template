import { request } from "@/utils/http";
import type { PageResponse } from "@/types/common";
import type {
  BatchDeletePermissionsPayload,
  CreatePermissionPayload,
  PermissionItem,
  PermissionListPayload,
  PermissionMutationResponse,
  UpdatePermissionPayload,
} from "./types";

export const getPermissionListApi = (payload: PermissionListPayload) => {
  return request<PageResponse<PermissionItem>>("/management/permissions/list", "MOCK", {
    method: "post",
    data: payload,
  });
};

export const createPermissionApi = (payload: CreatePermissionPayload) => {
  return request<PermissionMutationResponse>("/management/permissions", "MOCK", {
    method: "post",
    data: payload,
  });
};

export const updatePermissionApi = (payload: UpdatePermissionPayload) => {
  return request<PermissionMutationResponse>("/management/permissions", "MOCK", {
    method: "put",
    data: payload,
  });
};

export const deletePermissionApi = (id: number) => {
  return request<PermissionMutationResponse>("/management/permissions", "MOCK", {
    method: "delete",
    params: { id },
  });
};

export const batchDeletePermissionsApi = (payload: BatchDeletePermissionsPayload) => {
  return request<PermissionMutationResponse>("/management/permissions/batch-delete", "MOCK", {
    method: "post",
    data: payload,
  });
};
