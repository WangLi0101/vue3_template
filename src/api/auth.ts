import { request } from "@/api/request";
import type {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
} from "@/types/auth";

export const loginApi = (payload: LoginPayload): Promise<LoginResponse> => {
  return request.post<LoginResponse>("/auth/login", payload);
};

export const getProfileApi = (): Promise<ProfileResponse> => {
  return request.get<ProfileResponse>("/auth/me");
};
