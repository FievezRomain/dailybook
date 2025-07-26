import { DefaultTheme } from "react-native-paper";
import variables from "../styles/Variables";

export const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: variables.alezan,
      secondary: variables.gris,
      tertiary: variables.aubere,
      quaternary: variables.rouan,
      outline: variables.rouan,
      neutral: variables.isabelle,
      minor: variables.palomino,
      accent: variables.bai,
      secondaryContainer: variables.bai,
      text: variables.bai_brun,
      error: variables.bai_cerise, 
      background: variables.blanc,
      onSurface: variables.default,
      default_dark: variables.default_dark,
    },
    fonts: {
      default: { fontFamily: variables.fontRegular },
      bodyMedium: { fontFamily: variables.fontMedium },
      bodySmall: { fontFamily: variables.fontLight },
      bodyLarge: { fontFamily: variables.fontBold },
      labelMedium: { fontFamily: variables.fontMedium },
      labelLarge: { fontFamily: variables.fontBold },
      headlineSmall: { fontFamily: variables.fontRegular },
    },
};
  
 export const darkTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: variables.alezan,
      secondary: variables.gris,
      tertiary: variables.aubere,
      quaternary: variables.rouan,
      outline: variables.rouan,
      neutral: variables.isabelle,
      minor: variables.palomino,
      accent: variables.bai,
      secondaryContainer: variables.bai,
      text: variables.bai_brun,
      error: variables.bai_cerise, 
      background: variables.noir,
      onSurface: variables.default_dark,
      default_dark: variables.blanc,
    },
    fonts: {
      default: { fontFamily: variables.fontRegular },
      bodyMedium: { fontFamily: variables.fontMedium },
      bodySmall: { fontFamily: variables.fontLight },
      bodyLarge: { fontFamily: variables.fontBold },
      labelMedium: { fontFamily: variables.fontMedium },
      labelLarge: { fontFamily: variables.fontBold },
      headlineSmall: { fontFamily: variables.fontRegular },
    },
};

export type AppTheme = typeof lightTheme;