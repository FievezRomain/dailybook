import { Animated, Dimensions, Image, Platform, Text, View } from 'react-native';
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import plus from '../assets/plus.png'
import { FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useRef } from 'react';
import { WelcomeScreen, PetsScreen, ActionScreen, CalendarScreen, StatsScreen } from "../screens";
import { MotiView } from 'moti';
import Variables from '../components/styles/Variables';
import variables from '../components/styles/Variables';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);
  const [beforeScreen, setBeforeScreen] = useState("Welcome");
  const insets = useSafeAreaInsets();
  return (
        <View style={{flex: 1}}>
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Welcome'){
              return <View style={{
                // centring Tab Button...
              }}>
                <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center"}}>
                  <Ionicons
                    name="home"
                    size={20}
                    color={focused ? variables.alezan : 'gray'}
                  ></Ionicons>
                  <Text style={{fontSize: 11, paddingTop: 5, color: focused ? variables.alezan : 'gray', fontFamily: variables.fontRegular}}>Accueil</Text>
                </View>
              </View>
            } else if(route.name === 'Statistic'){
              return <View style={{
                // centring Tab Button...
              }}>
                <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center"}}>
                  <FontAwesome6
                    name="signal"
                    size={20}
                    color={focused ? variables.alezan : 'gray'}
                  ></FontAwesome6>
                  <Text style={{fontSize: 11, paddingTop: 5, color: focused ? variables.alezan : 'gray', fontFamily: variables.fontRegular}}>Performance</Text>
                </View>
                
              </View>
            } else if(route.name === 'ActionButton'){
              return <><MotiView
                style={{
                  width: 45,
                  height: 45,
                  backgroundColor: 'white',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: Platform.OS == "android" ? 30 : 30,
                  shadowColor: "black",
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  shadowOffset:{width:0, height: -1}
                }}
                animate={{
                  scale: expanded ? 1.2 : 1,
                  rotate: expanded ? '135deg' : '0deg',
                }}
                transition={{
                  duration: 200,
                  type: 'timing',
                }}>
                <Image source={plus} style={{
                  width: 45,
                  height: 45,
                  tintColor: expanded ? Variables.souris : Variables.alezan,
                  zIndex: 1
                }}></Image>
              </MotiView>
                </>
            } else if (route.name === 'Calendar'){
              return <View style={{
                // centring Tab Button...
                
              }}>
                <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center"}}>
                  <FontAwesome6
                    name="calendar-alt"
                    size={20}
                    color={focused ? variables.alezan : 'gray'}
                  ></FontAwesome6>
                  <Text style={{fontSize: 11, paddingTop: 5, color: focused ? variables.alezan : 'gray', fontFamily: variables.fontRegular}}>Calendrier</Text>
                </View>
              </View>
            } else if (route.name === 'Pets'){
              return <View style={{
                // centring Tab Button...
              }}>
                <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center"}}>
                  <FontAwesome6
                    name="paw"
                    size={20}
                    color={focused ? variables.alezan : 'gray'}
                  ></FontAwesome6>
                  <Text style={{fontSize: 11, paddingTop: 5, color: focused ? variables.alezan : 'gray', fontFamily: variables.fontRegular}}>Animaux</Text>
                </View>
              </View>
            }
          },
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle:{
            shadowColor: "black",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            shadowOffset:
            {
              width: 0,
              height:-1
            },
          }
        })}>
  
          <Tab.Screen name={"Welcome"} component={WelcomeScreen} listeners={({ navigation, route }) => ({
            // Onpress Update....
            focus: e => {
              setExpanded(false);
              setBeforeScreen(route.name);
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true
              }).start();
            }
          })}/>
  
          <Tab.Screen name={"Statistic"} component={StatsScreen} listeners={({ navigation, route }) => ({
            // Onpress Update....
            focus: e => {
              setExpanded(false);
              setBeforeScreen(route.name);
              Animated.spring(tabOffsetValue, {
                toValue: getWidth(),
                useNativeDriver: true
              }).start();
            }
          })}/>
  
          <Tab.Screen name={"ActionButton"} component={ActionScreen} listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: e => {
              if (expanded){
                navigation.navigate(beforeScreen);
              }
              setExpanded(!expanded);
              Animated.spring(tabOffsetValue, {
                toValue: -100,
                useNativeDriver: true
              }).start();
            }
          })}/>
  
          <Tab.Screen name={"Calendar"} component={CalendarScreen} listeners={({ navigation, route }) => ({
            // Onpress Update....
            focus: e => {
              setExpanded(false);
              setBeforeScreen(route.name);
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 3,
                useNativeDriver: true
              }).start();
            }
          })}/>
  
          <Tab.Screen name={"Pets"} component={PetsScreen} listeners={({ navigation, route }) => ({
            // Onpress Update....
            focus: e => {
              setExpanded(false);
              setBeforeScreen(route.name);
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 4,
                useNativeDriver: true
              }).start();
            }
          })}/>

        {/* <Tab.Screen name={"Settings"} component={SettingsScreen} 
            options={{
                tabBarItemStyle:{display: "none"}
            }}
            listeners={({ navigation, route }) =>({
                tabPress: e => {
                    setMessages({message1: "Mes", message2: "animaux"});
                    Animated.spring(tabOffsetValue, {
                        toValue: -100,
                        useNativeDriver: true
                    }).start();
                }
            })}
        /> */}
  
        </Tab.Navigator>
  
        <Animated.View style={{
          width: getWidth() - 15,
          //height: 2,
          backgroundColor: Variables.alezan,
          position: 'absolute',
          // bottom: (667 / (Dimensions.get("window").height / 10)) *5,
          // Horizontal Padding = 20...
          left: 10,
          borderRadius: 20,
          transform: [
            { translateX: tabOffsetValue }
          ]
        }}>
  
        </Animated.View>
        </View>
  );
};

function getWidth() {
  let width = Dimensions.get("window").width

  // Horizontal Padding = 20...
  width = width - 5

  // Total five Tabs...
  return width / 5
}

export default TabStack;