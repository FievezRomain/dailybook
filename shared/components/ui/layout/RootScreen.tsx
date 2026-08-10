import { cloneElement, isValidElement, useState, type ReactNode } from 'react';
import { ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent, type RefreshControlProps, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { componentTokens } from '../../../../theme/componentTokens';
import type { Material } from '../../../../theme/materials';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { useResolvedMaterial } from '../../../../theme/useResolvedMaterial';
import { Screen } from './Screen';

export interface RootScreenProps {
  header: ReactNode;
  bottomBar: ReactNode;
  children: ReactNode;
  floatingAction?: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  onScrollOffsetChange?: (offsetY: number) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
  material?: Material;
}

export function RootScreen({ header, bottomBar, children, floatingAction, scroll = true, padded = true, refreshControl, onScrollOffsetChange, contentContainerStyle, testID, material }: RootScreenProps) {
  const { colors } = useAppTheme();
  const [scrolled, setScrolled] = useState(false);
  const insets = useSafeAreaInsets();
  const inheritedMaterial = isValidElement<{ material?: Material }>(header) ? header.props.material : undefined;
  const resolvedMaterial = useResolvedMaterial(material ?? inheritedMaterial ?? 'solid');
  const barBackgroundColor = resolvedMaterial === 'glass' ? colors.glassBackground : colors.surface;
  const baseStyle: ViewStyle = { width: '100%', maxWidth: componentTokens.screen.contentMaxWidth, alignSelf: 'center', paddingHorizontal: padded ? componentTokens.screen.contentPaddingX : 0, paddingVertical: padded ? componentTokens.screen.contentPaddingY : 0 };
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => { const offsetY = event.nativeEvent.contentOffset.y; const next = offsetY > 0; setScrolled((current) => current === next ? current : next); onScrollOffsetChange?.(offsetY); };
  const renderedHeader = isValidElement<{ scrolled?: boolean }>(header) ? cloneElement(header, { scrolled }) : header;
  const floatingBarSpace = componentTokens.navigation.bottomBarHeight + componentTokens.navigation.bottomBarMargin * 2 + insets.bottom;
  return <Screen edges={[]} testID={testID}><SafeAreaView edges={['top']} style={{ backgroundColor: barBackgroundColor }}><View accessibilityRole="header">{renderedHeader}</View></SafeAreaView>{scroll ? <ScrollView keyboardShouldPersistTaps="handled" refreshControl={refreshControl} onScroll={handleScroll} scrollEventThrottle={16} contentInsetAdjustmentBehavior="never" contentContainerStyle={[baseStyle, { flexGrow: 1, paddingBottom: floatingBarSpace }, contentContainerStyle]}>{children}</ScrollView> : <View style={[baseStyle, { flex: 1, paddingBottom: floatingBarSpace }, contentContainerStyle]}>{children}</View>}{floatingAction ? <View pointerEvents="box-none" style={{ position: 'absolute', right: 24, bottom: floatingBarSpace + componentTokens.navigation.bottomBarMargin }}>{floatingAction}</View> : null}<View pointerEvents="box-none" style={{ position: 'absolute', left: componentTokens.navigation.bottomBarMargin, right: componentTokens.navigation.bottomBarMargin, bottom: insets.bottom + componentTokens.navigation.bottomBarMargin }}><View accessibilityRole="tablist">{bottomBar}</View></View></Screen>;
}
