import { useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Material } from '../../../../theme/materials';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';
import { VascoBottomSheet } from '../overlays';
import { globalCreateChoices, type GlobalCreateChoice, type GlobalCreateTarget } from './globalCreateMenuUtils';

export interface GlobalCreateMenuProps {
  open: boolean;
  onClose: () => void;
  onSelect: (target: GlobalCreateTarget) => void;
  material?: Material;
  testID?: string;
}

export function GlobalCreateMenu({ open, onClose, onSelect, material = 'solid', testID }: GlobalCreateMenuProps) {
  const pendingTarget = useRef<GlobalCreateTarget | undefined>(undefined);
  const requestSelection = (target: GlobalCreateTarget) => {
    pendingTarget.current = target;
    onClose();
  };
  const handleDismiss = () => {
    onClose();
    const target = pendingTarget.current;
    pendingTarget.current = undefined;
    if (target) requestAnimationFrame(() => onSelect(target));
  };

  return (
    <VascoBottomSheet open={open} onClose={handleDismiss} title="Créer" description="Que souhaitez-vous ajouter ?" material={material} height={590} testID={testID}>
      <View style={{ gap: spacing.sm }}>
        {globalCreateChoices.map((choice) => <CreateMenuItem key={choice.id} choice={choice} onPress={() => requestSelection(choice.id)} />)}
      </View>
    </VascoBottomSheet>
  );
}

function CreateMenuItem({ choice, onPress }: { choice: GlobalCreateChoice; onPress: () => void }) {
  const { colors } = useAppTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={choice.label} accessibilityHint={choice.description} onPress={onPress} style={({ pressed }) => ({ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: pressed ? colors.surfaceVariant : colors.surface })}>
      <View accessibilityElementsHidden style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.primaryLight }}><Icon name={choice.icon} size="md" color={colors.primary} /></View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: typography.lineHeights.normal }}>{choice.label}</Text>
        <Text numberOfLines={2} style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs, lineHeight: 16 }}>{choice.description}</Text>
      </View>
    </Pressable>
  );
}
