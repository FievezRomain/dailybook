import { clampUploadProgress, getFileStateLabel } from '../../../shared/components/ui/content/fileItemUtils';

describe('file item utilities', () => {
  it('clamps upload progress', () => {
    expect(clampUploadProgress(-1)).toBe(0);
    expect(clampUploadProgress(0.62)).toBe(0.62);
    expect(clampUploadProgress(2)).toBe(1);
  });
  it('formats each file state', () => {
    expect(getFileStateLabel('uploaded', '1,8 Mo · Ajouté aujourd’hui', 0)).toBe('1,8 Mo · Ajouté aujourd’hui');
    expect(getFileStateLabel('uploading', '', 0.62)).toBe('Téléversement · 62 %');
    expect(getFileStateLabel('error', '', 0)).toBe('Échec · Réessayer');
  });
});
