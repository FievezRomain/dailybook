import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const GroupCard = ({ group }) => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();

  const handlePress = () => {
    console.log("navigation");
    //navigation.navigate('GroupDetail', { groupId: group.id });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primary }]}>{group.name}</Text>
            {group.membersCount !== undefined && (
              <Text style={styles.memberCount}>{group.membersCount} membre{group.membersCount > 1 ? 's' : ''}</Text>
            )}
          </View>
          {group.description && (
            <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
              {group.description}
            </Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
  }
});

export default GroupCard;
