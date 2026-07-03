import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AppDivider, AppSheet } from '../../../shared/components/ui';
import { ActivityIndicator, TouchableOpacity, View, Text, FlatList, TextInput } from 'react-native';
import { useGroupForm } from '../hooks/useGroupForm';
import { AntDesign } from '@expo/vector-icons';
import Button from '../../../shared/components/ui/AppButton';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ModalAddMemberProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  group?: any;
  onModify?: (data?: any) => void;
}

const ModalAddMember = ({ isVisible, setVisible, group = {}, onModify = undefined }: ModalAddMemberProps) => {
  const { colors, fonts } = useAppTheme();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  const closeModal = () => setVisible(false);
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [isVisible]);

  const { initializeGroup, submitGroup, members, addMember, updateMembers, removeMember, loading } = useGroupForm(setValue, onModify, closeModal);

  useEffect(() => { if (group) initializeGroup(group); }, [isVisible]);

  const submitRegister = async (data: any) => submitGroup(data, 'addMember');

  const styles = {
    form: { width: '100%', paddingBottom: 40, flex: 1 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContentContainer: { flex: 1, paddingHorizontal: 30, paddingTop: 10 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    textInput: { alignSelf: 'flex-start', marginBottom: 5, color: colors.textPrimary },
    inputMember: { height: 40, width: '90%', borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary, marginRight: 10 },
    membersContainer: { flexDirection: 'row', marginBottom: 15, width: '100%', alignItems: 'center' },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['90%']} onDismiss={closeModal}>
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>Annuler</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { fontSize: 16, color: colors.textPrimary }]}>Groupe</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={10} color={colors.textPrimary} /> : <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>Inviter</Text>}
          </TouchableOpacity>
        </View>
        <AppDivider />
        <View style={styles.formContentContainer}>
          <Text style={[styles.textInput, styles.textFontRegular]}>Membres : <Text style={{ color: colors.error }}>*</Text></Text>
          <FlatList
            data={members}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.membersContainer}>
                <TextInput style={[styles.inputMember, styles.textFontRegular]} defaultValue={item} onChangeText={(text) => updateMembers(index, text)} placeholder="Entrez une adresse e-mail" placeholderTextColor={colors.secondary} />
                <TouchableOpacity onPress={() => removeMember(index)}>
                  <AntDesign name="delete" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={
              <Button onPress={addMember} type="primary" size="s" isLong={true}>
                <Text style={styles.textFontRegular}>Ajouter un membre</Text>
              </Button>
            }
          />
        </View>
      </View>
    </AppSheet>
  );
};

export default ModalAddMember;
