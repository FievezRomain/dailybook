import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Animated, StyleSheet, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { useTheme, ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import groupServiceInstance from '../services/GroupService';
import TopTabSecondary from '../components/TopTabSecondary';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import MembersGroup from '../components/groups/MembersGroup';
import AnimalsGroup from '../components/groups/AnimalsGroup';
import ModalDefaultNoValue from '../components/modals/common/ModalDefaultNoValue';
import Button from '../components/inputs/Button';
import ModalAddAnimal from '../components/modals/groups/ModalAddAnimal';
import { useGroups } from '../providers/GroupProvider';
import Toast from 'react-native-toast-message';
import ModalAddMember from '../components/modals/groups/ModalAddMember';

const GroupDetailScreen = ( ) => {
  const { colors, fonts } = useTheme();
  const { currentUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();
  const { groups } = useGroups();
  const { groupId } = route.params;
  const [activeRubrique, setActiveRubrique] = useState(0);
  const [modalAddAnimalVisible, setModalAddAnimalVisible] = useState(false);
  const [modalAddMemberVisible, setModalAddMemberVisible] = useState(false);
  const separatorPosition = useRef(new Animated.Value(0)).current;
  const getGroupFromIdParam = ( groupId ) => {
    let index = groups.findIndex(objet => objet.id === groupId);

    if( index !== -1 ) return groups[index];
    
    return {};
  }
  const group = getGroupFromIdParam(groupId);

  useEffect(() => {
    moveSeparator(activeRubrique);
  }, [activeRubrique])

  const onRefresh = async () => {
    setRefreshing(true);
    await groupServiceInstance.refreshCache(currentUser.email);
    setRefreshing(false);
  };

  const moveSeparator = (index) => {
    Animated.timing(separatorPosition, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getUserRoleFromGroup = ( ) => {
    let arrayIndex = group.data.members.findIndex(object => object.type === "accepted");
    let index = group.data.members[arrayIndex].items.findIndex(object => object.email === currentUser.email);

    if( index !== -1 ) return group.data.members[arrayIndex].items[index].role;

    return undefined;
  }

  const onModify = () => {
    setTimeout(() => Toast.show({
      type: "success",
      position: "top",
      text1: "Modification du groupe"
    }), 350);
  }

  const renderHeader = () => (
    <>
      <View style={styles.rubriqueContainer}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={{width: "50%", alignItems: "center", justifyContent: "center", flexDirection: "row"}} onPress={() => { handleRubriqueChange(0) }}>
            <MaterialCommunityIcons name="paw" size={20} color={activeRubrique === 0 ? colors.default_dark : colors.quaternary} style={{marginRight: 5}}/>
            <Text style={[{color :activeRubrique === 0 ? colors.default_dark : colors.quaternary}, styles.textFontMedium]}>Animaux ({group.nb_animaux})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width: "50%", alignItems: "center", flexDirection: "row", justifyContent: "center"}} onPress={() => { handleRubriqueChange(1) }}>
            <MaterialIcons name="person" size={20} color={activeRubrique === 1 ? colors.default_dark : colors.quaternary} style={{marginRight: 5}}/>
            <Text style={[{color: activeRubrique === 1 ? colors.default_dark : colors.quaternary}, styles.textFontMedium]}>Membres ({group.nb_members})</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separatorFix}></View>
        <Animated.View style={[styles.separatorAnimated, { left: separatorPosition.interpolate({ inputRange: [0, 1], outputRange: ['0%', '50%'] }) }]} />
      </View>
      {getUserRoleFromGroup() === "manager" &&
        <View style={[styles.item, styles.headerRubrique]}>
            <Button
                type={"quaternary"}
                onPress={() => activeRubrique === 0 ? setModalAddAnimalVisible(true) : setModalAddMemberVisible(true)}
            >
                <Text style={[styles.textFontMedium, {color: colors.background, textAlign: "center"}]}>{activeRubrique === 0 ? "Ajouter un animal" : "Ajouter un membre" }</Text>
            </Button>
        </View>
      }
    </>
  );

  const getCurrentData = () => {
    // Si on affiche la rubrique des animaux, alors on renvoie la liste complète des animaux (ceux acceptés et ceux en attentes, pareil pour les membres)
    if (activeRubrique === 0) return group.data.animals; 
    if (activeRubrique === 1) return group.data.members;
    return [];
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {activeRubrique === 0 ? 
        <AnimalsGroup
          animals={item}
          userRole={getUserRoleFromGroup()}
          group={group}
        />
      : 
        <MembersGroup
          members={item}
          userRole={getUserRoleFromGroup()}
          group={group}
        />
      }
    </View>
  );

  const getTextNoValue = ( ) => {
    return activeRubrique === 0 ? "Aucun animal" : "Aucun membre"
  }

  const handleRubriqueChange = (index) => {
    setActiveRubrique(index);
  };

  const styles = StyleSheet.create({
    item:{
      paddingHorizontal: 20
    },
    headerRubrique:{
      paddingVertical: 20,
    },
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

  const getContent = () => {
    if (refreshing) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      );
    }

    return(
      <FlatList
          data={getCurrentData()}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.item}>
              <ModalDefaultNoValue
                  text={getTextNoValue()}
              />
            </View>
            
        }
      />
    );

  }

  

  return (
    <>
      <ModalAddAnimal
          isVisible={modalAddAnimalVisible}
          setVisible={setModalAddAnimalVisible}
          group={group}
          onModify={onModify}
      />
      <ModalAddMember
        isVisible={modalAddMemberVisible}
        setVisible={setModalAddMemberVisible}
        group={group}
        onModify={onModify}
      />
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
        <TopTabSecondary message1={"Vos"} message2={group.name}/>
          {getContent()}
      </LinearGradient>
    </>
  );
};

export default GroupDetailScreen;
