import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6767";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Avoid redirecting on public share pages or when already on an auth page
      // (prevents a reload loop, e.g. auth pages checking /auth/me while logged out)
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        const isPublicShare = pathname.startsWith("/share/");
        const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(pathname);
        if (!isPublicShare && !isAuthPage) {
          window.location.href = "/login";
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
