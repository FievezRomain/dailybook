import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import ModalEditGeneric from "../common/ModalEditGeneric";
import Button from "../../ui/AppButton";
import { useAppTheme } from "../../../../theme/useAppTheme";

type ModalMultiSelectProps<T> = {
  visible: boolean;
  onClose: () => void;
  onChange: (item: T | false) => void;
  selected?: T | false;
  list: T[];
  labelKey?: keyof T;
  valueKey?: keyof T;
  customizable?: boolean;
  modalHeight?: string;
  renderItem?: (item: T, isSelected: boolean, onSelect: () => void) => React.ReactNode;
};

function ModalMultiSelect<T extends Record<string, any>>({
  visible,
  onClose,
  onChange,
  selected,
  list,
  labelKey = "title",
  valueKey = "id",
  customizable = true,
  modalHeight = "40%",
  renderItem,
}: ModalMultiSelectProps<T>) {
  const { colors, fonts } = useAppTheme();

  const styles = StyleSheet.create({
    itemContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 20 },
    item: { backgroundColor: colors.quaternary, borderRadius: 5, margin: 5, padding: 10 },
    selected: { backgroundColor: colors.accent },
    disabled: { backgroundColor: colors.onSurface },
    disabledText: { color: colors.quaternary },
    title: { color: colors.background },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 20, marginBottom: 20 },
  });

  const isSelected = (item: T): boolean => {
    return !!selected && (selected as unknown as any[]).some((s: T) => s[valueKey] === item[valueKey]);
  };

  return (
    <ModalEditGeneric isVisible={visible} setVisible={onClose} arrayHeight={[modalHeight]}>
      <View style={styles.itemContainer}>
        {list.map((item) => {
          const sel = isSelected(item);
          const onSelect = () => onChange(item);
          return renderItem ? (
            <React.Fragment key={String(item[valueKey])}>
              {renderItem(item, sel, onSelect)}
            </React.Fragment>
          ) : (
            <TouchableOpacity key={String(item[valueKey])} onPress={onSelect} style={[styles.item, sel && styles.selected]}>
              <Text style={[styles.title, styles.textFontRegular]}>{String(item[labelKey])}</Text>
            </TouchableOpacity>
          );
        })}
        {customizable && (
          <TouchableOpacity style={[styles.item, styles.disabled]} disabled={true}>
            <Text style={[styles.title, styles.textFontRegular, styles.disabledText]}>Bientôt personnalisable...</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button type="primary" size="l" onPress={onClose} optionalStyle={undefined} disabled={false}>
          <Text style={styles.textFontMedium}>OK</Text>
        </Button>
      </View>
    </ModalEditGeneric>
  );
}

export default ModalMultiSelect;
