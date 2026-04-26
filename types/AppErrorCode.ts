/**
 * Codes d'erreur sémantiques — miroir 1:1 de ErrorCode dans core/entities/exceptions.py du backend.
 * NETWORK_ERROR est ajouté côté client pour les erreurs sans réponse serveur.
 */
export enum AppErrorCode {
  UNAUTHORIZED        = 'UNAUTHORIZED',
  TOKEN_EXPIRED       = 'TOKEN_EXPIRED',
  FORBIDDEN           = 'FORBIDDEN',
  NOT_FOUND           = 'NOT_FOUND',
  CONFLICT            = 'CONFLICT',
  VALIDATION_ERROR    = 'VALIDATION_ERROR',
  QUOTA_EXCEEDED      = 'QUOTA_EXCEEDED',
  FEATURE_UNAVAILABLE = 'FEATURE_UNAVAILABLE',
  INTERNAL_ERROR      = 'INTERNAL_ERROR',
  NETWORK_ERROR       = 'NETWORK_ERROR',
}
