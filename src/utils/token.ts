const ACCESS_TOKEN_KEY = "rbac_access_token";
const REFRESH_TOKEN_KEY = "rbac_refresh_token";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const getAccessToken = (): string => localStorage.getItem(ACCESS_TOKEN_KEY) || "";

export const getRefreshToken = (): string => localStorage.getItem(REFRESH_TOKEN_KEY) || "";

export const getAuthTokens = (): AuthTokens => ({
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
});

export const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const setAuthTokens = (tokens: AuthTokens): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const clearAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const clearRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const formatToken = (token: string): string => {
  return `Bearer ${token}`;
};

export const getToken = getAccessToken;
export const setToken = setAccessToken;
export const clearToken = clearAuthTokens;
