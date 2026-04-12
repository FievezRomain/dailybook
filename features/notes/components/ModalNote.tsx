import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { createNote, updateNote } from '../../../services/api/NoteService';
import { useAuthStore } from '../../../stores/useAuthStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import sanitizeHtml from 'sanitize-html';
import { Divider } from 'react-native-paper';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';
import CustomRichTextEditor from '../../../shared/components/inputs/CustomRichTextEditor';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ModalNoteProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: string;
  note?: any;
  onModify?: (data?: any) => void;
}

const ModalNote = ({ isVisible, setVisible, actionType, note = {}, onModify = undefined }: ModalNoteProps) => {
  const { colors, fonts } = useAppTheme();
  const { firebaseUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [richTextValue, setRichTextValue] = useState<string | undefined>(undefined);

  useEffect(() => { if (isVisible) initValuesEvent(); }, [isVisible]);

  const closeModal = () => setVisible(false);

  const initValuesEvent = () => {
    setValue('id', note.id); setValue('titre', note.titre); setValue('note', note.note);
    setRichTextValue(note.note !== null ? note.note : undefined);
  };

  const resetValues = () => {
    setValue('id', undefined); setValue('titre', undefined); setValue('note', undefined);
    setRichTextValue(undefined);
  };

  const submitRegister = async (data: any) => {
    if (loading) return;
    setLoading(true);
    data['email'] = firebaseUser?.email ?? '';
    data['note'] = await sanitizeHtml(richTextValue ?? '');
    if (actionType === 'modify') {
      updateNote(String(data.id), data)
        .then((reponse) => { resetValues(); closeModal(); onModify?.(reponse); setLoading(false); })
        .catch((err) => { Toast.show({ type: 'error', position: 'top', text1: err.message }); setLoading(false); });
    } else {
      createNote(data)
        .then(() => { resetValues(); closeModal(); onModify?.(); setLoading(false); })
        .catch((err) => { Toast.show({ type: 'error', position: 'top', text1: err.message }); setLoading(false); });
    }
  };

  const styles = StyleSheet.create({
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10 },
    inputContainer: { alignItems: 'center', width: '100%' },
    textInput: { alignSelf: 'flex-start', marginBottom: 5, color: colors.default_dark },
    input: { height: 40, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.quaternary, color: colors.default_dark },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={isVisible} setVisible={setVisible} arrayHeight={['90%']} scrollInside={false}>
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.tertiary }, styles.textFontRegular]}>Annuler</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { fontSize: 16, color: colors.default_dark }]}>Note</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={10} color={colors.default_dark} /> : <Text style={[{ color: colors.default_dark }, styles.textFontRegular]}>{actionType === 'modify' ? 'Modifier' : 'Créer'}</Text>}
          </TouchableOpacity>
        </View>
        <Divider />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraScrollHeight={10} enableResetScrollToCoords={false}>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Titre : <Text style={{ color: 'red' }}>*</Text></Text>
              {errors.titre && <Text style={{ color: 'red' }}>Titre obligatoire</Text>}
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Titre" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('titre', text)} defaultValue={watch('titre')} {...register('titre', { required: true })} />
              <Text style={[styles.textInput, styles.textFontRegular]}>Note :</Text>
              <CustomRichTextEditor initialContent={watch('note') ?? ''} onSave={(htmlContent) => setRichTextValue(htmlContent)} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </ModalEditGeneric>
  );
};

export default ModalNote;
