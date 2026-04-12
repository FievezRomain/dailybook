import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Button from '../../../shared/components/inputs/Button';
import AnimalsPicker from '../../../shared/components/inputs/AnimalsPicker';
import { useTheme } from 'react-native-paper';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';

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
  const { colors, fonts } = useTheme();

  const styles = StyleSheet.create({
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5, marginBottom: 20 },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={modalVisible} setVisible={setModalVisible} scrollInside={false} arrayHeight={['25%']}>
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
    </ModalEditGeneric>
  );
};

export default ModalAnimals;
