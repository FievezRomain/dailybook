import axios from 'axios';
import { parseApiError } from './errorParser';
import { AppErrorCode } from '../types/AppErrorCode';

function makeAxiosError(status: number, body?: Record<string, unknown>) {
  return {
    isAxiosError: true,
    response: {
      status,
      data: body,
    },
  } as any;
}

function makeNetworkError() {
  return {
    isAxiosError: true,
    response: undefined,
  } as any;
}

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: (e: any) => e?.isAxiosError === true,
}));

describe('parseApiError', () => {
  describe('network error (no response)', () => {
    it('returns NETWORK_ERROR with correct flags', () => {
      const result = parseApiError(makeNetworkError());
      expect(result.code).toBe(AppErrorCode.NETWORK_ERROR);
      expect(result.isNetworkError).toBe(true);
      expect(result.isAuthError).toBe(false);
      expect(result.isQuotaError).toBe(false);
      expect(result.isValidationError).toBe(false);
      expect(result.message).toMatch(/serveur/i);
    });
  });

  describe('HTTP 401', () => {
    it('maps to UNAUTHORIZED with isAuthError=true', () => {
      const result = parseApiError(makeAxiosError(401));
      expect(result.code).toBe(AppErrorCode.UNAUTHORIZED);
      expect(result.isAuthError).toBe(true);
      expect(result.isNetworkError).toBe(false);
    });
  });

  describe('HTTP 403', () => {
    it('maps to FORBIDDEN with correct message', () => {
      const result = parseApiError(makeAxiosError(403));
      expect(result.code).toBe(AppErrorCode.FORBIDDEN);
      expect(result.isAuthError).toBe(false);
    });
  });

  describe('HTTP 404', () => {
    it('maps to NOT_FOUND', () => {
      const result = parseApiError(makeAxiosError(404));
      expect(result.code).toBe(AppErrorCode.NOT_FOUND);
    });
  });

  describe('HTTP 409', () => {
    it('maps to CONFLICT', () => {
      const result = parseApiError(makeAxiosError(409));
      expect(result.code).toBe(AppErrorCode.CONFLICT);
    });
  });

  describe('HTTP 422', () => {
    it('maps to VALIDATION_ERROR with isValidationError=true', () => {
      const result = parseApiError(makeAxiosError(422));
      expect(result.code).toBe(AppErrorCode.VALIDATION_ERROR);
      expect(result.isValidationError).toBe(true);
    });
  });

  describe('HTTP 429', () => {
    it('maps to QUOTA_EXCEEDED with isQuotaError=true', () => {
      const result = parseApiError(makeAxiosError(429));
      expect(result.code).toBe(AppErrorCode.QUOTA_EXCEEDED);
      expect(result.isQuotaError).toBe(true);
    });
  });

  describe('structured API error body', () => {
    it('uses error.code from body if valid', () => {
      const body = {
        success: false,
        error: {
          code: AppErrorCode.FORBIDDEN,
          message: 'Accès refusé',
          details: [],
        },
      };
      const result = parseApiError(makeAxiosError(403, body));
      expect(result.code).toBe(AppErrorCode.FORBIDDEN);
      expect(result.message).toBe('Accès refusé');
    });

    it('forwards details array from body', () => {
      const body = {
        success: false,
        error: {
          code: AppErrorCode.VALIDATION_ERROR,
          message: 'Invalide',
          details: [{ field: 'nom', message: 'Requis' }],
        },
      };
      const result = parseApiError(makeAxiosError(422, body));
      expect(result.details).toHaveLength(1);
      expect(result.details[0].field).toBe('nom');
    });

    it('falls back to status code if body.error.code is unknown', () => {
      const body = { success: false, error: { code: 'UNKNOWN_CODE', message: 'Hmm' } };
      const result = parseApiError(makeAxiosError(401, body as any));
      expect(result.code).toBe(AppErrorCode.UNAUTHORIZED);
    });

    it('does not expose backend messages for internal errors', () => {
      const body = {
        success: false,
        error: {
          code: AppErrorCode.INTERNAL_ERROR,
          message: 'SQL failed on table users',
          details: [],
        },
      };
      const result = parseApiError(makeAxiosError(500, body));
      expect(result.message).not.toContain('SQL');
      expect(result.message).toMatch(/erreur/i);
    });

    it('ignores malformed details', () => {
      const body = {
        success: false,
        error: {
          code: AppErrorCode.VALIDATION_ERROR,
          message: 'Invalide',
          details: { field: 'nom', message: 'Requis' },
        },
      };
      const result = parseApiError(makeAxiosError(422, body as any));
      expect(result.details).toEqual([]);
    });
  });

  describe('non-Axios errors', () => {
    it('returns INTERNAL_ERROR for plain Error', () => {
      const result = parseApiError(new Error('plain error'));
      expect(result.code).toBe(AppErrorCode.INTERNAL_ERROR);
      expect(result.isNetworkError).toBe(false);
      expect(result.isAuthError).toBe(false);
    });

    it('returns INTERNAL_ERROR for null/undefined', () => {
      expect(parseApiError(null).code).toBe(AppErrorCode.INTERNAL_ERROR);
      expect(parseApiError(undefined).code).toBe(AppErrorCode.INTERNAL_ERROR);
    });

    it('returns INTERNAL_ERROR for string', () => {
      expect(parseApiError('something went wrong').code).toBe(AppErrorCode.INTERNAL_ERROR);
    });
  });

  describe('TOKEN_EXPIRED code', () => {
    it('is also flagged as isAuthError', () => {
      const body = {
        success: false,
        error: { code: AppErrorCode.TOKEN_EXPIRED, message: 'Token expiré', details: [] },
      };
      const result = parseApiError(makeAxiosError(401, body));
      expect(result.isAuthError).toBe(true);
    });
  });
});
