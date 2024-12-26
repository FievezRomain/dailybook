import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { BottomNavigation, IconButton, useTheme, Text as PaperText } from 'react-native-paper';
import { WelcomeScreen, PetsScreen, CalendarScreen, StatsScreen, OtherScreen } from "../screens";
import { View, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';

const Tab = createBottomTabNavigator();

export default function TabStack() {
  const { colors } = useTheme();

  return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Cacher les en-têtes
        }}
        tabBar={({ navigation, state, descriptors, insets }) => (
          <BottomNavigation.Bar
            navigationState={state}
            safeAreaInsets={insets}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return (
                  <View style={{marginTop: -5}}>
                    {options.tabBarIcon && options.tabBarIcon({ focused,
                      color: focused ? colors.secondaryContainer : colors.default_dark,
                      size: focused ? 28 : 24, })}
                  </View>
                )
              }
              return null;
            }}
            renderLabel={({ route, focused }) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title || route.name;
  
              return (
                <Text style={[styles.label, { color: focused ? colors.accent : colors.default_dark, marginTop: -10 }]}>
                  {label}
                </Text>
              );
            }}
            style={{
              height: Constants.platform.ios ? 80 : 70,
              backgroundColor: colors.background,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 8,
            }}
            activeColor={colors.accent}
            inactiveColor={colors.text}
            activeIndicatorStyle={{
              backgroundColor: colors.accent,
              height: 2,
              marginBottom: 55,
            }}
          />
        )}
      >
        <Tab.Screen
          name="Accueil"
          component={WelcomeScreen}
          options={{
            tabBarLabel: 'Accueil',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <IconButton icon="home" iconColor={color} size={size} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Performance"
          component={StatsScreen}
          options={{
            tabBarLabel: 'Performance',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <IconButton icon="chart-bar" iconColor={color} size={size} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Calendrier"
          component={CalendarScreen}
          options={{
            tabBarLabel: 'Calendrier',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <IconButton icon="calendar" iconColor={color} size={size} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Animaux"
          component={PetsScreen}
          options={{
            tabBarLabel: 'Animaux',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <IconButton icon="paw" iconColor={color} size={size} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Autre"
          component={OtherScreen}
          options={{
            tabBarLabel: 'Autre',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <IconButton icon="menu" iconColor={color} size={size} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  label: {
    fontSize: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
