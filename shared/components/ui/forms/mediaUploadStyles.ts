import type { VascoColors } from '../../../../theme/semantic';

export type MediaUploadState = 'empty' | 'uploading' | 'success' | 'error' | 'disabled';

export function resolveMediaUploadVisual(colors: VascoColors, state: MediaUploadState) {
  if (state === 'disabled') {
    return { backgroundColor: colors.surfaceDim, borderColor: colors.border, contentColor: colors.textDisabled };
  }
  if (state === 'error') {
    return { backgroundColor: colors.errorSurface, borderColor: colors.error, contentColor: colors.error };
  }
  if (state === 'success') {
    return { backgroundColor: colors.surface, borderColor: colors.success, contentColor: colors.success };
  }
  if (state === 'uploading') {
    return { backgroundColor: colors.surface, borderColor: colors.borderFocus, contentColor: colors.primary };
  }
  return { backgroundColor: colors.surface, borderColor: colors.border, contentColor: colors.textPrimary };
}

export function isMediaUploadActionable(state: MediaUploadState) {
  return state === 'empty' || state === 'success' || state === 'error';
}
