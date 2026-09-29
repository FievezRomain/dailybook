export type ApiMeta = {
  api_version: string;
  timestamp: string;
  count: number | null;
};

export type ApiResponse<T> = {
  success: true;
  data: T;
  meta: ApiMeta;
};

export type { ApiErrorResponse } from '../types/ApiError';
