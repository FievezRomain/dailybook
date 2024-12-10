import React, {useEffect, useState} from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

const ModalValidation = ({ visible, setVisible, displayedText, title, onConfirm}) => {
    const { colors } = useTheme();
    const hideDialog = () => setVisible(false);

    return (
        <View>
            <Portal>
                <Dialog style={{backgroundColor: colors.background}} visible={visible} dismissable={false}>
                    <Dialog.Title style={{color: colors.bai}}>{title}</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{color: colors.bai}} variant="bodyMedium">{displayedText}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog} labelStyle={{color: colors.accent}}>Annuler</Button>
                        <Button onPress={() => onConfirm()}>Confirmer</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default ModalValidation;