import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ModalCreate from '../modals/ModalCreate';
import { useAppTheme } from '../../../theme/useAppTheme';

interface AddingButtonProps {
  navigation?: unknown;
}

const AddingButton: React.FC<AddingButtonProps> = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleFabPress = () => {
    setModalVisible(!isModalVisible);
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

  return (
    <>
      <ModalCreate navigation={navigation} isVisible={isModalVisible} setModalVisible={setModalVisible} />
      <FAB
        icon={isModalVisible ? 'close' : 'plus'}
        style={styles.fab}
        color={colors.background}
        onPress={handleFabPress}
        size="medium"
      />
    </>
  );
};

export default AddingButton;
