import type { PermissionStatus } from "./constants";

export interface PermissionItem {
  id: number;
  name: string;
  code: string;
  type: number;
  parentId: number | null;
  sort: number;
  status: PermissionStatus;
  remark: string;
  createdAt: string;
}

export interface PermissionListPayload {
  name: string;
  code: string;
  status: PermissionStatus | null;
}

export interface CreatePermissionPayload {
  name: string;
  code: string;
  type: number;
  parentId: number | null;
  sort: number;
  status: PermissionStatus;
  remark: string;
}

export interface UpdatePermissionPayload {
  id: number;
  name: string;
  code: string;
  type: number;
  parentId: number | null;
  sort: number;
  status: PermissionStatus;
  remark: string;
}

export interface BatchDeletePermissionsPayload {
  ids: number[];
}

export interface PermissionMutationResponse {
  success: boolean;
}
