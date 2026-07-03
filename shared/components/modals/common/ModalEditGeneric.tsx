import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import BottomSheet, { BottomSheetScrollView, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '../../../../theme/useAppTheme';

interface ModalEditGenericProps {
  children: React.ReactNode;
  arrayHeight: string[];
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
  scrollInside?: boolean;
  handleStyle?: object;
  handleIndicatorStyle?: object;
}

const ModalEditGeneric = ({
  children,
  arrayHeight,
  isVisible,
  setVisible,
  scrollInside = true,
  handleStyle,
  handleIndicatorStyle,
}: ModalEditGenericProps) => {
  const bottomSheet = useRef<any>(null);
  const [isOpen, setOpen] = useState(false);
  const { colors } = useAppTheme();

  const snapPoints = useMemo(() => arrayHeight, [arrayHeight.join('|')]);

  const handlePressOverModal = useCallback(() => {
    bottomSheet.current?.close();
    setTimeout(() => setOpen(false), 80);
  }, []);

  React.useEffect(() => {
    if (!isVisible) {
      handlePressOverModal();
    } else {
      setOpen((open) => (open ? open : true));
    }
  }, [handlePressOverModal, isVisible]);

  const styles = StyleSheet.create({
    contentContainer: { flex: 1 },
  });

  const animationConfigs = useBottomSheetSpringConfigs({
    stiffness: 220,
    damping: 28,
    mass: 1,
    overshootClamping: false,
  });

  if (!isVisible && !isOpen) return null;

  return (
    <Modal transparent statusBarTranslucent animationType="none" visible={isVisible || isOpen}>
      <Toast />
      <View style={{ height: '100%', width: '100%' }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={handlePressOverModal} />
        <BottomSheet
          ref={bottomSheet}
          snapPoints={snapPoints}
          index={snapPoints.length - 1}
          enableDynamicSizing={false}
          containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          enablePanDownToClose={true}
          enableOverDrag={true}
          enableContentPanningGesture={scrollInside}
          animationConfigs={animationConfigs}
          onClose={() => {
            if (isVisible) setVisible(false);
          }}
          handleStyle={handleStyle ?? undefined}
          handleIndicatorStyle={handleIndicatorStyle ?? undefined}
          backgroundStyle={{ backgroundColor: colors.background }}
        >
          <BottomSheetScrollView style={styles.contentContainer}>
            {children}
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </Modal>
  );
};

export default ModalEditGeneric;
