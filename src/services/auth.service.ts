//services/auth.service.ts

import { api } from "../lib/api/client";
import type { ApiResponse } from "../types/api";
import type {
  User,
  RegisterPayload,
  LoginPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types/auth";

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<ApiResponse<User>>("/auth/register", payload);
  return data.data;
}

export async function login(payload: LoginPayload): Promise<User> {
  const { data } = await api.post<ApiResponse<User>>("/auth/login", payload);
  return data.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<ApiResponse<User>>("/auth/me");
  return data.data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await api.put<ApiResponse<User>>("/auth/me", payload);
  return data.data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await api.put("/auth/me/password", payload);
}
