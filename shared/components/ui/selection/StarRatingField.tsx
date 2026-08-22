import { Pressable, Text, View } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';

export interface StarRatingFieldProps {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  helperText?: string;
  testID?: string;
}

const ratings = [1, 2, 3, 4, 5] as const;

export function StarRatingField({ label, value, onChange, helperText = 'Facultatif', testID }: StarRatingFieldProps) {
  const { colors } = useAppTheme();
  const selectedValue = typeof value === 'number' && value >= 1 && value <= 5 ? value : undefined;

  return (
    <View style={{ gap: spacing.sm }} testID={testID}>
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        {ratings.map((rating) => {
          const selected = Boolean(selectedValue && rating <= selectedValue);
          return (
            <Pressable
              key={rating}
              accessibilityRole="radio"
              accessibilityLabel={`${rating} étoile${rating > 1 ? 's' : ''} sur 5`}
              accessibilityState={{ checked: selectedValue === rating }}
              hitSlop={4}
              onPress={() => onChange(rating)}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Icon name={selected ? 'star' : 'starOutline'} size="lg" color={selected ? colors.primary : colors.textSecondary} />
            </Pressable>
          );
        })}
      </View>
      <View style={{ minHeight: 22, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flex: 1, color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>
          {selectedValue ? `${selectedValue}/5` : helperText}
        </Text>
        {selectedValue ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Effacer la note" hitSlop={8} onPress={() => onChange(undefined)}>
            <Text style={{ color: colors.primary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>
              Effacer
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
