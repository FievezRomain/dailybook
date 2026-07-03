import React, { useState } from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Button from '../../ui/AppButton';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { AntDesign } from '@expo/vector-icons';
import { useAppTheme } from '../../../../theme/useAppTheme';

interface Notification {
  key: number;
  value: Date;
  reccurence: null;
}

interface ModalNotificationsProps {
  notifications: Notification[];
  setNotifications: (v: Notification[] | ((prev: Notification[]) => Notification[])) => void;
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  eventType?: string;
}

const ModalNotifications = ({ notifications, setNotifications, modalVisible, setModalVisible }: ModalNotificationsProps) => {
  const { colors, fonts } = useAppTheme();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentKey, setCurrentKey] = useState<number | undefined>();
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleAddingNotification = () => {
    const key = notifications.length > 0 ? notifications.reduce((max, p) => p.key > max ? p.key : max, notifications[0].key) + 1 : 1;
    const newNotification: Notification = { key, value: new Date(), reccurence: null };
    setNotifications((v) => [...v, newNotification]);
    setCurrentKey(key);
    setCurrentTime(newNotification.value);
    setDatePickerVisibility(true);
  };

  const handleConfirmPicker = (time: Date) => {
    const indice = notifications.findIndex((a) => a.key === currentKey);
    const updated = [...notifications];
    updated[indice] = { ...updated[indice], value: time };
    setNotifications(updated);
    setDatePickerVisibility(false);
  };

  const handleCancelPicker = () => setDatePickerVisibility(false);
  const handleDeleteNotif = (n: Notification) => setNotifications(notifications.filter((a) => a.key !== n.key));
  const handleModifNotif = (n: Notification) => { setCurrentKey(n.key); setCurrentTime(n.value); setDatePickerVisibility(true); };
  const handleReinitialiserNotifs = () => setNotifications([]);

  const NotificationManagementLine = ({ notification }: { notification: Notification }) => (
    <View style={styles.containerBadgeNotif}>
      <View style={styles.containerNotifIcon}>
        <TouchableOpacity onPress={() => handleModifNotif(notification)}>
          <Text style={styles.badgeNotif}>{notification.value.getHours() + 'h' + notification.value.getMinutes()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteNotif(notification)}>
          <AntDesign name="delete" size={22} color={colors.default_dark} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    card: { backgroundColor: 'whitesmoke', height: '90%' },
    background: { backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end', height: '100%' },
    buttonContainer: { flexDirection: 'column', alignSelf: 'center', width: '70%', justifyContent: 'space-around', marginTop: 5, marginBottom: 10 },
    titleContainer: { marginLeft: 20, width: '100%' },
    title: { fontSize: 18, paddingBottom: 5, color: colors.default_dark },
    closeButton: { paddingTop: 5, paddingRight: 10, textAlign: 'right' },
    badgeNotif: { padding: 8, textAlign: 'center', paddingLeft: 40, paddingRight: 40, borderRadius: 5, backgroundColor: colors.quaternary },
    containerBadgeNotif: { width: '50%', margin: 5, alignSelf: 'center' },
    containerNotifIcon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <>
      <DateTimePicker isVisible={isDatePickerVisible} mode="time" themeVariant="light" onCancel={handleCancelPicker} onConfirm={handleConfirmPicker} date={currentTime} display="spinner" />
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.background}>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <AntDesign name="close" size={22} color={colors.default_dark} style={styles.closeButton} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, styles.textFontBold]}>Notifications</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={true}>
              <View>{notifications.map((v) => <NotificationManagementLine key={v.key} notification={v} />)}</View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <Button type="tertiary" size="m" onPress={handleAddingNotification}><Text style={styles.textFontMedium}>Ajouter</Text></Button>
            </View>
            <View style={styles.buttonContainer}>
              <Button type="tertiary" size="m" onPress={() => setModalVisible(!modalVisible)}><Text style={styles.textFontMedium}>Valider</Text></Button>
            </View>
            <View style={styles.buttonContainer}>
              <Button type="tertiary" size="m" disabled={notifications.length === 0} onPress={handleReinitialiserNotifs}><Text style={styles.textFontMedium}>Réinitialiser</Text></Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ModalNotifications;
