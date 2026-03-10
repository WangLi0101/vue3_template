import type { ServerResponse } from "node:http";
import type { MockMethod } from "vite-plugin-mock";
import type { ApiResponse } from "../src/types/http";
import { cloneMenus, mockProfiles } from "./data/rbac-data";

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

const mocks: MockMethod[] = [
  {
    url: "/api/auth/login",
    method: "post",
    rawResponse: async function (_req, res) {
      const body = (await this.parseJson()) as { username?: string; password?: string };
      const username = body?.username?.trim();
      const password = body?.password?.trim();

      if (!username || !password) {
        sendJson(res, 400, fail(40001, "请求参数错误"));
        return;
      }

      const profile = mockProfiles[username];
      if (!profile || profile.password !== password) {
        sendJson(res, 200, fail(10001, "用户名或密码错误"));
        return;
      }

      sendJson(
        res,
        200,
        success({
          accessToken: `token-${username}`,
        }),
      );
    },
  },
  {
    url: "/api/auth/me",
    method: "get",
    rawResponse: function (req, res) {
      const authHeader = req.headers.authorization;
      const bearerToken = Array.isArray(authHeader) ? authHeader[0] || "" : authHeader || "";
      const token = bearerToken.replace(/^Bearer\s+/i, "");

      if (!token) {
        sendJson(res, 401, fail(40101, "缺少访问令牌"));
        return;
      }

      const username = token.replace("token-", "");
      const profile = mockProfiles[username];
      if (!profile) {
        sendJson(res, 401, fail(40102, "登录已过期，请重新登录"));
        return;
      }

      sendJson(
        res,
        200,
        success({
          user: profile.user,
          roles: [...profile.roles],
          permissions: [...profile.permissions],
          menus: cloneMenus(profile.menus),
        }),
      );
    },
  },
];

export default mocks;
