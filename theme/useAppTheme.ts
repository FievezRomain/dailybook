import { useColorScheme } from 'react-native';
import { useTheme } from "react-native-paper";
import type { AppTheme } from "./theme";
import { darkTokens, lightTokens } from './tokens';

export const useAppTheme = () => {
  const paperTheme = useTheme<AppTheme>();
  const colorScheme = useColorScheme();
  const tokens = colorScheme === 'dark' ? darkTokens : lightTokens;
  return { ...paperTheme, tokens };
};