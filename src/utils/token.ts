const ACCESS_TOKEN_KEY = "rbac_access_token";
const REFRESH_TOKEN_KEY = "rbac_refresh_token";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const getAccessToken = (): string => sessionStorage.getItem(ACCESS_TOKEN_KEY) || "";

export const getRefreshToken = (): string => sessionStorage.getItem(REFRESH_TOKEN_KEY) || "";

export const getAuthTokens = (): AuthTokens => ({
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
});

export const setAccessToken = (token: string): void => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const setRefreshToken = (token: string): void => {
  sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const setAuthTokens = (tokens: AuthTokens): void => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const clearAccessToken = (): void => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const clearRefreshToken = (): void => {
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const clearAuthTokens = (): void => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const formatToken = (token: string): string => {
  return `Bearer ${token}`;
};
