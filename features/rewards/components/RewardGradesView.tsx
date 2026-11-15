import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { RewardSummary } from '../../../models/Reward';
import { Card, Icon, StatusBadge } from '../../../shared/components/ui';
import { componentTokens } from '../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { RewardSectionIntroduction } from './RewardSectionIntroduction';

export function RewardGradesView({ summary }: { summary: RewardSummary }) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('rewards');

  return (
    <View style={{ gap: spacing.md }}>
      <RewardSectionIntroduction title={t('hub.gradesTitle')} message={t('hub.gradesSubtitle')} />
      <Card accessibilityLabel={t('hub.gradesTitle')}>
        {summary.levels.map((level, index) => {
          const current = summary.level.key === level.key;
          const reached = summary.lifetime_earned >= level.minimum;
          const accent = current ? colors.vascorCoinDark : reached ? colors.success : colors.textSecondary;

          return (
            <View
              key={level.key}
              accessible
              accessibilityLabel={`${t(`levels.${level.key}`)}, ${t('hub.gradeThreshold', { count: level.minimum })}${current ? `, ${t('hub.currentGrade')}` : ''}`}
              style={{
                minHeight: componentTokens.content.listItemHeight,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                paddingHorizontal: current ? spacing.sm : 0,
                borderRadius: radii.md,
                borderBottomWidth: current || index === summary.levels.length - 1 ? 0 : 1,
                borderBottomColor: colors.border,
                backgroundColor: current ? colors.backgroundPaper : colors.transparent,
              }}
            >
              <View style={{ width: componentTokens.content.listLeadingSize, height: componentTokens.content.listLeadingSize, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: current ? colors.surface : colors.surfaceVariant }}>
                <Icon name={reached ? 'trophy' : 'lock'} size="md" color={accent} />
              </View>
              <View style={{ flex: 1, gap: spacing.xs }}>
                <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.md }}>
                  {t(`levels.${level.key}`)}
                </Text>
                <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>
                  {t('hub.gradeThreshold', { count: level.minimum })}
                </Text>
              </View>
              {current ? (
                <StatusBadge label={t('hub.currentGrade')} tone="success" />
              ) : reached ? (
                <StatusBadge label={t('hub.reachedGrade')} tone="info" />
              ) : null}
            </View>
          );
        })}
      </Card>
    </View>
  );
}
