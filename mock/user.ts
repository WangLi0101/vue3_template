import type { ServerResponse } from "node:http";
import type { MockMethod } from "vite-plugin-mock";
import type { ApiResponse } from "../src/types/http";
import { mockProfiles } from "./data/rbac-data";

interface MockUserRecord {
  id: number;
  username: string;
  nickname: string;
  password: string;
  phone: string;
  email: string;
  roleIds: number[];
  status: 0 | 1;
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

interface CreateUserPayload {
  username?: string;
  nickname?: string;
  password?: string;
  phone?: string;
  email?: string;
  roleIds?: number[];
  status?: 0 | 1;
  remark?: string;
}

interface UpdateUserPayload {
  id?: number;
  nickname?: string;
  phone?: string;
  email?: string;
  roleIds?: number[];
  status?: 0 | 1;
  remark?: string;
}

const roleOptions: Array<{ label: string; value: number; code: string }> = [
  { label: "超级管理员", value: 1, code: "super_admin" },
  { label: "审计员", value: 2, code: "auditor" },
  { label: "运营专员", value: 3, code: "operator" },
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
    status: 1,
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
    status: 1,
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
    status: 0,
    remark: "负责日常运营配置",
    createdAt: "2026-03-05 14:20:00",
  },
];

let mockUsers = initialUsers.map((item) => ({ ...item }));
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

const resolveRoleNames = (roleIds: number[]) =>
  roleIds
    .map((roleId) => roleOptions.find((item) => item.value === roleId)?.label)
    .filter((item): item is string => Boolean(item));

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

const listUsers = (query: UserListQuery) => {
  const pageNum = Math.max(Number(query.pageNum || 1), 1);
  const pageSize = Math.max(Number(query.pageSize || 10), 1);
  const username = query.username?.trim().toLowerCase() || "";
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

      sendJson(res, 200, success([...roleOptions]));
    },
  },
  {
    url: "/api/system/users",
    method: "get",
    rawResponse(req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 401, authError);
        return;
      }

      const query = Object.fromEntries(parseUrl(req.url).searchParams.entries()) as UserListQuery;
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
      const username = body.username?.trim();
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
          phone: body.phone?.trim() || "",
          email: body.email?.trim() || "",
          roleIds,
          status: body.status ?? 1,
          remark: body.remark?.trim() || "",
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
      target.phone = body.phone?.trim() || "";
      target.email = body.email?.trim() || "";
      target.roleIds = body.roleIds;
      target.status = body.status ?? target.status;
      target.remark = body.remark?.trim() || "";

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
