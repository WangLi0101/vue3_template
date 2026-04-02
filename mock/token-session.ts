import type { MockMethod } from "vite-plugin-mock";
import { mockProfiles } from "./data/rbac-data";

const ACCESS_TOKEN_PREFIX = "access-token-";
const REFRESH_TOKEN_PREFIX = "refresh-token-";

export const ACCESS_TOKEN_EXPIRES_IN_MS = 5_000;
export const REFRESH_TOKEN_EXPIRES_IN_MS = 30 * 60 * 1000;

type TokenType = "access" | "refresh";

interface StoredToken {
  username: string;
  type: TokenType;
  expiresAt: number;
}

interface TokenError {
  code: number;
  message: string;
}

const MOCK_TOKEN_STORE_KEY = "__RBAC_MOCK_TOKEN_STORE__";

const globalTokenStore = globalThis as typeof globalThis & {
  [MOCK_TOKEN_STORE_KEY]?: Map<string, StoredToken>;
};

const tokenStore =
  globalTokenStore[MOCK_TOKEN_STORE_KEY] ??
  (globalTokenStore[MOCK_TOKEN_STORE_KEY] = new Map<string, StoredToken>());

const createTokenValue = (prefix: string, username: string): string => {
  const nonce = Math.random().toString(36).slice(2, 10);
  return `${prefix}${username}-${Date.now()}-${nonce}`;
};

const saveToken = (token: string, username: string, type: TokenType, ttl: number): void => {
  tokenStore.set(token, {
    username,
    type,
    expiresAt: Date.now() + ttl,
  });
};

const consumeExpiredToken = (token: string): void => {
  tokenStore.delete(token);
};

const getTokenError = (type: TokenType, missing = false): TokenError => {
  if (missing) {
    return {
      code: 40101,
      message: type === "access" ? "缺少访问令牌" : "缺少刷新令牌",
    };
  }

  return {
    code: 401105,
    message: "登录已过期，请重新登录",
  };
};

const validateToken = (
  token: string,
  type: TokenType,
): { username: string } | { error: TokenError } => {
  if (!token) {
    return {
      error: getTokenError(type, true),
    };
  }

  const record = tokenStore.get(token);
  if (!record || record.type !== type) {
    return {
      error: getTokenError(type),
    };
  }

  if (record.expiresAt <= Date.now()) {
    consumeExpiredToken(token);
    return {
      error: getTokenError(type),
    };
  }

  if (!mockProfiles[record.username]) {
    consumeExpiredToken(token);
    return {
      error: getTokenError(type),
    };
  }

  return {
    username: record.username,
  };
};

export const issueTokenPair = (username: string) => {
  const accessToken = createTokenValue(ACCESS_TOKEN_PREFIX, username);
  const refreshToken = createTokenValue(REFRESH_TOKEN_PREFIX, username);

  saveToken(accessToken, username, "access", ACCESS_TOKEN_EXPIRES_IN_MS);
  saveToken(refreshToken, username, "refresh", REFRESH_TOKEN_EXPIRES_IN_MS);

  return {
    accessToken,
    refreshToken,
  };
};

export const rotateTokenPair = (
  refreshToken: string,
): { tokens: ReturnType<typeof issueTokenPair> } | { error: TokenError } => {
  const validation = validateToken(refreshToken, "refresh");
  if ("error" in validation) {
    return validation;
  }

  tokenStore.delete(refreshToken);

  return {
    tokens: issueTokenPair(validation.username),
  };
};

export const resolveRequestToken = (req: Parameters<NonNullable<MockMethod["rawResponse"]>>[0]) => {
  const authHeader = req.headers.authorization;
  const bearerToken = Array.isArray(authHeader) ? authHeader[0] || "" : authHeader || "";
  return bearerToken.replace(/^Bearer\s+/i, "");
};

export const resolveProfileFromAccessToken = (
  accessToken: string,
): { profile: (typeof mockProfiles)[string] } | { error: TokenError } => {
  const validation = validateToken(accessToken, "access");
  if ("error" in validation) {
    return validation;
  }

  return {
    profile: mockProfiles[validation.username],
  };
};
