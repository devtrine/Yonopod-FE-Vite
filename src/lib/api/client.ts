import axios, { AxiosError } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6767";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
  },
});

/** List of endpoints that should NEVER trigger auto-redirect to /login on 401 */
const AUTH_EXCLUDED_ENDPOINTS = [
  "/auth/logout",
  "/auth/me",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh",
];

// Flag to prevent multiple simultaneous redirects (race conditions)
let isRedirecting = false;

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const reqUrl = error.config?.url || "";
      const shouldSkipRedirect = 
        Boolean(error.config?.skipAuthRedirect) ||
        AUTH_EXCLUDED_ENDPOINTS.some((endpoint) => reqUrl.includes(endpoint));

      if (typeof window !== "undefined" && !shouldSkipRedirect && !isRedirecting) {
        const pathname = window.location.pathname;
        const normalizedPath =
          pathname.endsWith("/") && pathname.length > 1
            ? pathname.slice(0, -1)
            : pathname;

        const isPublicShare = normalizedPath.startsWith("/share/");
        const isAuthPage = [
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
        ].includes(normalizedPath);

        if (!isPublicShare && !isAuthPage) {
          isRedirecting = true;
          try {
            localStorage.clear();
            sessionStorage.clear();
          } catch {
            // Ignore storage errors
          }
          window.location.replace("/login");
          setTimeout(() => {
            isRedirecting = false;
          }, 3000);
        }
      }
    }
    return Promise.reject(error);
  }
);

export type ApiError = AxiosError<{
  success: false;
  message: string;
  errors?: unknown;
}>;

/** Extract a readable error message from an Axios error */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return "Too many requests. Please wait a moment before trying again.";
    }
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

