import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, Text, FlatList, TextInput } from 'react-native';
import { useGroupForm } from '../hooks/useGroupForm';
import { AntDesign } from '@expo/vector-icons';
import Button from '../../../shared/components/inputs/Button';

interface ModalAddMemberProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  group?: any;
  onModify?: (data?: any) => void;
}

const ModalAddMember = ({ isVisible, setVisible, group = {}, onModify = undefined }: ModalAddMemberProps) => {
  const { colors, fonts } = useTheme();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  const closeModal = () => setVisible(false);

  const { initializeGroup, submitGroup, members, addMember, updateMembers, removeMember, loading } = useGroupForm(setValue, onModify, closeModal);

  useEffect(() => { if (group) initializeGroup(group); }, [isVisible]);

  const submitRegister = async (data: any) => submitGroup(data, 'addMember');

  const styles = StyleSheet.create({
    form: { width: '100%', paddingBottom: 40, flex: 1 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContentContainer: { flex: 1, paddingHorizontal: 30, paddingTop: 10 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    textInput: { alignSelf: 'flex-start', marginBottom: 5, color: (colors as any).default_dark },
    inputMember: { height: 40, width: '90%', borderRadius: 5, paddingLeft: 15, backgroundColor: (colors as any).quaternary, color: (colors as any).default_dark, marginRight: 10 },
    membersContainer: { flexDirection: 'row', marginBottom: 15, width: '100%', alignItems: 'center' },
  });

  return (
    <ModalEditGeneric isVisible={isVisible} setVisible={setVisible} arrayHeight={['90%']} scrollInside={false}>
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.tertiary }, styles.textFontRegular]}>Annuler</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { fontSize: 16, color: (colors as any).default_dark }]}>Groupe</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={10} color={(colors as any).default_dark} /> : <Text style={[{ color: (colors as any).default_dark }, styles.textFontRegular]}>Inviter</Text>}
          </TouchableOpacity>
        </View>
        <Divider />
        <View style={styles.formContentContainer}>
          <Text style={[styles.textInput, styles.textFontRegular]}>Membres : <Text style={{ color: 'red' }}>*</Text></Text>
          <FlatList
            data={members}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.membersContainer}>
                <TextInput style={[styles.inputMember, styles.textFontRegular]} defaultValue={item} onChangeText={(text) => updateMembers(index, text)} placeholder="Entrez une adresse e-mail" placeholderTextColor={colors.secondary} />
                <TouchableOpacity onPress={() => removeMember(index)}>
                  <AntDesign name="delete" size={20} color={(colors as any).default_dark} />
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
    </ModalEditGeneric>
  );
};

export default ModalAddMember;
