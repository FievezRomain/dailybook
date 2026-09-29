import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons/Icon';
import type { VascoIconName } from '../icons/iconRegistry';
import { BrandLoader } from '../feedback/BrandLoader';
import {
  getButtonMetrics,
  resolveButtonVisualState,
  type ButtonSize,
  type ButtonVariant,
} from './buttonStyles';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: VascoIconName;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const { colors } = useAppTheme();
  const unavailable = disabled || loading;
  const metrics = getButtonMetrics(size);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => {
        const visual = resolveButtonVisualState(colors, variant, pressed, unavailable);
        return [
          {
            minHeight: metrics.height,
            height: metrics.height,
            paddingHorizontal: metrics.paddingHorizontal,
            borderRadius: radii.pill,
            borderWidth: componentTokens.button.stroke,
            borderColor: visual.borderColor,
            backgroundColor: visual.backgroundColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: componentTokens.button.gap,
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
          },
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const visual = resolveButtonVisualState(colors, variant, pressed, unavailable);
        return (
          <>
            {loading ? (
              <BrandLoader size="compact" accessibilityLabel="Chargement en cours" />
            ) : icon ? (
              <Icon name={icon} size="md" color={visual.textColor} />
            ) : null}
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.5}
              style={{
                color: visual.textColor,
                fontFamily: typography.fonts.medium,
                fontSize: metrics.fontSize,
              }}
            >
              {label}
            </Text>
          </>
        );
      }}
    </Pressable>
  );
}
