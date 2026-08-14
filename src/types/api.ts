/** Standard success response wrapper from the backend */
export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
}

/** Paginated response wrapper from the backend */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Standard error response wrapper from the backend */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}
