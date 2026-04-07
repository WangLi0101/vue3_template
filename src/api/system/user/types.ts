import type { UserStatus } from "./constants";

export interface RoleOption {
  label: string;
  value: number;
  code: string;
}

export interface UserItem {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  email: string;
  roleIds: number[];
  roleNames: string[];
  status: UserStatus;
  remark: string;
  createdAt: string;
}

export interface UserListPayload {
  pageNum: number;
  pageSize: number;
  username?: string;
  nickname?: string;
  status?: UserStatus | null;
  roleId?: number | null;
}

export interface UserListResponse {
  list: UserItem[];
  total: number;
}

export interface CreateUserPayload {
  username: string;
  nickname: string;
  password: string;
  phone: string;
  email: string;
  roleIds: number[];
  status: UserStatus;
  remark: string;
}

export interface UpdateUserPayload {
  id: number;
  nickname: string;
  phone: string;
  email: string;
  roleIds: number[];
  status: UserStatus;
  remark: string;
}

export interface BatchDeleteUsersPayload {
  ids: number[];
}

export interface UserMutationResponse {
  success: boolean;
}
