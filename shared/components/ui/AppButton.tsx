import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../../../theme/useAppTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type LegacyButtonType = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
export type ButtonSize = 's' | 'm' | 'l';

interface AppButtonProps {
  /** Texte du bouton (préféré). Alternative à `children`. */
  label?: string;
  /** Contenu personnalisé. Si fourni, prend le pas sur `label`. */
  children?: React.ReactNode;
  onPress?: () => void;
  /** Variante moderne (préférer à `type`). */
  variant?: ButtonVariant;
  /** @deprecated Utiliser `variant`. */
  type?: LegacyButtonType;
  /** Taille : s/m/l. Défaut : 'm'. */
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** @deprecated Alias historique de `style`. */
  optionalStyle?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  /** @deprecated Force un padding horizontal large. */
  isLong?: boolean;
  /** Affiche le label en majuscules. Défaut : false. */
  isUppercase?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const LEGACY_TYPE_TO_VARIANT: Record<LegacyButtonType, ButtonVariant> = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'primary',
  quaternary: 'primary',
  quinary: 'ghost',
};

const SIZE_PADDING: Record<ButtonSize, { v: number; h: number; long: number; font: number }> = {
  s: { v: 10, h: 5, long: 40, font: 12 },
  m: { v: 12, h: 15, long: 40, font: 14 },
  l: { v: 15, h: 40, long: 40, font: 16 },
};

export default function AppButton({
  label,
  children,
  onPress,
  variant,
  type,
  size = 'm',
  loading = false,
  disabled = false,
  icon,
  style,
  optionalStyle,
  fullWidth = false,
  isLong = false,
  isUppercase = false,
  accessibilityLabel,
  accessibilityHint,
}: AppButtonProps) {
  const { colors, fonts, tokens } = useAppTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPressIn = () => {
    scale.value = withSpring(0.96, { stiffness: 300, damping: 20 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { stiffness: 300, damping: 20 });
  };

  const isDisabled = disabled || loading;
  const resolvedVariant: ButtonVariant = variant ?? (type ? LEGACY_TYPE_TO_VARIANT[type] : 'primary');
  const sizeCfg = SIZE_PADDING[size];
  const horizontal = isLong ? sizeCfg.long : sizeCfg.h;

  const containerStyle: ViewStyle = {
    backgroundColor:
      resolvedVariant === 'primary'
        ? colors.primary
        : resolvedVariant === 'destructive'
          ? colors.error
          : 'transparent',
    borderWidth: resolvedVariant === 'secondary' ? tokens.borderHairline * 2 : 0,
    borderColor: resolvedVariant === 'secondary' ? colors.primary : undefined,
    borderRadius: tokens.radii.pill,
    paddingVertical: sizeCfg.v,
    paddingHorizontal: horizontal,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    alignSelf: fullWidth ? undefined : 'flex-start',
    opacity: isDisabled ? 0.5 : 1,
  };

  const labelColor =
    resolvedVariant === 'primary' || resolvedVariant === 'destructive'
      ? colors.textOnPrimary
      : colors.primary;

  const textStyle: TextStyle = {
    color: labelColor,
    fontFamily: fonts.medium.fontFamily,
    fontSize: sizeCfg.font,
    textAlign: 'center',
    textTransform: isUppercase ? 'uppercase' : 'none',
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={labelColor} />;
    }
    if (children !== undefined) {
      return (
        <>
          {icon ? <View>{icon}</View> : null}
          {typeof children === 'string' ? <Text style={textStyle}>{children}</Text> : children}
        </>
      );
    }
    return (
      <>
        {icon ? <View>{icon}</View> : null}
        {label ? <Text style={textStyle}>{label}</Text> : null}
      </>
    );
  }; 

  return (
    <Animated.View style={[animStyle, fullWidth && styles.fullWidth]}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={[containerStyle, style, optionalStyle]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        activeOpacity={1}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWidth: { width: '100%' },
});
