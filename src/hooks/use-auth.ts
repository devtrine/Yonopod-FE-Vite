"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authService from "../services/auth.service";
import type {
  RegisterPayload,
  LoginPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types/auth";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useCurrentUser(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    retry: false,
    ...options,
  });
}

export function useUserStats(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["auth", "stats"],
    queryFn: authService.getStats,
    ...options,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onMutate: async () => {
      // Cancel active/background queries immediately to prevent race conditions
      await queryClient.cancelQueries();
    },
    onSettled: async () => {
      // Cancel any ongoing queries
      await queryClient.cancelQueries();

      // Clear React Query cache & set current user to null
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.removeQueries({ queryKey: ["auth"] });
      queryClient.clear();

      // Clear any stored local tokens/flags if present
      if (typeof window !== "undefined") {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {
          // Ignore localStorage errors
        }
        window.location.replace("/login");
      }
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => authService.updateProfile(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authService.changePassword(payload),
  });
}
