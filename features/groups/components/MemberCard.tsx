import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { AppIcon } from '../../../shared/components/ui';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useGroupForm } from '../hooks/useGroupForm';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { AppNavigationProp } from '../../../navigation/types';

interface Member {
  email: string;
  user_id?: number;
  role?: string;
}

interface Group {
  id: string | number;
}

const MemberCard = ({
  member,
  memberState,
  userRole,
  group,
}: {
  member: Member;
  memberState: string;
  userRole: string;
  group: Group;
}) => {
  const { colors } = useAppTheme();
  const { firebaseUser } = useAuthStore();
  const { handleSubmit, setValue } = useForm<Record<string, unknown>>();
  const [modalValidationVisible, setModalValidationVisible] = useState(false);
  const navigation = useNavigation<AppNavigationProp>();

  const onModify = () => {
    Toast.show({ type: 'success', position: 'top', text1: 'Modification du groupe' });
  };

  const { submitGroup, loading } = useGroupForm(setValue, onModify, () => {});

  const refuseMember = async (data: Record<string, unknown>) => {
    data.status = 'declined';
    data.id = group.id;
    data.email = member.email;
    submitGroup(data, 'respondMember');
  };

  const deleteMember = async (data: Record<string, unknown>) => {
    data.id = group.id;
    data.email = member.email;
    data.user_id = member.user_id;
    setModalValidationVisible(false);
    if (member.email === firebaseUser?.email) {
      navigation.navigate('Tab', { screen: 'Autre' });
    }
    submitGroup(data, 'deleteMember');
  };

  const getActionsPart = () => {
    if (loading) return <ActivityIndicator animating={true} size="large" />;

    if (memberState === 'pending' && userRole === 'manager' && member.email !== firebaseUser?.email) {
      return (
        <TouchableOpacity onPress={handleSubmit(refuseMember)}>
          <AppIcon name="close" size={30} color={colors.error} />
        </TouchableOpacity>
      );
    }
    if (
      memberState === 'accepted' &&
      ((userRole !== 'manager' && member.email === firebaseUser?.email) ||
        (userRole === 'manager' && member.email !== firebaseUser?.email))
    ) {
      return (
        <TouchableOpacity onPress={() => setModalValidationVisible(true)}>
          <AppIcon name="exit-to-app" size={30} color={colors.error} />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const styles = {
    card: {
      backgroundColor: colors.background,
      marginBottom: 10,
      borderRadius: 5,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.1,
      elevation: 1,
      shadowOffset: { width: 0, height: 1 },
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    contentCard: {
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemsContainer: { flexDirection: 'row', alignItems: 'center' },
  } as const;

  return (
    <>
      <ModalValidation
        displayedText={`Êtes-vous sûr de vouloir retirer ${member.email} du groupe ?`}
        title="Retrait d'un membre"
        onConfirm={handleSubmit(deleteMember)}
        setVisible={setModalValidationVisible}
        visible={modalValidationVisible}
      />
      <View style={styles.card}>
        <View style={styles.contentCard}>
          <View style={styles.itemsContainer}>
            <Text>{member.email}</Text>
          </View>
          <View style={styles.itemsContainer}>{getActionsPart()}</View>
        </View>
      </View>
    </>
  );
};

export default MemberCard;
