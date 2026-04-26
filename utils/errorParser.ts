import axios, { type AxiosError } from 'axios';
import { AppErrorCode } from '../types/AppErrorCode';
import type { ApiError } from '../types/ApiError';

export interface ParsedError {
  code: AppErrorCode;
  message: string;
  details: { field: string; message: string }[];
  isNetworkError: boolean;
  isAuthError: boolean;
  isQuotaError: boolean;
  isValidationError: boolean;
}

type ApiErrorBody = { success: false; error: ApiError };

const MESSAGES: Record<AppErrorCode, string> = {
  [AppErrorCode.UNAUTHORIZED]: 'Votre session a expiré. Reconnectez-vous.',
  [AppErrorCode.TOKEN_EXPIRED]: 'Votre session a expiré. Reconnectez-vous.',
  [AppErrorCode.FORBIDDEN]: "Vous n'avez pas accès à cette ressource.",
  [AppErrorCode.NOT_FOUND]: "Cette ressource est introuvable.",
  [AppErrorCode.CONFLICT]: "Un conflit est survenu. Vérifiez vos données.",
  [AppErrorCode.VALIDATION_ERROR]: 'Certains champs sont invalides. Vérifiez votre saisie.',
  [AppErrorCode.QUOTA_EXCEEDED]: 'Vous avez atteint la limite du plan gratuit. Voir les offres →',
  [AppErrorCode.FEATURE_UNAVAILABLE]: "Cette fonctionnalité n'est pas disponible sur votre plan.",
  [AppErrorCode.INTERNAL_ERROR]: "Quelque chose ne s'est pas passé comme prévu 🐴",
  [AppErrorCode.NETWORK_ERROR]: 'Impossible de rejoindre le serveur. On réessaie ?',
};

export function parseApiError(error: unknown): ParsedError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;

    if (!axiosError.response) {
      return {
        code: AppErrorCode.NETWORK_ERROR,
        message: MESSAGES[AppErrorCode.NETWORK_ERROR],
        details: [],
        isNetworkError: true,
        isAuthError: false,
        isQuotaError: false,
        isValidationError: false,
      };
    }

    const body = axiosError.response.data;
    const apiCode =
      body?.error?.code && Object.values(AppErrorCode).includes(body.error.code as AppErrorCode)
        ? (body.error.code as AppErrorCode)
        : statusToCode(axiosError.response.status);

    const details = body?.error?.details ?? [];

    return {
      code: apiCode,
      message: body?.error?.message || MESSAGES[apiCode],
      details,
      isNetworkError: false,
      isAuthError: apiCode === AppErrorCode.UNAUTHORIZED || apiCode === AppErrorCode.TOKEN_EXPIRED,
      isQuotaError: apiCode === AppErrorCode.QUOTA_EXCEEDED,
      isValidationError: apiCode === AppErrorCode.VALIDATION_ERROR,
    };
  }

  return {
    code: AppErrorCode.INTERNAL_ERROR,
    message: MESSAGES[AppErrorCode.INTERNAL_ERROR],
    details: [],
    isNetworkError: false,
    isAuthError: false,
    isQuotaError: false,
    isValidationError: false,
  };
}

function statusToCode(status: number): AppErrorCode {
  switch (status) {
    case 401:
      return AppErrorCode.UNAUTHORIZED;
    case 403:
      return AppErrorCode.FORBIDDEN;
    case 404:
      return AppErrorCode.NOT_FOUND;
    case 409:
      return AppErrorCode.CONFLICT;
    case 422:
      return AppErrorCode.VALIDATION_ERROR;
    case 429:
      return AppErrorCode.QUOTA_EXCEEDED;
    default:
      return AppErrorCode.INTERNAL_ERROR;
  }
}
