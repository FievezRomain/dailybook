import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';

export function AuthScreen({ children, scroll = true, centered = false, contentStyle, testID }: { children: ReactNode; scroll?: boolean; centered?: boolean; contentStyle?: StyleProp<ViewStyle>; testID?: string }) {
  const { colors, isDark } = useAppTheme();
  const body = <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}><View style={[{ flexGrow: 1, width: '100%', maxWidth: 390, alignSelf: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.lg, alignItems: centered ? 'center' : 'stretch' }, contentStyle]}>{children}</View></TouchableWithoutFeedback>;
  const overlayColors: readonly [string, string] = isDark
    ? [colors.overlay, colors.overlay]
    : [colors.onImageStrong, colors.onImageMuted];
  return <ImageBackground source={require('../../../assets/wallpaper_login.png')} resizeMode="cover" style={{ flex: 1 }}><LinearGradient colors={overlayColors} style={{ flex: 1 }}><SafeAreaView style={{ flex: 1 }}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>{scroll ? <ScrollView testID={testID} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}>{body}</ScrollView> : <View testID={testID} style={{ flex: 1 }}>{body}</View>}</KeyboardAvoidingView></SafeAreaView></LinearGradient></ImageBackground>;
}
