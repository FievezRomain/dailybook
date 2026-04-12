import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import MemberCard from './MemberCard';
import { Icon } from 'react-native-paper';
import { useAppTheme } from '../../../theme/useAppTheme';

interface MemberList {
  type: string;
  items: any[];
}

const MembersGroup = ({
  members,
  group,
  userRole,
}: {
  members: MemberList | undefined;
  group: any;
  userRole: string;
}) => {
  const { colors, fonts } = useAppTheme();

  const styles = StyleSheet.create({
    containerHeader: {
      paddingBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    container: { paddingVertical: 10 },
    title: { marginLeft: 5 },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <>
      {members !== undefined && members.type === 'pending' && (
        <View style={styles.container}>
          <View style={styles.containerHeader}>
            <Icon source="clock-outline" size={20} color={colors.default_dark} />
            <Text style={[styles.title, styles.textFontBold]}>Utilisateurs en attente</Text>
          </View>
          <FlatList
            data={members.items}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <MemberCard member={item} group={group} memberState={members.type} userRole={userRole} />
            )}
            ListEmptyComponent={<ModalDefaultNoValue text="Aucun utilisateur en attente" />}
          />
        </View>
      )}
      {members && members.type === 'accepted' && (
        <View style={styles.container}>
          <View style={styles.containerHeader}>
            <Icon source="format-list-bulleted" size={20} color={colors.default_dark} />
            <Text style={[styles.title, styles.textFontBold]}>Membres du groupe</Text>
          </View>
          <FlatList
            data={members.items}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <MemberCard member={item} group={group} memberState={members.type} userRole={userRole} />
            )}
            ListEmptyComponent={<ModalDefaultNoValue text="Aucun membre dans le groupe" />}
          />
        </View>
      )}
    </>
  );
};

export default MembersGroup;
