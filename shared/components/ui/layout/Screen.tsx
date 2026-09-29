import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { getKeyboardAvoidingBehavior } from './screenUtils';

export interface ScreenProps {
  children: ReactNode;
  edges?: readonly Edge[];
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Screen({ children, edges = ['top', 'bottom'], keyboardAvoiding = false, keyboardVerticalOffset = 0, style, contentStyle, testID }: ScreenProps) {
  const { colors } = useAppTheme();
  const content = <View style={[{ flex: 1 }, contentStyle]}>{children}</View>;
  return <SafeAreaView edges={[...edges]} testID={testID} style={[{ flex: 1, backgroundColor: colors.background }, style]}>{keyboardAvoiding ? <KeyboardAvoidingView behavior={getKeyboardAvoidingBehavior(Platform.OS)} keyboardVerticalOffset={keyboardVerticalOffset} style={{ flex: 1 }}>{content}</KeyboardAvoidingView> : content}</SafeAreaView>;
}
