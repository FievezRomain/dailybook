import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect, useRef, useCallback, useMemo } from "react";
import { useTheme, Portal } from 'react-native-paper';
import BottomSheet, { BottomSheetView, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import Toast from "react-native-toast-message";
import { Easing } from "react-native-reanimated";

const ModalEditGeneric = ({ children, arrayHeight = [], isVisible, setVisible, scrollInside = true, handleStyle = undefined, handleIndicatorStyle = undefined }) => {
    // variables
    const bottomSheet = useRef(null);
    const [isOpen, setOpen] = useState(false);
    const { colors } = useTheme();

    useEffect(() => {
        if(!isVisible){
            handlePressOverModal();
        } else{
            setOpen(true);
        }
    }, [isVisible]);

    const handlePressOverModal = useCallback(() =>{
        bottomSheet?.current?.close();
        setTimeout(() => setOpen(false), 150);
    }, []);

    const styles = StyleSheet.create({
        contentContainer: {
          flex: 1,
        },
    });

    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 200,
        //easing: Easing.ease,
        //easing: Easing.in,
        easing: Easing.sin,
    });

    return(
        (isVisible || isOpen) &&
            <Portal>
                <Portal><Toast/></Portal>
                <View style={{height: "100%", width: "100%"}}>
                    <TouchableOpacity 
                        style={{flex: 1}}
                        onPress={handlePressOverModal}
                    />
                    <BottomSheet 
                        ref={bottomSheet}
                        snapPoints={arrayHeight}
                        index={arrayHeight.length - 1}
                        enableDynamicSizing={false}
                        containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                        enablePanDownToClose={true}
                        enableOverDrag={true}
                        enableContentPanningGesture={scrollInside}
                        animationConfigs={animationConfigs}
                        onClose={() => setVisible(false)}
                        handleStyle={handleStyle ? handleStyle : null}
                        handleIndicatorStyle={handleIndicatorStyle ? handleIndicatorStyle : null}
                        backgroundStyle={{backgroundColor : colors.background}}
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