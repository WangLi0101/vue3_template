import { request } from "@/utils/http";
import type {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
} from "@/api/auth/types";

export const loginApi = (payload: LoginPayload) => {
  return request<LoginResponse>("/auth/login", "MOCK", {
    method: "post",
    data: payload,
  });
};

export const getProfileApi = () => {
  return request<ProfileResponse>("/auth/me", "MOCK", {
    method: "get",
  });
};
