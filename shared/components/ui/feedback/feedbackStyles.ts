import type { VascoColors } from '../../../../theme/semantic';
import type { VascoIconName } from '../icons';

export type FeedbackTone = 'info' | 'success' | 'warning' | 'error';

export function resolveFeedbackTone(colors: VascoColors, tone: FeedbackTone): { border: string; background: string; accent: string; icon: VascoIconName } {
  switch (tone) {
    case 'success': return { border: colors.success, background: colors.surface, accent: colors.success, icon: 'success' };
    case 'warning': return { border: colors.warning, background: colors.surface, accent: colors.warning, icon: 'warning' };
    case 'error': return { border: colors.error, background: colors.errorSurface, accent: colors.error, icon: 'close' };
    default: return { border: colors.borderFocus, background: colors.surface, accent: colors.primary, icon: 'info' };
  }
}
