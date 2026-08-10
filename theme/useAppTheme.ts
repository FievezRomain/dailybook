import { useThemeStore } from '../stores/useThemeStore';
import { darkTokens, lightTokens } from './tokens';

export const useAppTheme = () => {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const tokens = resolvedTheme === 'dark' ? darkTokens : lightTokens;

  return {
    tokens,
    colors: resolvedTheme === 'dark' ? darkTokens : lightTokens,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
  } as const;
};
