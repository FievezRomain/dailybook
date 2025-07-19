import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import TopTabSecondary from '../components/common/TopTabSecondary';
import { useCallback, useEffect, useState } from 'react';
import ModalDefaultNoValue from '../components/modals/common/ModalDefaultNoValue';
import notificationServiceInstance from '../services/api/NotificationService';
import groupServiceInstance from '../services/api/GroupService';
import instanceDateUtils from '../utils/DateUtils';
import { useFocusEffect } from '@react-navigation/native';
import { setBadgeCountAsync } from 'expo-notifications';

const NotificationScreen = ( ) => {
    const { colors, fonts } = useTheme();
    const [ refreshing, setRefreshing ] = useState(true);
    const [ notifications, setNotifications ] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await notificationServiceInstance.getNotifications();
            setNotifications(response.data.notifications);

            await notificationServiceInstance.readAll();
        } catch (error) {
            console.error("Erreur lors du chargement des notifications", error);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
          // Quand l'écran devient actif
          const fetchNotificationsOnFocus = async () => {
            try{
                await fetchNotifications();
            }catch(error){
                console.error('Erreur lors de la mise à jour des notifications : ', err);
            }
          }
          const resetBadge = async () => {
            try {
              await setBadgeCountAsync(0);
            } catch (err) {
              console.warn('Erreur lors de la remise à zéro du badge :', err);
            }
          };
    
          fetchNotificationsOnFocus();
          resetBadge();
    
          // Pas besoin de return pour cleanup ici, sauf si tu ajoutes des listeners
        }, [])
    );
    
    
    
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
    };

    const acceptInvitation = async ( item ) => {
        let data = {};
        data.status = "accepted";
        data.id = item.object_id;

        if( item.type === 'group_member'){
            await groupServiceInstance.respondInvitation(data);
        }
        if( item.type === 'group_animal'){
            await groupServiceInstance.respondAnimal(data);
        }

        await onRefresh();
    }

    const refuseInvitation = async ( item ) => {
        let data = {};
        data.status = "declined";
        data.id = item.object_id;
        
        if( item.type === 'group_member'){
            await groupServiceInstance.respondInvitation(data);
        }
        if( item.type === 'group_animal'){
            await groupServiceInstance.respondAnimal(data);
        }
        
        await onRefresh();
    }

    const styles = StyleSheet.create({
        container:{
            paddingHorizontal: 20
        },
        card:{
            borderRadius: 5, 
            shadowColor: colors.default_dark, 
            shadowOpacity: 0.1, 
            elevation: 1, 
            shadowRadius:5, 
            shadowOffset:{width:0, height:2}, 
            padding: 20,
            marginBottom: 10
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily,
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily,
        },
        textFontSmall:{
            fontFamily: fonts.bodySmall.fontFamily
        },
        textColor:{
            color: colors.default_dark
        }
    });

    const renderItem = ({ item }) => {
        return(
            <>
                <View style={[styles.card, {backgroundColor: item.is_read ? colors.background : colors.quaternary}]}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <View style={{width: "80%"}}>
                            <Text style={[styles.textFontBold, styles.textColor]}>{item.title}</Text>
                            <Text style={[styles.textFontRegular, styles.textColor]}>{item.message}</Text>
                        </View>
                        <View style={{flexDirection: "row", width: "20%", justifyContent: "space-between"}}>
                            {item.action_available &&
                                <>
                                    {refreshing ?
                                        <ActivityIndicator animating={true} size="small" />
                                    :
                                        <>
                                            <TouchableOpacity onPress={() => refuseInvitation( item )}>
                                                <Icon source={"close"} size={30} color={colors.error} />
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity onPress={() => acceptInvitation( item )}>
                                                <Icon source={"check"} size={30} color={colors.accent} />
                                            </TouchableOpacity>
                                        </>
                                    }
                                </>
                            }
                        </View>
                    </View>
                    <View style={{paddingTop: 10}}>
                        <Text style={[styles.textFontSmall, {fontSize: 11}, styles.textColor]}>{instanceDateUtils.transformTimestampToDate(item.created_at)}{item.proposed_by && " - " + item.proposed_by}</Text>
                    </View>
                </View>
            </>
        );
    }

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
                data={notifications}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{paddingTop: 10, paddingHorizontal: 20}}
                renderItem={renderItem}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
                ListEmptyComponent={
                    <ModalDefaultNoValue
                        text={"Vous n'avez aucune notification"}
                    />
              }
            />
        );
    }

    return(
        <>
            <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
                <TopTabSecondary message1={"Vos"} message2={"Notifications"}/>
                {getContent()}
            </LinearGradient>
        </>
    )
}

export default NotificationScreen;