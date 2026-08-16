import axios, { AxiosError } from "axios";

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6767";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

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
      const reqUrl = error.config?.url || "";
      const isAuthEndpoint = 
        reqUrl.includes("/auth/logout") ||
        reqUrl.includes("/auth/me") ||
        reqUrl.includes("/auth/login");
        
      if (typeof window !== "undefined" && !isAuthEndpoint) {
        const pathname = window.location.pathname;
        const normalizedPath = pathname.endsWith('/') && pathname.length > 1 
          ? pathname.slice(0, -1) 
          : pathname;
          
        const isPublicShare = normalizedPath.startsWith("/share/");
        const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(normalizedPath);
        
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
