import { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Button from '../../../shared/components/ui/AppButton';
import AnimalsPicker from '../../../shared/components/inputs/AnimalsPicker';
import { useAppTheme } from '../../../theme/useAppTheme';
import { AppSheet } from '../../../shared/components/ui';

interface ModalSelectAnimalsProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  setAnimaux?: (v: any) => void;
  animaux: any[];
  selected: any[];
  setSelected: (v: any) => void;
  setValue: (name: string, value: any) => void;
  valueName: string;
  displayAnimalsShared?: boolean;
}

const ModalAnimals = ({ modalVisible, setModalVisible, setAnimaux, animaux, selected, setSelected, setValue, valueName, displayAnimalsShared = true }: ModalSelectAnimalsProps) => {
  const { colors, fonts } = useAppTheme();
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (modalVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [modalVisible]);

  const styles = {
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5, marginBottom: 20 },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['25%']} onDismiss={() => setModalVisible(false)}>
      <View style={{ paddingVertical: 5 }}>
        <AnimalsPicker
          animaux={animaux}
          mode="multiple"
          selected={selected}
          setSelected={setSelected}
          setValue={setValue}
          valueName={valueName}
          displayAnimalsShared={displayAnimalsShared}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button disabled={false} size="l" type="primary" onPress={() => setModalVisible(!modalVisible)}>
          <Text style={styles.textFontMedium}>OK</Text>
        </Button>
      </View>
    </AppSheet>
  );
};

export default ModalAnimals;
