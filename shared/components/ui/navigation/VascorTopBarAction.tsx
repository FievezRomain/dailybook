import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { getRewardProgress } from '../../../../features/rewards/rewardProgress';
import { useRewardSummaryQuery } from '../../../../hooks/queries/useRewardsQuery';
import { useAppearanceStore } from '../../../../stores/useAppearanceStore';
import { useRewardStore } from '../../../../stores/useRewardStore';
import { componentTokens } from '../../../../theme/componentTokens';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { VascorMark } from '../content/VascorMark';

interface Props {
  testID?: string;
}

export function VascorTopBarAction({ testID }: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('rewards');
  const summary = useRewardSummaryQuery();
  const balanceOverride = useRewardStore((state) => state.balanceOverride);
  const grants = useRewardStore((state) => state.grants);
  const consumeGrant = useRewardStore((state) => state.consumeGrant);
  const requestOpen = useRewardStore((state) => state.requestOpen);
  const appReduceMotion = useAppearanceStore((state) => state.reduceMotion);
  const systemReduceMotion = useReducedMotion();
  const refetchSummary = summary.refetch;
  const targetBalance = balanceOverride ?? summary.data?.balance ?? 0;
  const [displayedBalance, setDisplayedBalance] = useState(targetBalance);
  const runningGrantId = useRef<number | undefined>(undefined);
  const pulse = useSharedValue(0);
  const progress = summary.data
    ? getRewardProgress(summary.data.lifetime_earned, summary.data.level).progress
    : 0;

  const finishGrant = useCallback((transactionId: number, balance: number) => {
    setDisplayedBalance(balance);
    runningGrantId.current = undefined;
    consumeGrant(transactionId);
  }, [consumeGrant]);

  useEffect(() => {
    const grant = grants[0];
    if (!grant || runningGrantId.current === grant.transaction_id) return;
    runningGrantId.current = grant.transaction_id;
    void refetchSummary();

    const startBalance = grant.balance - grant.amount;
    setDisplayedBalance(startBalance);

    if (appReduceMotion || systemReduceMotion) {
      finishGrant(grant.transaction_id, grant.balance);
      return;
    }

    const startedAt = Date.now();
    const duration = componentTokens.vascor.animation.count;
    const timer = setInterval(() => {
      const elapsed = Math.min(1, (Date.now() - startedAt) / duration);
      setDisplayedBalance(Math.round(startBalance + grant.amount * elapsed));
      if (elapsed >= 1) clearInterval(timer);
    }, 32);

    pulse.value = withSequence(
      withTiming(1, { duration: componentTokens.vascor.animation.grow }),
      withTiming(1, {
        duration: Math.max(
          0,
          componentTokens.vascor.animation.count
            - componentTokens.vascor.animation.grow,
        ),
      }),
      withTiming(0, { duration: componentTokens.vascor.animation.settle }),
    );

    const finishTimer = setTimeout(() => {
      clearInterval(timer);
      finishGrant(grant.transaction_id, grant.balance);
    }, duration + componentTokens.vascor.animation.settle);

    return () => {
      clearInterval(timer);
      clearTimeout(finishTimer);
    };
  }, [
    appReduceMotion,
    finishGrant,
    grants,
    pulse,
    refetchSummary,
    systemReduceMotion,
  ]);

  useEffect(() => {
    if (!grants.length && runningGrantId.current === undefined) {
      setDisplayedBalance(targetBalance);
    }
  }, [grants.length, targetBalance]);

  const markStyle = useAnimatedStyle(() => ({
    transform: [{
      scale: 1 + pulse.value * (componentTokens.vascor.pulseScale - 1),
    }],
  }));
  const fillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pulse.value,
      [0, 1],
      [colors.vascorCoin, colors.success],
    ),
  }));
  const counterStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      pulse.value,
      [0, 1],
      [colors.textPrimary, colors.success],
    ),
    transform: [{
      scale: 1 + pulse.value * (componentTokens.vascor.pulseScale - 1),
    }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('currency.balanceAccessibility', {
        count: displayedBalance,
      })}
      onPress={requestOpen}
      testID={testID}
      style={{
        minWidth: 58,
        height: 44,
        paddingHorizontal: spacing.xs,
        flexDirection: 'row',
        gap: spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <VascorMark
        progress={progress}
        style={markStyle}
        fillStyle={fillStyle}
      />
      <Animated.Text
        accessibilityLiveRegion="polite"
        style={[
          {
            color: colors.textPrimary,
            fontFamily: typography.fonts.semiBold,
            fontSize: typography.sizes.xs,
          },
          counterStyle,
        ]}
      >
        {displayedBalance}
      </Animated.Text>
    </Pressable>
  );
}
