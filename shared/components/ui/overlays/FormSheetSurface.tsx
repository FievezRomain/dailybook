import type { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { View } from 'react-native';
import { materialTokens, type Material } from '../../../../theme/materials';
import { alpha } from '../../../../theme/primitives';
import { radii } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { useResolvedMaterial } from '../../../../theme/useResolvedMaterial';
import { resolveOverlaySurfaceColor } from './overlayStyles';

export interface FormSheetSurfaceProps extends BottomSheetBackgroundProps {
  material?: Material;
}

/** Surface Figma partagée par tous les parcours de création et modification. */
export function FormSheetSurface({ style, pointerEvents, material = 'solid' }: FormSheetSurfaceProps) {
  const { colors, isDark } = useAppTheme();
  const resolvedMaterial = useResolvedMaterial(material);
  const surfaceStyle = [
    style,
    {
      borderTopLeftRadius: radii.sheet,
      borderTopRightRadius: radii.sheet,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: resolvedMaterial === 'glass' ? colors.glassBorder : colors.border,
      overflow: 'hidden' as const,
      backgroundColor: resolveOverlaySurfaceColor(colors, resolvedMaterial),
      shadowColor: alpha.black16,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: resolvedMaterial === 'solid' ? 1 : 0,
      shadowRadius: 9,
      elevation: resolvedMaterial === 'solid' ? 8 : 0,
    },
  ];

  if (resolvedMaterial === 'glass') {
    return <BlurView pointerEvents={pointerEvents} intensity={materialTokens.blur.glass} tint={isDark ? 'dark' : 'light'} style={surfaceStyle} />;
  }

  return <View pointerEvents={pointerEvents} style={surfaceStyle} />;
}
