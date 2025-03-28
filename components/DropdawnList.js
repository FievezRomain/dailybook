import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from 'react-native-paper';

  const DropdawnList = ({setValue, value, list}) => {
    const { colors, fonts } = useTheme();

    const renderItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
        </View>
      );
    };

    const styles = StyleSheet.create({
      container:{
          alignItems: "center",
          marginBottom: 15,
      },
      dropdown: {
        width: "100%",
        height: 40,
        backgroundColor: colors.quaternary,
        borderRadius: 5,
        padding: 12,
      },
      icon: {
        marginRight: 5,
      },
      item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      textItem: {
        flex: 1,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 14,
        fontFamily: fonts.default.fontFamily,
        color: colors.secondary
      },
      selectedTextStyle: {
        fontSize: 14,
        fontFamily: fonts.default.fontFamily
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 14,
        backgroundColor: colors.background,
        borderRadius: 5
      },
      itemContainerStyle:{
          backgroundColor: colors.quaternary,
      },
    });

    return (
        <View style={styles.container}>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemContainerStyle={styles.itemContainerStyle}
                itemTextStyle={styles.itemContainerStyle}
                containerStyle={styles.itemContainerStyle}
                iconStyle={styles.iconStyle}
                iconColor={colors.default_dark}
                data={list}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Sélectionner"
                searchPlaceholder="Rechercher..."
                value={value}
                onChange={item => {
                    setValue(item.value);
                }}
                renderItem={renderItem}
            />
        </View>
      
    );
  };

  export default DropdawnList;