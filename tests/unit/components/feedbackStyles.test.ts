import { lightColors } from '../../../theme/semantic';
import { resolveFeedbackTone } from '../../../shared/components/ui/feedback/feedbackStyles';

describe('feedback tone styles', () => {
  it.each([
    ['info', 'info', lightColors.borderFocus],
    ['success', 'success', lightColors.success],
    ['warning', 'warning', lightColors.warning],
    ['error', 'close', lightColors.error],
  ] as const)('maps %s to its semantic icon and border', (tone, icon, border) => {
    expect(resolveFeedbackTone(lightColors, tone)).toMatchObject({ icon, border });
  });
  it('uses the semantic error surface', () => {
    expect(resolveFeedbackTone(lightColors, 'error').background).toBe(lightColors.errorSurface);
  });
});
