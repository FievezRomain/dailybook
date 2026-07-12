import type axiosType from 'axios';
import type { AxiosError } from 'axios';
import { AppErrorCode } from '../types/AppErrorCode';
import type { ApiError } from '../types/ApiError';

type AxiosModule = typeof axiosType & { default?: typeof axiosType };
const axiosModule = require('axios') as AxiosModule;
const axios = axiosModule.default ?? axiosModule;

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
  [AppErrorCode.UNAUTHORIZED]: 'Votre session a expire. Reconnectez-vous.',
  [AppErrorCode.TOKEN_EXPIRED]: 'Votre session a expire. Reconnectez-vous.',
  [AppErrorCode.FORBIDDEN]: "Vous n'avez pas acces a cette ressource.",
  [AppErrorCode.NOT_FOUND]: 'Cette ressource est introuvable.',
  [AppErrorCode.CONFLICT]: 'Un conflit est survenu. Verifiez vos donnees.',
  [AppErrorCode.VALIDATION_ERROR]: 'Certains champs sont invalides. Verifiez votre saisie.',
  [AppErrorCode.QUOTA_EXCEEDED]: 'Vous avez atteint la limite du plan gratuit. Voir les offres.',
  [AppErrorCode.FEATURE_UNAVAILABLE]: "Cette fonctionnalite n'est pas disponible sur votre plan.",
  [AppErrorCode.INTERNAL_ERROR]: 'Une erreur est survenue. Reessayez dans un instant.',
  [AppErrorCode.NETWORK_ERROR]: 'Impossible de rejoindre le serveur. Reessayez dans un instant.',
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

    const details = Array.isArray(body?.error?.details) ? body.error.details : [];

    return {
      code: apiCode,
      message: getSafeUserMessage(apiCode, body?.error?.message),
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

function getSafeUserMessage(code: AppErrorCode, apiMessage?: string): string {
  if (!apiMessage || code === AppErrorCode.INTERNAL_ERROR) {
    return MESSAGES[code];
  }

  return apiMessage;
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
