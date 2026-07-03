import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AppDivider, AppSheet } from '../../../shared/components/ui';
import { useGroupForm } from '../hooks/useGroupForm';
import ModalAnimals from '../../animals/components/ModalSelectAnimals';
import Button from '../../../shared/components/ui/AppButton';
import { AntDesign } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ModalGroupProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: string;
  group?: any;
  onModify?: (data?: any) => void;
}

const ModalGroup = ({ isVisible, setVisible, actionType, group = {}, onModify = undefined }: ModalGroupProps) => {
  const { colors, fonts } = useAppTheme();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  const closeModal = () => setVisible(false);
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [isVisible]);

  const { initializeGroup, resetGroupValues, submitGroup, animaux, selected, setSelected, modalSelectAnimalsIsVisible, setModalSelectAnimalsIsVisible, members, addMember, updateMembers, removeMember, loading } = useGroupForm(setValue, onModify, closeModal);

  useEffect(() => { if (group) initializeGroup(group); }, [isVisible]);

  const submitRegister = async (data: any) => submitGroup(data, actionType);

  const styles = {
    form: { width: '100%', paddingBottom: 40, flex: 1 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10 },
    input: { height: 40, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary },
    inputContainer: { alignItems: 'center', width: '100%' },
    textInput: { alignSelf: 'flex-start', marginBottom: 5, color: colors.textPrimary },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    containerAnimaux: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
    badgeAnimal: { padding: 10 },
    containerBadgeAnimal: { borderRadius: 5, backgroundColor: colors.surfaceVariant, marginRight: 5, marginBottom: 5 },
    inputMember: { height: 40, width: '95%', borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary, marginRight: 10 },
    membersContainer: { flexDirection: 'row', marginBottom: 15, width: '100%', alignItems: 'center' },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['90%']} keyboardBehavior="extend" onDismiss={closeModal}>
      <ModalAnimals valueName="animals" setValue={setValue} animaux={animaux} selected={selected} setSelected={setSelected} modalVisible={modalSelectAnimalsIsVisible} setModalVisible={setModalSelectAnimalsIsVisible} displayAnimalsShared={false} />
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>Annuler</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { fontSize: 16, color: colors.textPrimary }]}>Groupe</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={10} color={colors.textPrimary} /> : <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{actionType === 'modify' ? 'Modifier' : 'Créer'}</Text>}
          </TouchableOpacity>
        </View>
        <AppDivider />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraScrollHeight={10} enableResetScrollToCoords={false}>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Nom : <Text style={{ color: colors.error }}>*</Text></Text>
              {errors.name && <Text style={{ color: colors.error }}>Nom obligatoire</Text>}
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Groupe" maxLength={50} placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('name', text)} defaultValue={watch('name')} {...register('name', { required: true })} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Informations :</Text>
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Nouveau cadenas" maxLength={500} placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('informations', text)} defaultValue={watch('informations')} />
            </View>
            {actionType === 'create' && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Animaux :</Text>
                  <TouchableOpacity style={styles.textInput} disabled={animaux.length === 0 || actionType !== 'create'} onPress={() => { Keyboard.dismiss(); setModalSelectAnimalsIsVisible(true); }}>
                    <View style={styles.containerAnimaux}>
                      {selected.length === 0 && animaux.length > 0 && <View style={[styles.containerBadgeAnimal, { width: '100%' }]}><Text style={[styles.badgeAnimal, styles.textFontRegular, { color: colors.secondary }]}>Sélectionner un ou plusieurs animaux</Text></View>}
                      {selected.map((animal: any) => <View key={animal.id} style={styles.containerBadgeAnimal}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>{animal.nom}</Text></View>)}
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Membres : <Text style={{ color: colors.error }}>*</Text></Text>
                  {members.map((value: string, index: number) => (
                    <View style={styles.membersContainer} key={index}>
                      <TextInput style={[styles.inputMember, styles.textFontRegular]} defaultValue={value} onChangeText={(text) => updateMembers(index, text)} placeholder="Entrez une adresse e-mail" placeholderTextColor={colors.secondary} editable={actionType === 'create'} />
                      <TouchableOpacity onPress={() => removeMember(index)}>
                        <AntDesign name="delete" size={20} color={colors.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <Button onPress={addMember} type="primary" size="s" isLong={true} disabled={actionType !== 'create'}>
                    <Text style={styles.textFontRegular}>Ajouter un membre</Text>
                  </Button>
                </View>
              </>
            )}
          </View>
        </KeyboardAwareScrollView>
      </View>
    </AppSheet>
  );
};

export default ModalGroup;
