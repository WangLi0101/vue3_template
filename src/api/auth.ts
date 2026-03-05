import { request } from "@/api/request";
import type {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
} from "@/types/auth";

export const loginApi = (payload: LoginPayload): Promise<LoginResponse> => {
  return request<LoginResponse, LoginPayload>("/auth/login", "MOCK", {
    method: "post",
    data: payload,
  });
};

export const getProfileApi = (): Promise<ProfileResponse> => {
  return request<ProfileResponse>("/auth/me", "MOCK", {
    method: "get",
  });
};
