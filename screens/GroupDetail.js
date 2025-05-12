import React, { useState, useRef } from 'react';
import { View, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import groupServiceInstance from '../services/GroupService';
import TopTabSecondary from '../components/TopTabSecondary';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const GroupDetailScreen = ( ) => {
  const { colors, fonts } = useTheme();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { group } = route.params;
  const [activeRubrique, setActiveRubrique] = useState(0);
  const separatorPosition = useRef(new Animated.Value(0)).current;

  const onRefresh = () => {
    setRefreshing(true);
    groupServiceInstance.refreshCache(currentUser.email);
  };

  const moveSeparator = (index) => {
    Animated.timing(separatorPosition, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const styles = StyleSheet.create({
    iconsContainer:{
      display: "flex", 
      flexDirection: "row", 
      paddingVertical: 10
    },
    rubriqueContainer:{
      marginTop: 10,
      marginBottom: 10,
    },
    separatorFix:{
      borderTopColor: colors.quaternary, 
      borderTopWidth: 0.4, 
      position: 'absolute', 
      bottom: 0, 
      height: 2, 
      width: "100%"
    },
    textFontBold:{
      fontFamily: fonts.labelLarge.fontFamily
    },
    textFontRegular:{
      fontFamily: fonts.default.fontFamily
    },
    textFontMedium:{
      fontFamily: fonts.labelMedium.fontFamily
    },
    separatorAnimated:{
      height: 3, 
      backgroundColor: colors.default_dark, 
      position: 'absolute', 
      bottom: 0, 
      width: '50%',
    },
  
  });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <>
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
        <TopTabSecondary message1={"Vos"} message2={group.name}/>
        <View>
          <View style={styles.rubriqueContainer}>
            <View style={styles.iconsContainer}>
              <TouchableOpacity style={{width: "50%", alignItems: "center", justifyContent: "center", flexDirection: "row"}} onPress={() => { setActiveRubrique(0); moveSeparator(0); }}>
                <MaterialCommunityIcons name="paw" size={20} color={activeRubrique === 0 ? colors.default_dark : colors.quaternary} style={{marginRight: 5}}/>
                <Text style={[{color :activeRubrique === 0 ? colors.default_dark : colors.quaternary}, styles.textFontMedium]}>Animaux</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{width: "50%", alignItems: "center", flexDirection: "row", justifyContent: "center"}} onPress={() => { setActiveRubrique(1); moveSeparator(1); }}>
                <MaterialIcons name="person" size={20} color={activeRubrique === 1 ? colors.default_dark : colors.quaternary} style={{marginRight: 5}}/>
                <Text style={[{color: activeRubrique === 1 ? colors.default_dark : colors.quaternary}, styles.textFontMedium]}>Membres</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.separatorFix}></View>
            <Animated.View style={[styles.separatorAnimated, { left: separatorPosition.interpolate({ inputRange: [0, 1], outputRange: ['0%', '50%'] }) }]} />
          </View>

        </View>
      </LinearGradient>
    </>
  );
};

export default GroupDetailScreen;
