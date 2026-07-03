import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AppIconButton } from '../../../shared/components/ui';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface Group {
  id: number;
  name: string;
  nb_animaux?: number;
  nb_members?: number;
  [key: string]: any;
}

const GroupCard = ({ group }: { group: Group }) => {
  const { colors, fonts } = useAppTheme();
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate('GroupDetail', { group });
  };

  const styles = {
    card: {
      marginBottom: 12,
      borderRadius: 5,
      elevation: 2,
      backgroundColor: colors.background,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      padding: 15,
    },
    containerCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    arrow: { color: colors.primary, paddingRight: 10 },
    icon: { color: colors.textPrimary, marginLeft: 10 },
  } as const;

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.containerCard}>
          <View style={{ width: '50%' }}>
            <Text style={[styles.textFontMedium, { color: colors.textPrimary }]}>{group.name}</Text>
          </View>
          <View style={{ width: '30%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.textFontMedium, { color: colors.textPrimary }]}>{group.nb_animaux}</Text>
              <MaterialCommunityIcons name='paw' size={16} style={styles.icon} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.textFontMedium, { color: colors.textPrimary }]}>{group.nb_members}</Text>
              <Ionicons name="person" size={14} style={styles.icon} />
            </View>
          </View>
          <View style={{ width: '20%', alignItems: 'flex-end' }}>
            <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.arrow} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroupCard;
