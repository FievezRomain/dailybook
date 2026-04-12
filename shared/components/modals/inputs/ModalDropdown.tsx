import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Button from '../../inputs/Button';
import { useAppTheme } from '../../../../theme/useAppTheme';
import ModalEditGeneric from '../common/ModalEditGeneric';

interface DropdownItem {
  id: string | number;
  title: string;
  [key: string]: any;
}

interface ModalDropdownProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  list: DropdownItem[];
  setState: (item: DropdownItem | false) => void;
  state: DropdownItem | false;
  setValue: (name: string, value: any) => void;
  valueName: string;
  modalHeight?: string;
  customizable?: boolean;
}

const ModalDropdown = ({
  modalVisible,
  setModalVisible,
  list,
  setState,
  state,
  setValue,
  valueName,
  modalHeight = '40%',
  customizable = true,
}: ModalDropdownProps) => {
  const { colors, fonts } = useAppTheme();

  const checkState = (value: DropdownItem) => {
    if (state !== false) {
      return value.title === (state as DropdownItem).title;
    }
    return false;
  };

  const handleSelected = (item: DropdownItem) => {
    if (state !== false && (state as DropdownItem).title === item.title) {
      setState(false);
    } else {
      setState(item);
    }
    setValue(valueName, item.id);
  };

  const styles = StyleSheet.create({
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 20 },
    itemContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, justifyContent: 'center' },
    item: { backgroundColor: colors.quaternary, borderRadius: 5, margin: 5, padding: 10 },
    selected: { backgroundColor: colors.accent },
    disabled: { backgroundColor: colors.onSurface },
    disabledText: { color: colors.quaternary },
    title: { color: colors.background },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={modalVisible} setVisible={setModalVisible} arrayHeight={[modalHeight]}>
      <View style={styles.itemContainer}>
        {list.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => handleSelected(item)} style={[styles.item, checkState(item) ? styles.selected : null]}>
            <Text style={[styles.title, styles.textFontRegular]}>{item.title}</Text>
          </TouchableOpacity>
        ))}
        {customizable && (
          <TouchableOpacity style={[styles.item, styles.disabled]} disabled={true}>
            <Text style={[styles.title, styles.textFontRegular, styles.disabledText]}>Bientôt personnalisable...</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button disabled={false} size="l" type="primary" onPress={() => setModalVisible(!modalVisible)}>
          <Text style={styles.textFontMedium}>OK</Text>
        </Button>
      </View>
    </ModalEditGeneric>
  );
};

export default ModalDropdown;
