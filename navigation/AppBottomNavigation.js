import React, { useState } from 'react';
import { BottomNavigation, useTheme, Icon } from 'react-native-paper';
import { WelcomeScreen, PetsScreen, CalendarScreen, StatsScreen, SettingsScreen } from "../screens";
import { View, StyleSheet } from 'react-native';

const AppBottomNavigation = ({ navigation }) => {
  const { colors, fonts } = useTheme();
  const [index, setIndex] = useState(0);

  // Définis les routes pour chaque onglet
  const [routes] = useState([
    { key: 'welcome', title: 'Accueil', unfocusedIcon: 'home', focusedIcon: 'home'},
    { key: 'stats', title: 'Performance', unfocusedIcon: 'chart-bar', focusedIcon: 'chart-bar'},
    { key: 'calendar', title: 'Calendrier', unfocusedIcon: 'calendar', focusedIcon: 'calendar'},
    { key: 'pets', title: 'Animaux', unfocusedIcon: 'paw', focusedIcon: 'paw'},
    { key: 'profil', title: 'Profil', unfocusedIcon: 'account', focusedIcon:'account' },
  ]);

  // Définis une fonction pour rendre les scènes en fonction de la route active
  const renderScene = BottomNavigation.SceneMap({
    welcome: () => <WelcomeScreen navigation={navigation} />,
    stats: () => <StatsScreen navigation={navigation} />,
    calendar: () => <CalendarScreen navigation={navigation} />,
    pets: () => <PetsScreen navigation={navigation} />,
    profil: () => <SettingsScreen navigation={navigation} />,
  });

  return (
    <>
    
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{
          height: 90,
          backgroundColor: colors.background,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 8,
        }}
        activeColor={colors.accent}
        inactiveColor={colors.text}
        activeIndicatorStyle={{
          backgroundColor: colors.accent,
          height: 2,
          marginBottom: 55
        }}
      />
    </>
  );
};

export default AppBottomNavigation;
