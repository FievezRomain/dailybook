import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TabParamList } from './types';
import { WelcomeScreen, PetsScreen, CalendarScreen, StatsScreen, OtherScreen } from './screens';
import { useAppTheme } from '../theme/useAppTheme';

const Tab = createBottomTabNavigator<TabParamList>();

// ---------------------------------------------------------------------------
// Tab item definition
// ---------------------------------------------------------------------------
type TabIcon = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface TabItemConfig {
  name: keyof TabParamList;
  label: string;
  icon: TabIcon;
  iconFocused: TabIcon;
}

const TAB_ITEMS: TabItemConfig[] = [
  { name: 'Accueil',      label: 'Accueil',       icon: 'home-outline',      iconFocused: 'home' },
  { name: 'Performance',  label: 'Performances',  icon: 'chart-bar',         iconFocused: 'chart-bar' },
  { name: 'Calendrier',   label: 'Calendrier',    icon: 'calendar-outline',  iconFocused: 'calendar' },
  { name: 'Animaux',      label: 'Animaux',       icon: 'paw-outline',       iconFocused: 'paw' },
  { name: 'Autre',        label: 'Plus',          icon: 'menu',              iconFocused: 'menu' },
];

// ---------------------------------------------------------------------------
// Single tab item with spring animation
// ---------------------------------------------------------------------------
interface TabItemProps {
  config: TabItemConfig;
  focused: boolean;
  onPress: () => void;
}

function TabItem({ config, focused, onPress }: TabItemProps) {
  const { colors, tokens } = useAppTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.88, { damping: 15, stiffness: 300 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 12, stiffness: 200 }); };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel={config.label}
      accessibilityState={{ selected: focused }}
    >
      <Animated.View style={[styles.tabItemInner, animStyle]}>
        {focused && (
          <View style={[styles.indicator, { backgroundColor: colors.primary }]} />
        )}
        <MaterialCommunityIcons
          name={focused ? config.iconFocused : config.icon}
          size={24}
          color={focused ? colors.primary : colors.textSecondary}
        />
        <Text
          style={[
            styles.label,
            {
              color: focused ? colors.primary : colors.textSecondary,
              fontFamily: tokens.fonts.medium,
            },
          ]}
          numberOfLines={1}
        >
          {config.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Custom blur tab bar
// ---------------------------------------------------------------------------
function BlurTabBar({ navigation, state, insets }: BottomTabBarProps) {
  const { colors, tokens, isDark } = useAppTheme();
  const safeInsets = useSafeAreaInsets();
  const bottomPad = Math.max(safeInsets.bottom, insets.bottom ?? 0);

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: bottomPad }]}>
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={tokens.blur.tabBar}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? colors.background : colors.surface }]} />
      )}
      <View style={[styles.separator, { backgroundColor: colors.border }]} />
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const config = TAB_ITEMS[index];
          if (!config) return null;

          return (
            <TabItem
              key={route.key}
              config={config}
              focused={focused}
              onPress={() =>
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                })
              }
            />
          );
        })}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// TabStack
// ---------------------------------------------------------------------------
export default function TabStack() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BlurTabBar {...props} />}
    >
      <Tab.Screen name="Accueil"     component={WelcomeScreen}  options={{ tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="Performance" component={StatsScreen}    options={{ tabBarLabel: 'Performances' }} />
      <Tab.Screen name="Calendrier"  component={CalendarScreen} options={{ tabBarLabel: 'Calendrier' }} />
      <Tab.Screen name="Animaux"     component={PetsScreen}     options={{ tabBarLabel: 'Animaux' }} />
      <Tab.Screen name="Autre"       component={OtherScreen}    options={{ tabBarLabel: 'Plus' }} />
    </Tab.Navigator>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  tabRow: {
    flexDirection: 'row',
    height: 60,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  indicator: {
    position: 'absolute',
    top: -28,
    height: 2,
    width: 24,
    borderRadius: 1,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.1,
  },
});
