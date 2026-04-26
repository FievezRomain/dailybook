import { AppErrorCode } from './AppErrorCode';

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  code: AppErrorCode;
  message: string;
  details: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  meta: {
    api_version: string;
    timestamp: string;
    count: null;
  };
}
