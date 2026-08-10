import {
  isMediaUploadActionable,
  resolveMediaUploadVisual,
} from '../../../shared/components/ui/forms/mediaUploadStyles';
import { lightColors } from '../../../theme/semantic';

describe('media upload states', () => {
  it('maps async states to semantic colors', () => {
    expect(resolveMediaUploadVisual(lightColors, 'uploading').borderColor).toBe(lightColors.borderFocus);
    expect(resolveMediaUploadVisual(lightColors, 'success').borderColor).toBe(lightColors.success);
    expect(resolveMediaUploadVisual(lightColors, 'error')).toMatchObject({
      backgroundColor: lightColors.errorSurface,
      borderColor: lightColors.error,
      contentColor: lightColors.error,
    });
  });

  it('only allows selection and retry interactions', () => {
    expect(isMediaUploadActionable('empty')).toBe(true);
    expect(isMediaUploadActionable('error')).toBe(true);
    expect(isMediaUploadActionable('uploading')).toBe(false);
    expect(isMediaUploadActionable('success')).toBe(false);
    expect(isMediaUploadActionable('disabled')).toBe(false);
  });
});
