import type { ReactNode } from 'react';
import { BlurView } from 'expo-blur';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { materialTokens, type Material } from '../../../../theme/materials';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { useResolvedMaterial } from '../../../../theme/useResolvedMaterial';

export function NavigationSurface({ material, children, style }: { material: Material; children: ReactNode; style: StyleProp<ViewStyle> }) {
  const { isDark, colors } = useAppTheme();
  const resolved = useResolvedMaterial(material);
  if (resolved === 'glass') {
    return <BlurView intensity={materialTokens.blur.tabBar} tint={isDark ? 'dark' : 'light'} style={[style, { backgroundColor: colors.glassBackground }]}>{children}</BlurView>;
  }
  return <View style={[style, { backgroundColor: colors.surface }]}>{children}</View>;
}
