import { useMemo, useState } from 'react';
import { PanResponder, Text, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { stepNumber, valueFromPosition } from './numberUtils';

export interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  formatValue?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  formatValue = String,
  style,
  testID,
}: SliderProps) {
  const { colors } = useAppTheme();
  const [width, setWidth] = useState(0);
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const color = disabled ? colors.textDisabled : colors.primary;

  const updateAt = (position: number) => {
    if (!disabled) onChange(valueFromPosition(position, width, min, max, step));
  };

  const panResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (event) => updateAt(event.nativeEvent.locationX),
      onPanResponderMove: (event) => updateAt(event.nativeEvent.locationX),
    }),
    [disabled, width, min, max, step, value],
  );

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: value, text: formatValue(value) }}
      accessibilityState={{ disabled }}
      accessibilityActions={[{ name: 'decrement' }, { name: 'increment' }]}
      onAccessibilityAction={({ nativeEvent }) => {
        if (disabled) return;
        if (nativeEvent.actionName === 'decrement') onChange(stepNumber(value, -1, step, min, max));
        if (nativeEvent.actionName === 'increment') onChange(stepNumber(value, 1, step, min, max));
      }}
      style={[{ width: '100%', gap: spacing.sm }, style]}
      testID={testID}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: disabled ? colors.textDisabled : colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.normal }}>
          {label}
        </Text>
        <Text style={{ color, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.normal }}>
          {formatValue(value)}
        </Text>
      </View>
      <View
        {...panResponder.panHandlers}
        onLayout={onLayout}
        style={{ height: componentTokens.slider.touchAreaHeight, flexDirection: 'row', alignItems: 'center' }}
      >
        <View style={{ flex: percent, height: componentTokens.slider.trackHeight, backgroundColor: color, borderTopLeftRadius: radii.full, borderBottomLeftRadius: radii.full }} />
        <View style={{ width: componentTokens.slider.thumbSize, height: componentTokens.slider.thumbSize, borderRadius: radii.full, backgroundColor: color }} />
        <View style={{ flex: 100 - percent, height: componentTokens.slider.trackHeight, backgroundColor: colors.border, borderTopRightRadius: radii.full, borderBottomRightRadius: radii.full }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: disabled ? colors.textDisabled : colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>
          {formatValue(min)}
        </Text>
        <Text style={{ color: disabled ? colors.textDisabled : colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>
          {formatValue(max)}
        </Text>
      </View>
    </View>
  );
}
