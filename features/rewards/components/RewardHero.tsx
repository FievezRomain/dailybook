import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { RewardSummary } from '../../../models/Reward';
import { Card, StatusBadge, VascorMark } from '../../../shared/components/ui';
import { componentTokens } from '../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { RewardProgress } from '../rewardProgress';

export function RewardHero({
  summary,
  displayedBalance,
  progress,
}: {
  summary: RewardSummary;
  displayedBalance: number;
  progress: RewardProgress;
}) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('rewards');
  const percent = Math.round(progress.progress * 100);
  const progressWidth = `${percent}%` as `${number}%`;
  const progressLabel = progress.nextLevelKey
    ? t('hub.nextGrade', {
      count: progress.remaining,
      grade: t(`levels.${progress.nextLevelKey}`),
    })
    : t('hub.highestGrade');

  return (
    <Card
      accessibilityLabel={`${t('currency.balanceAccessibility', { count: displayedBalance })}, ${t(`levels.${summary.level.key}`)}, ${progressLabel}`}
      style={{
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.lg,
        backgroundColor: colors.backgroundPaper,
      }}
    >
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xs, letterSpacing: 0.8, textTransform: 'uppercase' }}>
        {t('hub.currentGradeLabel')}
      </Text>
      <VascorMark progress={progress.progress} size="hero" />
      <View style={{ alignItems: 'center', gap: spacing.xs }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxxl }}>
          {displayedBalance}
        </Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>
          {t('currency.short')}
        </Text>
      </View>
      <StatusBadge label={t(`levels.${summary.level.key}`)} tone="success" />
      <View style={{ width: '100%', gap: spacing.sm }}>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel={t('hub.gradeProgressAccessibility', { percent })}
          accessibilityValue={{ min: 0, max: 100, now: percent }}
          style={{
            width: '100%',
            height: componentTokens.vascor.heroProgressHeight,
            overflow: 'hidden',
            borderRadius: radii.pill,
            backgroundColor: colors.surface,
          }}
        >
          <View style={{ width: progressWidth, height: '100%', borderRadius: radii.pill, backgroundColor: colors.vascorCoin }} />
        </View>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm, textAlign: 'center' }}>
          {progressLabel}
        </Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs, textAlign: 'center' }}>
          {t('hub.lifetime', { count: summary.lifetime_earned })}
        </Text>
      </View>
    </Card>
  );
}
