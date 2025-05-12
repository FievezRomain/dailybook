import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import ModalCreate from '../modals/ModalCreate';
import { useCalendar } from '../../providers/CalendarProvider';

const AddingButton = ({ navigation }) => {
    const { colors } = useTheme();
    const [isModalVisible, setModalVisible] = useState(false);

    const handleFabPress = () => {
        if (!isModalVisible) {
            setModalVisible(true);
        } else {
            setModalVisible(false);
        }
    };

    const styles = StyleSheet.create({
        fab: {
          position: 'absolute',
          right: 16,
          bottom: 90,
          backgroundColor: colors.secondaryContainer,
          borderRadius: 50,
        },
      });

    return(
        <>
        <ModalCreate
            isVisible={isModalVisible}
            setModalVisible={setModalVisible}
        />
            <FAB
                icon={isModalVisible ? "close" : "plus"}
                style={styles.fab}
                color={colors.background}
                onPress={handleFabPress}
                size="medium"
            />
        </>
    )
}

export default AddingButton;