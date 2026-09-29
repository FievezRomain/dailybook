import { getFirebaseError, FIREBASE_ERRORS } from '../../../shared/utils/FirebaseErrorUtils';

const FALLBACK = "Une erreur inconnue s'est produite. Veuillez réessayer.";

describe('getFirebaseError', () => {
  it.each(Object.entries(FIREBASE_ERRORS))(
    'returns correct message for code "%s"',
    (code, message) => {
      expect(getFirebaseError({ code })).toBe(message);
    },
  );

  it('returns fallback message for unknown error code', () => {
    expect(getFirebaseError({ code: 'auth/unknown-code' })).toBe(FALLBACK);
  });

  it('returns fallback message when error is null', () => {
    expect(getFirebaseError(null)).toBe(FALLBACK);
  });

  it('returns fallback message when error is undefined', () => {
    expect(getFirebaseError(undefined)).toBe(FALLBACK);
  });

  it('returns fallback message when error has no code', () => {
    expect(getFirebaseError({})).toBe(FALLBACK);
  });

  it('returns fallback message when error is a plain string', () => {
    expect(getFirebaseError('auth/invalid-email')).toBe(FALLBACK);
  });
});
