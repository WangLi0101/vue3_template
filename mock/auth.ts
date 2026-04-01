import type { ServerResponse } from "node:http";
import type { MockMethod } from "vite-plugin-mock";
import type { ApiResponse } from "../src/types/http";
import { removeAllSpace } from "../src/utils/tool";
import { cloneMenus, mockProfiles } from "./data/rbac-data";
import {
  ACCESS_TOKEN_EXPIRES_IN_MS,
  REFRESH_TOKEN_EXPIRES_IN_MS,
  issueTokenPair,
  resolveProfileFromAccessToken,
  resolveRequestToken,
  rotateTokenPair,
} from "./token-session";

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

const resolveProfileFromRequest = (req: Parameters<NonNullable<MockMethod["rawResponse"]>>[0]) => {
  const result = resolveProfileFromAccessToken(resolveRequestToken(req));
  if ("error" in result) {
    return {
      error: fail(result.error.code, result.error.message),
    };
  }

  return { profile: result.profile };
};

const mocks: MockMethod[] = [
  {
    url: "/api/auth/login",
    method: "post",
    rawResponse: async function (_req, res) {
      const body = (await this.parseJson()) as { username?: string; password?: string };
      const username = removeAllSpace(body?.username?.trim() || "");
      const password = body?.password?.trim();

      if (!username || !password) {
        sendJson(res, 200, fail(40001, "请求参数错误"));
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
        success(
          issueTokenPair(username),
          `登录成功，accessToken ${ACCESS_TOKEN_EXPIRES_IN_MS / 1000} 秒过期`,
        ),
      );
    },
  },
  {
    url: "/api/auth/refresh",
    method: "post",
    rawResponse: async function (_req, res) {
      const body = (await this.parseJson()) as { refreshToken?: string };
      const refreshToken = body?.refreshToken?.trim() || "";

      if (!refreshToken) {
        sendJson(res, 200, fail(40101, "缺少刷新令牌"));
        return;
      }

      const result = rotateTokenPair(refreshToken);
      if ("error" in result) {
        sendJson(res, 200, fail(result.error.code, result.error.message));
        return;
      }

      sendJson(
        res,
        200,
        success(
          result.tokens,
          `刷新成功，accessToken ${ACCESS_TOKEN_EXPIRES_IN_MS / 1000} 秒过期，refreshToken ${REFRESH_TOKEN_EXPIRES_IN_MS / 1000} 秒过期`,
        ),
      );
    },
  },
  {
    url: "/api/auth/me",
    method: "get",
    rawResponse: function (req, res) {
      const { error, profile } = resolveProfileFromRequest(req);
      if (error || !profile) {
        sendJson(res, 200, error || fail(40102, "登录已过期，请重新登录"));
        return;
      }

      sendJson(
        res,
        200,
        success({
          user: profile.user,
        }),
      );
    },
  },
  {
    url: "/api/auth/roles",
    method: "get",
    rawResponse: function (req, res) {
      const { error, profile } = resolveProfileFromRequest(req);
      if (error || !profile) {
        sendJson(res, 200, error || fail(40102, "登录已过期，请重新登录"));
        return;
      }

      sendJson(
        res,
        200,
        success({
          roles: [...profile.roles],
        }),
      );
    },
  },
  {
    url: "/api/auth/permissions",
    method: "get",
    rawResponse: function (req, res) {
      const { error, profile } = resolveProfileFromRequest(req);
      if (error || !profile) {
        sendJson(res, 200, error || fail(40102, "登录已过期，请重新登录"));
        return;
      }

      sendJson(
        res,
        200,
        success({
          permissions: [...profile.permissions],
        }),
      );
    },
  },
  {
    url: "/api/auth/menus",
    method: "get",
    rawResponse: function (req, res) {
      const { error, profile } = resolveProfileFromRequest(req);
      if (error || !profile) {
        sendJson(res, 200, error || fail(40102, "登录已过期，请重新登录"));
        return;
      }

      sendJson(
        res,
        200,
        success({
          menus: cloneMenus(profile.menus),
        }),
      );
    },
  },
];

export default mocks;
