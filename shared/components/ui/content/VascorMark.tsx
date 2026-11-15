import { Image, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import { componentTokens } from '../../../../theme/componentTokens';
import { useAppTheme } from '../../../../theme/useAppTheme';

export interface VascorMarkProps {
  progress: number;
  size?: keyof typeof componentTokens.vascor.markSize;
  style?: AnimatedStyle<ViewStyle>;
  fillStyle?: AnimatedStyle<ViewStyle>;
}

export function VascorMark({
  progress,
  size = 'compact',
  style,
  fillStyle,
}: VascorMarkProps) {
  const { colors } = useAppTheme();
  const dimension = componentTokens.vascor.markSize[size];
  const strokeWidth = componentTokens.vascor.gaugeWidth[size];
  const inset = componentTokens.vascor.markInset[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedProgress = Math.min(1, Math.max(0, progress));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width: dimension,
          height: dimension,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Svg
        width={dimension}
        height={dimension}
        pointerEvents="none"
        style={{ position: 'absolute' }}
      >
        <Circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={colors.border}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={colors.vascorCoin}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - normalizedProgress)}
          strokeLinecap="round"
          transform={`rotate(-90 ${dimension / 2} ${dimension / 2})`}
        />
      </Svg>
      <Animated.View
        style={[
          {
            width: dimension - inset * 2,
            height: dimension - inset * 2,
            borderRadius: dimension,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.vascorCoin,
          },
          fillStyle,
        ]}
      >
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          pointerEvents="none"
        >
          <Defs>
            <LinearGradient id="vascor-rim" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.vascorCoinHighlight} stopOpacity="0.75" />
              <Stop offset="0.38" stopColor={colors.vascorCoinLight} stopOpacity="0.18" />
              <Stop offset="0.72" stopColor={colors.vascorCoinDark} stopOpacity="0.32" />
              <Stop offset="1" stopColor={colors.vascorCoinShadow} stopOpacity="0.52" />
            </LinearGradient>
            <RadialGradient id="vascor-face" cx="0.36" cy="0.3" rx="0.82" ry="0.82">
              <Stop offset="0" stopColor={colors.vascorCoinHighlight} stopOpacity="0.62" />
              <Stop offset="0.42" stopColor={colors.vascorCoinLight} stopOpacity="0.16" />
              <Stop offset="0.78" stopColor={colors.vascorCoinDark} stopOpacity="0.2" />
              <Stop offset="1" stopColor={colors.vascorCoinShadow} stopOpacity="0.38" />
            </RadialGradient>
          </Defs>
          <Circle
            cx="12"
            cy="12"
            r="10.55"
            fill="url(#vascor-rim)"
            stroke={colors.vascorCoinShadow}
            strokeWidth="1.05"
          />
          <Circle
            cx="12"
            cy="12"
            r="8.7"
            fill="url(#vascor-face)"
            stroke={colors.vascorCoinDark}
            strokeWidth="0.65"
          />
          <Circle
            cx="11.75"
            cy="11.75"
            r="6.45"
            fill="none"
            stroke={colors.vascorCoinLight}
            strokeWidth="0.45"
            opacity={0.7}
          />
          <Path
            d="M3.8 8.25A9.1 9.1 0 0 1 8.25 3.8"
            fill="none"
            stroke={colors.vascorCoinHighlight}
            strokeWidth="1.15"
            strokeLinecap="round"
            opacity={0.9}
          />
          <Path
            d="M20.2 15.75a9.1 9.1 0 0 1-4.45 4.45"
            fill="none"
            stroke={colors.vascorCoinShadow}
            strokeWidth="1.15"
            strokeLinecap="round"
            opacity={0.72}
          />
          <Path
            d="M4.8 11.1c.55-1.05 1.35-1.45 2.3-1.15.7.2 1.15.75 1.05 1.4-.15.85-1.05 1.35-2.15 1.2-.8-.1-1.25-.55-1.2-1.45Z"
            fill={colors.vascorCoinRust}
            opacity={0.3}
          />
          <Path
            d="M14.75 4.65c1.2.05 2.05.55 2.35 1.4.2.65-.05 1.25-.65 1.45-.8.3-1.65-.25-2.05-1.2-.3-.7-.2-1.25.35-1.65Z"
            fill={colors.vascorCoinPatina}
            opacity={0.22}
          />
          <Path
            d="M14.2 16.25c1-.6 1.95-.6 2.6 0 .5.45.55 1.05.1 1.5-.6.6-1.6.45-2.3-.3-.55-.55-.7-1.05-.4-1.2Z"
            fill={colors.vascorCoinRust}
            opacity={0.26}
          />
        </Svg>
        <Image
          accessibilityIgnoresInvertColors
          source={require('../../../../assets/logo.png')}
          resizeMode="contain"
          tintColor={colors.vascorCoinShadow}
          style={{
            position: 'absolute',
            width: '58%',
            height: '70%',
            opacity: 0.72,
            transform: [{ translateX: -0.35 }, { translateY: -0.35 }],
          }}
        />
        <Image
          accessibilityIgnoresInvertColors
          source={require('../../../../assets/logo.png')}
          resizeMode="contain"
          tintColor={colors.vascorCoinHighlight}
          style={{
            position: 'absolute',
            width: '58%',
            height: '70%',
            opacity: 0.34,
            transform: [{ translateX: 0.4 }, { translateY: 0.4 }],
          }}
        />
      </Animated.View>
    </Animated.View>
  );
}
