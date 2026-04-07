import type { RoleStatus } from "./constants";

export interface RoleItem {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: RoleStatus;
  remark: string;
  createdAt: string;
  userCount: number;
}

export interface RoleListPayload {
  name?: string;
  code?: string;
  status?: RoleStatus;
}

export interface RoleListResponse {
  list: RoleItem[];
  total: number;
}

export interface CreateRolePayload {
  name: string;
  code: string;
  sort: number;
  status: RoleStatus;
  remark: string;
}

export interface UpdateRolePayload {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: RoleStatus;
  remark: string;
}

export interface BatchDeleteRolesPayload {
  ids: number[];
}

export interface RoleMutationResponse {
  success: boolean;
}
