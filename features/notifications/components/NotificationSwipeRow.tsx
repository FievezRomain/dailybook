import { Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';

interface NotificationSwipeRowProps {
  read: boolean;
  onToggleRead: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

export function NotificationSwipeRow({ read, onToggleRead, onDelete, children }: NotificationSwipeRowProps) {
  const { colors } = useAppTheme();
  return <Swipeable overshootRight={false} rightThreshold={44} renderRightActions={() => <View style={{ minHeight: 104, flexDirection: 'row' }}>
    <Pressable accessibilityRole="button" accessibilityLabel={read ? 'Marquer comme non lue' : 'Marquer comme lue'} onPress={onToggleRead} style={{ width: 88, alignItems: 'center', justifyContent: 'center', padding: spacing.sm, backgroundColor: colors.surfaceDim }}><Text style={{ textAlign: 'center', color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xs }}>{read ? 'Non lue' : 'Lue'}</Text></Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Supprimer la notification" onPress={onDelete} style={{ width: 88, alignItems: 'center', justifyContent: 'center', padding: spacing.sm, backgroundColor: colors.error }}><Text style={{ color: colors.textOnPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xs }}>Supprimer</Text></Pressable>
  </View>}>{children}</Swipeable>;
}
