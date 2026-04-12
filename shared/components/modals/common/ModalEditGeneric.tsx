import React, { useState, useCallback, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Portal } from 'react-native-paper';
import BottomSheet, { BottomSheetScrollView, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import { Easing } from 'react-native-reanimated';
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

  React.useEffect(() => {
    if (!isVisible) {
      handlePressOverModal();
    } else {
      setOpen(true);
    }
  }, [isVisible]);

  const handlePressOverModal = useCallback(() => {
    bottomSheet?.current?.close();
    setTimeout(() => setOpen(false), 150);
  }, []);

  const styles = StyleSheet.create({
    contentContainer: { flex: 1 },
  });

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 200,
    easing: Easing.sin,
  });

  if (!isVisible && !isOpen) return null;

  return (
    <Portal>
      <Portal><Toast /></Portal>
      <View style={{ height: '100%', width: '100%' }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={handlePressOverModal} />
        <BottomSheet
          ref={bottomSheet}
          snapPoints={arrayHeight}
          index={arrayHeight.length - 1}
          enableDynamicSizing={false}
          containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          enablePanDownToClose={true}
          enableOverDrag={true}
          enableContentPanningGesture={scrollInside}
          animationConfigs={animationConfigs}
          onClose={() => setVisible(false)}
          handleStyle={handleStyle ?? undefined}
          handleIndicatorStyle={handleIndicatorStyle ?? undefined}
          backgroundStyle={{ backgroundColor: colors.background }}
        >
          <BottomSheetScrollView style={styles.contentContainer}>
            {children}
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </Portal>
  );
};

export default ModalEditGeneric;
