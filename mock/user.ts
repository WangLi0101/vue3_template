import type { ServerResponse } from "node:http";
import type { MockMethod } from "vite-plugin-mock";
import { ROLE_STATUS, type RoleStatus } from "../src/api/system/role/constants";
import { USER_STATUS, type UserStatus } from "../src/api/system/user/constants";
import type { ApiResponse } from "../src/types/http";
import { removeAllSpace } from "../src/utils/tool";
import { mockProfiles } from "./data/rbac-data";

interface MockUserRecord {
  id: number;
  username: string;
  nickname: string;
  password: string;
  phone: string;
  email: string;
  roleIds: number[];
  status: UserStatus;
  remark: string;
  createdAt: string;
}

interface MockRoleRecord {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: RoleStatus;
  remark: string;
  createdAt: string;
}

interface UserListQuery {
  pageNum?: string;
  pageSize?: string;
  username?: string;
  nickname?: string;
  status?: string;
  roleId?: string;
}

interface RoleListQuery {
  name?: string;
  code?: string;
  status?: string;
}

interface CreateUserPayload {
  username?: string;
  nickname?: string;
  password?: string;
  phone?: string;
  email?: string;
  roleIds?: number[];
  status?: UserStatus;
  remark?: string;
}

interface UpdateUserPayload extends Omit<CreateUserPayload, "username" | "password"> {
  id?: number;
}

interface CreateRolePayload {
  name?: string;
  code?: string;
  sort?: number;
  status?: RoleStatus;
  remark?: string;
}

interface UpdateRolePayload extends CreateRolePayload {
  id?: number;
}

const initialRoles: MockRoleRecord[] = [
  {
    id: 1,
    name: "超级管理员",
    code: "super_admin",
    sort: 1,
    status: ROLE_STATUS.ENABLED,
    remark: "拥有全部系统权限",
    createdAt: "2026-03-01 09:00:00",
  },
  {
    id: 2,
    name: "审计员",
    code: "auditor",
    sort: 2,
    status: ROLE_STATUS.ENABLED,
    remark: "负责审计与查询",
    createdAt: "2026-03-03 10:30:00",
  },
  {
    id: 3,
    name: "运营专员",
    code: "operator",
    sort: 3,
    status: ROLE_STATUS.DISABLED,
    remark: "负责日常运营配置",
    createdAt: "2026-03-05 14:20:00",
  },
];

const initialUsers: MockUserRecord[] = [
  {
    id: 1,
    username: "admin",
    nickname: "系统管理员",
    password: "admin123",
    phone: "13800138000",
    email: "admin@example.com",
    roleIds: [1],
    status: USER_STATUS.ENABLED,
    remark: "拥有全部系统权限",
    createdAt: "2026-03-01 09:00:00",
  },
  {
    id: 2,
    username: "auditor",
    nickname: "审计员",
    password: "auditor123",
    phone: "13800138001",
    email: "auditor@example.com",
    roleIds: [2],
    status: USER_STATUS.ENABLED,
    remark: "负责审计与查询",
    createdAt: "2026-03-03 10:30:00",
  },
  {
    id: 3,
    username: "operator",
    nickname: "运营专员",
    password: "operator123",
    phone: "13800138002",
    email: "operator@example.com",
    roleIds: [3],
    status: USER_STATUS.DISABLED,
    remark: "负责日常运营配置",
    createdAt: "2026-03-05 14:20:00",
  },
];

let mockRoles = initialRoles.map((item) => ({ ...item }));
let mockUsers = initialUsers.map((item) => ({ ...item }));
let nextRoleId = Math.max(...initialRoles.map((item) => item.id)) + 1;
let nextUserId = Math.max(...initialUsers.map((item) => item.id)) + 1;

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
  const authHeader = req.headers.authorization;
  const bearerToken = Array.isArray(authHeader) ? authHeader[0] || "" : authHeader || "";
  const token = bearerToken.replace(/^Bearer\s+/i, "");

  if (!token) {
    return fail(40101, "缺少访问令牌");
  }

  const username = token.replace("token-", "");
  if (!mockProfiles[username]) {
    return fail(40102, "登录已过期，请重新登录");
  }

  return null;
};

const parseUrl = (url = "") => new URL(url, "http://localhost");

const serializeRoleOption = (role: MockRoleRecord) => ({
  label: role.name,
  value: role.id,
  code: role.code,
});

const resolveRoleNames = (roleIds: number[]) =>
  roleIds
    .map((roleId) => mockRoles.find((item) => item.id === roleId)?.name)
    .filter((item): item is string => Boolean(item));

const countUsersByRoleId = (roleId: number) =>
  mockUsers.filter((item) => item.roleIds.includes(roleId)).length;

const serializeRole = (role: MockRoleRecord) => ({
  id: role.id,
  name: role.name,
  code: role.code,
  sort: role.sort,
  status: role.status,
  remark: role.remark,
  createdAt: role.createdAt,
  userCount: countUsersByRoleId(role.id),
});

const serializeUser = (user: MockUserRecord) => ({
  id: user.id,
  username: user.username,
  nickname: user.nickname,
  phone: user.phone,
  email: user.email,
  roleIds: [...user.roleIds],
  roleNames: resolveRoleNames(user.roleIds),
  status: user.status,
  remark: user.remark,
  createdAt: user.createdAt,
});

const getUserIdFromRequest = (
  req: Parameters<NonNullable<MockMethod["rawResponse"]>>[0],
  fallbackId?: number,
) => {
  const searchId = Number(parseUrl(req.url).searchParams.get("id") || 0);
  const value = fallbackId ?? searchId;
  return Number.isFinite(value) ? value : 0;
};

const getRoleIdFromRequest = (
  req: Parameters<NonNullable<MockMethod["rawResponse"]>>[0],
  fallbackId?: number,
) => {
  const searchId = Number(parseUrl(req.url).searchParams.get("id") || 0);
  const value = fallbackId ?? searchId;
  return Number.isFinite(value) ? value : 0;
};

const listUsers = (query: UserListQuery) => {
  const pageNum = Math.max(Number(query.pageNum || 1), 1);
  const pageSize = Math.max(Number(query.pageSize || 10), 1);
  const username = removeAllSpace(query.username?.trim() || "").toLowerCase();
  const nickname = query.nickname?.trim().toLowerCase() || "";
  const status = query.status;
  const roleId = Number(query.roleId || 0);

  const filtered = mockUsers.filter((item) => {
    const matchUsername = !username || item.username.toLowerCase().includes(username);
    const matchNickname = !nickname || item.nickname.toLowerCase().includes(nickname);
    const matchStatus = status === undefined || status === "" || Number(status) === item.status;
    const matchRole = !roleId || item.roleIds.includes(roleId);
    return matchUsername && matchNickname && matchStatus && matchRole;
  });

  const start = (pageNum - 1) * pageSize;
  return {
    list: filtered.slice(start, start + pageSize).map(serializeUser),
    total: filtered.length,
  };
};

const listRoles = (query: RoleListQuery) => {
  const name = query.name?.trim().toLowerCase() || "";
  const code = removeAllSpace(query.code?.trim() || "").toLowerCase();
  const status = query.status;

  const filtered = mockRoles
    .filter((item) => {
      const matchName = !name || item.name.toLowerCase().includes(name);
      const matchCode = !code || item.code.toLowerCase().includes(code);
      const matchStatus = status === undefined || status === "" || Number(status) === item.status;
      return matchName && matchCode && matchStatus;
    })
    .sort((a, b) => a.sort - b.sort || a.id - b.id);

  return {
    list: filtered.map(serializeRole),
    total: filtered.length,
  };
};

const mocks: MockMethod[] = [
  {
    url: "/api/system/roles/options",
    method: "get",
    rawResponse(req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      sendJson(
        res,
        200,
        success(
          mockRoles
            .slice()
            .sort((a, b) => a.sort - b.sort || a.id - b.id)
            .map(serializeRoleOption),
        ),
      );
    },
  },
  {
    url: "/api/system/roles/list",
    method: "post",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      const query = (await this.parseJson()) as RoleListQuery;
      sendJson(res, 200, success(listRoles(query)));
    },
  },
  {
    url: "/api/system/roles",
    method: "post",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      const body = (await this.parseJson()) as CreateRolePayload;
      const name = body.name?.trim();
      const code = removeAllSpace(body.code?.trim() || "").toLowerCase();

      if (!name || !code) {
        sendJson(res, 200, fail(40001, "请求参数不完整"));
        return;
      }

      if (mockRoles.some((item) => item.name === name)) {
        sendJson(res, 200, fail(40002, "角色名称已存在"));
        return;
      }

      if (mockRoles.some((item) => item.code === code)) {
        sendJson(res, 200, fail(40003, "角色编码已存在"));
        return;
      }

      mockRoles = [
        {
          id: nextRoleId++,
          name,
          code,
          sort: Number(body.sort ?? 0),
          status: body.status ?? ROLE_STATUS.ENABLED,
          remark: body.remark || "",
          createdAt: new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-"),
        },
        ...mockRoles,
      ];

      sendJson(res, 200, success({ success: true }, "新增成功"));
    },
  },
  {
    url: "/api/system/roles",
    method: "put",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      const body = (await this.parseJson()) as UpdateRolePayload;
      const roleId = getRoleIdFromRequest(req, body.id);
      const target = mockRoles.find((item) => item.id === roleId);
      const name = body.name?.trim();
      const code = removeAllSpace(body.code?.trim() || "").toLowerCase();

      if (!target) {
        sendJson(res, 200, fail(40401, "角色不存在"));
        return;
      }

      if (!name || !code) {
        sendJson(res, 200, fail(40001, "请求参数不完整"));
        return;
      }

      if (mockRoles.some((item) => item.id !== roleId && item.name === name)) {
        sendJson(res, 200, fail(40002, "角色名称已存在"));
        return;
      }

      if (mockRoles.some((item) => item.id !== roleId && item.code === code)) {
        sendJson(res, 200, fail(40003, "角色编码已存在"));
        return;
      }

      target.name = name;
      target.code = code;
      target.sort = Number(body.sort ?? target.sort);
      target.status = body.status ?? target.status;
      target.remark = body.remark || "";

      sendJson(res, 200, success({ success: true }, "编辑成功"));
    },
  },
  {
    url: "/api/system/roles",
    method: "delete",
    rawResponse(req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      const roleId = getRoleIdFromRequest(req);
      const target = mockRoles.find((item) => item.id === roleId);

      if (!target) {
        sendJson(res, 200, fail(40401, "角色不存在"));
        return;
      }

      if (countUsersByRoleId(roleId) > 0) {
        sendJson(res, 200, fail(40004, "角色已关联用户，无法删除"));
        return;
      }

      mockRoles = mockRoles.filter((item) => item.id !== roleId);
      sendJson(res, 200, success({ success: true }, "删除成功"));
    },
  },
  {
    url: "/api/system/roles/batch-delete",
    method: "post",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      const body = (await this.parseJson()) as { ids?: number[] };
      const ids = Array.isArray(body.ids) ? body.ids : [];

      if (!ids.length) {
        sendJson(res, 200, fail(40001, "请选择要删除的角色"));
        return;
      }

      const blockedRoles = mockRoles
        .filter((item) => ids.includes(item.id) && countUsersByRoleId(item.id) > 0)
        .map((item) => item.name);

      if (blockedRoles.length) {
        sendJson(res, 200, fail(40004, `角色「${blockedRoles.join("、")}」已关联用户，无法删除`));
        return;
      }

      mockRoles = mockRoles.filter((item) => !ids.includes(item.id));
      sendJson(res, 200, success({ success: true }, "批量删除成功"));
    },
  },
  {
    url: "/api/system/users/list",
    method: "post",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      const query = (await this.parseJson()) as UserListQuery;
      sendJson(res, 200, success(listUsers(query)));
    },
  },
  {
    url: "/api/system/users",
    method: "post",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      const body = (await this.parseJson()) as CreateUserPayload;
      const username = removeAllSpace(body.username?.trim() || "");
      const nickname = body.nickname?.trim();
      const password = body.password?.trim();
      const roleIds = Array.isArray(body.roleIds) ? body.roleIds : [];

      if (!username || !nickname || !password || !roleIds.length) {
        sendJson(res, 200, fail(40001, "请求参数不完整"));
        return;
      }

      if (mockUsers.some((item) => item.username === username)) {
        sendJson(res, 200, fail(40002, "用户名已存在"));
        return;
      }

      mockUsers = [
        {
          id: nextUserId++,
          username,
          nickname,
          password,
          phone: removeAllSpace(body.phone?.trim() || ""),
          email: removeAllSpace(body.email?.trim() || ""),
          roleIds,
          status: body.status ?? USER_STATUS.ENABLED,
          remark: body.remark || "",
          createdAt: new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-"),
        },
        ...mockUsers,
      ];

      sendJson(res, 200, success({ success: true }, "新增成功"));
    },
  },
  {
    url: "/api/system/users",
    method: "put",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      const body = (await this.parseJson()) as UpdateUserPayload;
      const userId = getUserIdFromRequest(req, body.id);
      const target = mockUsers.find((item) => item.id === userId);

      if (!target) {
        sendJson(res, 200, fail(40401, "用户不存在"));
        return;
      }

      if (!body.nickname?.trim() || !Array.isArray(body.roleIds) || !body.roleIds.length) {
        sendJson(res, 200, fail(40001, "请求参数不完整"));
        return;
      }

      target.nickname = body.nickname.trim();
      target.phone = removeAllSpace(body.phone?.trim() || "");
      target.email = removeAllSpace(body.email?.trim() || "");
      target.roleIds = body.roleIds;
      target.status = body.status ?? target.status;
      target.remark = body.remark || "";

      sendJson(res, 200, success({ success: true }, "编辑成功"));
    },
  },
  {
    url: "/api/system/users",
    method: "delete",
    rawResponse(req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      const userId = getUserIdFromRequest(req);
      if (!mockUsers.some((item) => item.id === userId)) {
        sendJson(res, 200, fail(40401, "用户不存在"));
        return;
      }

      mockUsers = mockUsers.filter((item) => item.id !== userId);
      sendJson(res, 200, success({ success: true }, "删除成功"));
    },
  },
  {
    url: "/api/system/users/batch-delete",
    method: "post",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      const body = (await this.parseJson()) as { ids?: number[] };
      const ids = Array.isArray(body.ids) ? body.ids : [];

      if (!ids.length) {
        sendJson(res, 200, fail(40001, "请选择要删除的用户"));
        return;
      }

      mockUsers = mockUsers.filter((item) => !ids.includes(item.id));
      sendJson(res, 200, success({ success: true }, "批量删除成功"));
    },
  },
];

export default mocks;
