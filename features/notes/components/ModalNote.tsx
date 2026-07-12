import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import sanitizeHtml from 'sanitize-html';
import { AppDivider, AppInput, AppSheet } from '../../../shared/components/ui';
import CustomRichTextEditor from '../../../shared/components/inputs/CustomRichTextEditor';
import { useAppTheme } from '../../../theme/useAppTheme';
import { NoteFormValues, useNoteForm } from '../hooks/useNoteForm';
import type { Note } from '../../../models/Note';

interface ModalNoteProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: string;
  note?: Partial<Note>;
  onModify?: (data?: unknown) => void;
}

const ModalNote = ({ isVisible, setVisible, actionType, note = {}, onModify = undefined }: ModalNoteProps) => {
  const { colors, fonts } = useAppTheme();
  const { form, loading, initValues, resetValues, submit } = useNoteForm(actionType, note, onModify);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const [richTextValue, setRichTextValue] = useState<string | undefined>(undefined);
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    register('titre', { required: true });
    register('note');
  }, [register]);

  useEffect(() => {
    if (isVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) initValuesEvent();
  }, [isVisible]);

  const closeModal = () => setVisible(false);

  const initValuesEvent = () => {
    initValues();
    setRichTextValue(note.note ?? undefined);
  };

  const resetModalValues = () => {
    resetValues();
    setRichTextValue(undefined);
  };

  const submitRegister = async (data: NoteFormValues) => {
    const sanitizedNote = await sanitizeHtml(richTextValue ?? '');
    await submit({ ...data, note: sanitizedNote }, () => {
      resetModalValues();
      closeModal();
    });
  };

  const fieldValue = (name: keyof NoteFormValues) => String(watch(name) ?? '');

  const styles = {
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 14, paddingRight: 14, paddingTop: 18, paddingBottom: 10, gap: 14 },
    textInput: { alignSelf: 'flex-start', color: colors.textPrimary, fontFamily: fonts.default.fontFamily },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['88%']} keyboardBehavior="extend" scrollable={false} onDismiss={closeModal}>
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>Annuler</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { fontSize: 16, color: colors.textPrimary }]}>Note</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator size={10} color={colors.textPrimary} />
            ) : (
              <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>
                {actionType === 'modify' ? 'Modifier' : 'Créer'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <AppDivider />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraScrollHeight={10} enableResetScrollToCoords={false}>
          <View style={styles.formContainer}>
            <AppInput
              label="Titre"
              required
              error={errors.titre ? 'Titre obligatoire' : undefined}
              placeholder="Exemple : Titre"
              value={fieldValue('titre')}
              onChangeText={(text) => setValue('titre', text, { shouldValidate: true })}
              returnKeyType="next"
            />
            <Text style={styles.textInput}>Note</Text>
            <CustomRichTextEditor initialContent={fieldValue('note')} onSave={(htmlContent) => setRichTextValue(htmlContent)} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </AppSheet>
  );
};

export default ModalNote;
