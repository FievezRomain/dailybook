import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { componentTokens } from '../../../../theme/componentTokens';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Screen } from './Screen';

export interface DetailScreenProps {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  keyboardAware?: boolean;
  keyboardVerticalOffset?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  footerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export function DetailScreen({ header, children, footer, scroll = true, padded = true, keyboardAware = true, keyboardVerticalOffset = 0, contentContainerStyle, footerStyle, testID }: DetailScreenProps) {
  const { colors } = useAppTheme();
  const baseStyle: ViewStyle = { width: '100%', maxWidth: componentTokens.screen.contentMaxWidth, alignSelf: 'center', paddingHorizontal: padded ? componentTokens.screen.contentPaddingX : 0, paddingVertical: padded ? componentTokens.screen.contentPaddingY : 0 };
  return <Screen edges={['bottom']} keyboardAvoiding={keyboardAware} keyboardVerticalOffset={keyboardVerticalOffset} testID={testID}><SafeAreaView edges={['top']} style={{ backgroundColor: colors.surface }}><View accessibilityRole="header">{header}</View></SafeAreaView>{scroll ? <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" nestedScrollEnabled directionalLockEnabled={false} automaticallyAdjustKeyboardInsets contentInsetAdjustmentBehavior="automatic" contentContainerStyle={[baseStyle, { flexGrow: 1 }, contentContainerStyle]}>{children}</ScrollView> : <View style={[baseStyle, { flex: 1 }, contentContainerStyle]}>{children}</View>}{footer ? <View accessibilityRole="toolbar" style={[{ width: '100%', maxWidth: componentTokens.screen.contentMaxWidth, alignSelf: 'center', paddingHorizontal: componentTokens.screen.contentPaddingX, paddingTop: componentTokens.screen.footerPaddingTop, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface }, footerStyle]}>{footer}</View> : null}</Screen>;
}
