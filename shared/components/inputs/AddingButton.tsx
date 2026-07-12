import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModalCreate from '../modals/ModalCreate';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { AppNavigationProp } from '../../../navigation/types';

interface AddingButtonProps {
  navigation?: unknown;
}

const AddingButton: React.FC<AddingButtonProps> = () => {
  const { colors, tokens } = useAppTheme();
  const navigation = useNavigation<AppNavigationProp>();
  const insets = useSafeAreaInsets();
  const [isModalVisible, setModalVisible] = useState(false);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  useEffect(() => {
    rotation.value = withSpring(isModalVisible ? 45 : 0, { stiffness: 260, damping: 20 });
  }, [isModalVisible, rotation]);

  const handleFabPress = () => setModalVisible(!isModalVisible);
  const onPressIn = () => { scale.value = withSpring(0.92, { stiffness: 300, damping: 20 }); };
  const onPressOut = () => { scale.value = withSpring(1, { stiffness: 300, damping: 20 }); };

  return (
    <>
      <ModalCreate navigation={navigation} isVisible={isModalVisible} setModalVisible={setModalVisible} />
      <Animated.View style={[styles.fab, animStyle, { backgroundColor: colors.primary, bottom: insets.bottom + 76 }]}>
        <TouchableOpacity
          testID="fab-add-event"
          onPress={handleFabPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.fabInner}
          accessibilityLabel={isModalVisible ? 'Fermer le menu de création' : 'Créer'}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="plus"
            size={26}
            color={colors.background}
          />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddingButton;
