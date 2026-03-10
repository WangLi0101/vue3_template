const ACCESS_TOKEN_KEY = "rbac_access_token";

export const getToken = (): string => localStorage.getItem(ACCESS_TOKEN_KEY) || "";

export const setToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};
