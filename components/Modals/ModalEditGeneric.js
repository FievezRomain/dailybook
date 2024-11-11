import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect, useRef, useCallback, useMemo } from "react";
import { useTheme, Portal } from 'react-native-paper';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const ModalEditGeneric = ({ children, arrayHeight = [], isVisible, setVisible }) => {
    // variables
    const { colors, fonts } = useTheme();
    const bottomSheet = useRef(null);

    const handlePressOverModal = useCallback(() =>{
        bottomSheet?.current?.close();
    }, [])

    const styles = StyleSheet.create({
        contentContainer: {
          flex: 1,
        },
    });

    return(
        isVisible &&
            <Portal>
                <View style={{height: "100%", width: "100%",backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                    <TouchableOpacity 
                        style={{flex: 1}}
                        onPress={handlePressOverModal}
                    />
                    <BottomSheet 
                        ref={bottomSheet}
                        snapPoints={arrayHeight}
                        index={arrayHeight.length - 1}
                        enableDynamicSizing={false}
                        enablePanDownToClose={true}
                        onClose={() => setVisible(false)}
                    >
                        <BottomSheetView style={styles.contentContainer}>
                            {children}
                        </BottomSheetView>
                    </BottomSheet>
                </View>
            </Portal>
        
    );
}

export default ModalEditGeneric;