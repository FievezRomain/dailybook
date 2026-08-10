import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView, Platform, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';

export function AuthScreen({ children, scroll = true, centered = false, contentStyle, testID }: { children: ReactNode; scroll?: boolean; centered?: boolean; contentStyle?: StyleProp<ViewStyle>; testID?: string }) {
  const { colors } = useAppTheme();
  const body = <View style={[{ flexGrow: 1, width: '100%', maxWidth: 390, alignSelf: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.lg, alignItems: centered ? 'center' : 'stretch' }, contentStyle]}>{children}</View>;
  return <LinearGradient colors={[colors.background, colors.backgroundPaper]} style={{ flex: 1 }}><SafeAreaView style={{ flex: 1 }}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>{scroll ? <ScrollView testID={testID} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive">{body}</ScrollView> : <View testID={testID} style={{ flex: 1 }}>{body}</View>}</KeyboardAvoidingView></SafeAreaView></LinearGradient>;
}
