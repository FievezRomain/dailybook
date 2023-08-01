import { NavigationContainer } from '@react-navigation/native';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import plus from '../assets/plus.png'
import { FontAwesome5 } from '@expo/vector-icons'
import { useRef } from 'react';

const Tab = createBottomTabNavigator();


const BottomTabNavigator = () => {
    const tabOffsetValue = useRef(new Animated.Value(0)).current;
    return (
      <>
        <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Home'){
              return <View style={{
                // centring Tab Button...
                position: 'absolute',
                top: 15
              }}>
                <FontAwesome5
                  name="home"
                  size={20}
                  color={focused ? '#956540' : 'gray'}
                ></FontAwesome5>
              </View>
            } else if(route.name === 'Statistic'){
              return <View style={{
                // centring Tab Button...
                position: 'absolute',
                top: 15
              }}>
                <FontAwesome5
                  name="signal"
                  size={20}
                  color={focused ? '#956540' : 'gray'}
                ></FontAwesome5>
              </View>
            } else if(route.name === 'ActionButton'){
              return <View style={{
                width: 55,
                height: 55,
                backgroundColor: 'white',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS == "android" ? 50 : 30
              }}>
                <Image source={plus} style={{
                  width: 35,
                  height: 35,
                  tintColor: '#956540',
                }}></Image>
              </View>
            } else if (route.name === 'Calendar'){
              return <View style={{
                // centring Tab Button...
                position: 'absolute',
                top: 15
              }}>
                <FontAwesome5
                  name="calendar-alt"
                  size={20}
                  color={focused ? '#956540' : 'gray'}
                ></FontAwesome5>
              </View>
            } else if (route.name === 'Pets'){
              return <View style={{
                // centring Tab Button...
                position: 'absolute',
                top: 15
              }}>
                <FontAwesome5
                  name="paw"
                  size={20}
                  color={focused ? '#956540' : 'gray'}
                ></FontAwesome5>
              </View>
            }
          },
          tabBarShowLabel: false,
          headerShown: false,
          //Floating Tab Bar...
          style: {
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 40,
            marginHorizontal: 20,
            // Max Height...
            height: 60,
            borderRadius: 10,
            // Shadow...
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowOffset: {
              width: 10,
              height: 10
            },
            paddingHorizontal: 20,
          }
        })}>
  
          <Tab.Screen name={"Home"} component={HomeScreen} listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true
              }).start();
            }
          })}/>
  
          <Tab.Screen name={"Statistic"} component={StatsScreen} listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth(),
                useNativeDriver: true
              }).start();
            }
          })}/>
  
          <Tab.Screen name={"ActionButton"} component={ActionScreen} listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: -100,
                useNativeDriver: true
              }).start();
            }
          })}/>
  
          <Tab.Screen name={"Calendar"} component={CalendarScreen} listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 3,
                useNativeDriver: true
              }).start();
            }
          })}/>
  
          <Tab.Screen name={"Pets"} component={PetsScreen} listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 4,
                useNativeDriver: true
              }).start();
            }
          })}/>

  
        </Tab.Navigator>
  
        <Animated.View style={{
          width: getWidth() - 15,
          height: 2,
          backgroundColor: 'brown',
          position: 'absolute',
          bottom: 5,
          // Horizontal Padding = 20...
          left: 10,
          borderRadius: 20,
          transform: [
            { translateX: tabOffsetValue }
          ]
        }}>
  
        </Animated.View>
      </>
    );
}


function getWidth() {
    let width = Dimensions.get("window").width
  
    // Horizontal Padding = 20...
    width = width - 5
  
    // Total five Tabs...
    return width / 5
}
  
const ActionScreen = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#c9b69f' }}>
        <Text>Action!</Text>
      </View>
    );
}
  
const PetsScreen = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#c9b69f' }}>
        <Text>Pets!</Text>
      </View>
    );
}
  
const HomeScreen = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#c9b69f' }}>
        <Text>Home!</Text>
      </View>
    );
}
  
const CalendarScreen = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#c9b69f' }}>
        <Text>Calendar!</Text>
      </View>
    );
}
  
const StatsScreen = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#c9b69f' }}>
        <Text>Statistic!</Text>
      </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#c9b69f',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default BottomTabNavigator;