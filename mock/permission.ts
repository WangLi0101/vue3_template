import type { ServerResponse } from "node:http";
import type { MockMethod } from "vite-plugin-mock";
import type { PermissionStatus } from "../src/api/management/permission/constants";
import { PERMISSION_STATUS } from "../src/api/management/permission/constants";
import type { ApiResponse } from "../src/types/http";
import { removeAllSpace } from "../src/utils/tool";
import { resolveProfileFromAccessToken, resolveRequestToken } from "./token-session";

interface MockPermissionRecord {
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

interface PermissionListQuery {
  name?: string;
  code?: string;
  status?: string;
}

interface CreatePermissionPayload {
  name?: string;
  code?: string;
  type?: number;
  parentId?: number | null;
  sort?: number;
  status?: PermissionStatus;
  remark?: string;
}

interface UpdatePermissionPayload extends CreatePermissionPayload {
  id?: number;
}

const initialPermissions: MockPermissionRecord[] = [
  {
    id: 1,
    name: "用户管理",
    code: "sys:user",
    type: 1,
    parentId: null,
    sort: 1,
    status: PERMISSION_STATUS.ENABLED,
    remark: "用户管理菜单权限",
    createdAt: "2026-03-01 09:00:00",
  },
  {
    id: 2,
    name: "查看用户",
    code: "sys:user:view",
    type: 2,
    parentId: 1,
    sort: 1,
    status: PERMISSION_STATUS.ENABLED,
    remark: "查看用户列表",
    createdAt: "2026-03-01 09:10:00",
  },
  {
    id: 3,
    name: "创建用户",
    code: "sys:user:create",
    type: 2,
    parentId: 1,
    sort: 2,
    status: PERMISSION_STATUS.ENABLED,
    remark: "创建新用户",
    createdAt: "2026-03-01 09:20:00",
  },
  {
    id: 4,
    name: "编辑用户",
    code: "sys:user:edit",
    type: 2,
    parentId: 1,
    sort: 3,
    status: PERMISSION_STATUS.ENABLED,
    remark: "编辑用户信息",
    createdAt: "2026-03-01 09:30:00",
  },
  {
    id: 5,
    name: "删除用户",
    code: "sys:user:delete",
    type: 2,
    parentId: 1,
    sort: 4,
    status: PERMISSION_STATUS.ENABLED,
    remark: "删除用户",
    createdAt: "2026-03-01 09:40:00",
  },
  {
    id: 6,
    name: "角色管理",
    code: "sys:role",
    type: 1,
    parentId: null,
    sort: 2,
    status: PERMISSION_STATUS.ENABLED,
    remark: "角色管理菜单权限",
    createdAt: "2026-03-02 10:00:00",
  },
  {
    id: 7,
    name: "查看角色",
    code: "sys:role:view",
    type: 2,
    parentId: 6,
    sort: 1,
    status: PERMISSION_STATUS.ENABLED,
    remark: "查看角色列表",
    createdAt: "2026-03-02 10:10:00",
  },
  {
    id: 8,
    name: "创建角色",
    code: "sys:role:create",
    type: 2,
    parentId: 6,
    sort: 2,
    status: PERMISSION_STATUS.ENABLED,
    remark: "创建新角色",
    createdAt: "2026-03-02 10:20:00",
  },
  {
    id: 9,
    name: "菜单管理",
    code: "sys:menu",
    type: 1,
    parentId: null,
    sort: 3,
    status: PERMISSION_STATUS.ENABLED,
    remark: "菜单管理菜单权限",
    createdAt: "2026-03-03 11:00:00",
  },
  {
    id: 10,
    name: "查看菜单",
    code: "sys:menu:view",
    type: 2,
    parentId: 9,
    sort: 1,
    status: PERMISSION_STATUS.ENABLED,
    remark: "查看菜单列表",
    createdAt: "2026-03-03 11:10:00",
  },
  {
    id: 11,
    name: "创建菜单",
    code: "sys:menu:create",
    type: 2,
    parentId: 9,
    sort: 2,
    status: PERMISSION_STATUS.ENABLED,
    remark: "创建新菜单",
    createdAt: "2026-03-03 11:20:00",
  },
  {
    id: 12,
    name: "权限管理",
    code: "sys:permission",
    type: 1,
    parentId: null,
    sort: 4,
    status: PERMISSION_STATUS.ENABLED,
    remark: "权限管理菜单权限",
    createdAt: "2026-03-04 12:00:00",
  },
  {
    id: 13,
    name: "查看权限",
    code: "sys:permission:view",
    type: 2,
    parentId: 12,
    sort: 1,
    status: PERMISSION_STATUS.ENABLED,
    remark: "查看权限列表",
    createdAt: "2026-03-04 12:10:00",
  },
  {
    id: 14,
    name: "字典管理",
    code: "sys:dictionary",
    type: 1,
    parentId: null,
    sort: 5,
    status: PERMISSION_STATUS.DISABLED,
    remark: "字典管理菜单权限（已停用）",
    createdAt: "2026-03-05 13:00:00",
  },
];

let mockPermissions = initialPermissions.map((item) => ({ ...item }));
let nextPermissionId = Math.max(...initialPermissions.map((item) => item.id)) + 1;

const success = <T>(data: T, message = "success"): ApiResponse<T> => ({
  code: 0,
  data,
  message,
});

const fail = (code: number, message: string, data: unknown = null): ApiResponse<unknown> => ({
  code,
  data,
  message,
});

const sendJson = (res: ServerResponse, status: number, payload: ApiResponse<unknown>): void => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const ensureAuthorized = (req: Parameters<NonNullable<MockMethod["rawResponse"]>>[0]) => {
  const result = resolveProfileFromAccessToken(resolveRequestToken(req));
  if ("error" in result) {
    return fail(result.error.code, result.error.message);
  }

  return null;
};

const parseUrl = (url = "") => new URL(url, "http://localhost");

const getPermissionIdFromRequest = (
  req: Parameters<NonNullable<MockMethod["rawResponse"]>>[0],
  fallbackId?: number,
) => {
  const searchId = Number(parseUrl(req.url).searchParams.get("id") || 0);
  const value = fallbackId ?? searchId;
  return Number.isFinite(value) ? value : 0;
};

const serializePermission = (permission: MockPermissionRecord) => ({
  id: permission.id,
  name: permission.name,
  code: permission.code,
  type: permission.type,
  parentId: permission.parentId,
  sort: permission.sort,
  status: permission.status,
  remark: permission.remark,
  createdAt: permission.createdAt,
});

const listPermissions = (query: PermissionListQuery) => {
  const name = query.name?.trim().toLowerCase() || "";
  const code = removeAllSpace(query.code?.trim() || "").toLowerCase();
  const status = query.status;

  const filtered = mockPermissions
    .filter((item) => {
      const matchName = !name || item.name.toLowerCase().includes(name);
      const matchCode = !code || item.code.toLowerCase().includes(code);
      const matchStatus =
        status === undefined || status === null || status === "" || Number(status) === item.status;
      return matchName && matchCode && matchStatus;
    })
    .sort((a, b) => a.sort - b.sort || a.id - b.id);

  const total = filtered.length;
  const pageSize = total || 10;
  return {
    pageNo: 0,
    pageSize,
    total,
    records: filtered.map(serializePermission),
  };
};

const mocks: MockMethod[] = [
  {
    url: "/api/management/permissions/list",
    method: "post",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 200, authError);
        return;
      }

      const query = (await this.parseJson()) as PermissionListQuery;
      sendJson(res, 200, success(listPermissions(query)));
    },
  },
  {
    url: "/api/management/permissions",
    method: "post",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 200, authError);
        return;
      }

      const body = (await this.parseJson()) as CreatePermissionPayload;
      const name = body.name?.trim();
      const code = removeAllSpace(body.code?.trim() || "").toLowerCase();

      if (!name || !code) {
        sendJson(res, 200, fail(40001, "请求参数不完整"));
        return;
      }

      if (mockPermissions.some((item) => item.name === name)) {
        sendJson(res, 200, fail(40002, "权限名称已存在"));
        return;
      }

      if (mockPermissions.some((item) => item.code === code)) {
        sendJson(res, 200, fail(40003, "权限编码已存在"));
        return;
      }

      mockPermissions = [
        {
          id: nextPermissionId++,
          name,
          code,
          type: Number(body.type ?? 2),
          parentId: body.parentId ?? null,
          sort: Number(body.sort ?? 0),
          status: body.status ?? PERMISSION_STATUS.ENABLED,
          remark: body.remark || "",
          createdAt: new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-"),
        },
        ...mockPermissions,
      ];

      sendJson(res, 200, success({ success: true }, "新增成功"));
    },
  },
  {
    url: "/api/management/permissions",
    method: "put",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 200, authError);
        return;
      }

      const body = (await this.parseJson()) as UpdatePermissionPayload;
      const permissionId = getPermissionIdFromRequest(req, body.id);
      const target = mockPermissions.find((item) => item.id === permissionId);
      const name = body.name?.trim();
      const code = removeAllSpace(body.code?.trim() || "").toLowerCase();

      if (!target) {
        sendJson(res, 200, fail(40401, "权限不存在"));
        return;
      }

      if (!name || !code) {
        sendJson(res, 200, fail(40001, "请求参数不完整"));
        return;
      }

      if (mockPermissions.some((item) => item.id !== permissionId && item.name === name)) {
        sendJson(res, 200, fail(40002, "权限名称已存在"));
        return;
      }

      if (mockPermissions.some((item) => item.id !== permissionId && item.code === code)) {
        sendJson(res, 200, fail(40003, "权限编码已存在"));
        return;
      }

      target.name = name;
      target.code = code;
      target.type = Number(body.type ?? target.type);
      target.parentId = body.parentId ?? target.parentId;
      target.sort = Number(body.sort ?? target.sort);
      target.status = body.status ?? target.status;
      target.remark = body.remark || "";

      sendJson(res, 200, success({ success: true }, "编辑成功"));
    },
  },
  {
    url: "/api/management/permissions",
    method: "delete",
    rawResponse(req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 200, authError);
        return;
      }

      const permissionId = getPermissionIdFromRequest(req);
      const target = mockPermissions.find((item) => item.id === permissionId);

      if (!target) {
        sendJson(res, 200, fail(40401, "权限不存在"));
        return;
      }

      mockPermissions = mockPermissions.filter((item) => item.id !== permissionId);
      sendJson(res, 200, success({ success: true }, "删除成功"));
    },
  },
  {
    url: "/api/management/permissions/batch-delete",
    method: "post",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 200, authError);
        return;
      }

      const body = (await this.parseJson()) as { ids?: number[] };
      const ids = Array.isArray(body.ids) ? body.ids : [];

      if (!ids.length) {
        sendJson(res, 200, fail(40001, "请选择要删除的权限"));
        return;
      }

      mockPermissions = mockPermissions.filter((item) => !ids.includes(item.id));
      sendJson(res, 200, success({ success: true }, "批量删除成功"));
    },
  },
];

export default mocks;
