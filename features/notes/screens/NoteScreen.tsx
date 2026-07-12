import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../theme/useAppTheme';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import NoteCard from '../components/NoteCard';
import { useNotesQuery } from '../../../hooks/queries/useNotesQuery';
import type { AppStackScreenProps } from '../../../navigation/types';
import { useTranslation } from 'react-i18next';
import type { Note } from '../../../models/Note';
import { AppEmptyState, AppErrorState } from '../../../shared/components/ui';
import { ListSkeleton } from '../../../shared/components/skeletons/CardSkeleton';

export default function NoteScreen({ navigation }: AppStackScreenProps<'Note'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('notes');
  const { data: notes = [], isLoading, isError, refetch } = useNotesQuery();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = searchQuery
    ? notes.filter((note: Note) => {
        const q = searchQuery.toLowerCase();
        return (
          (note.titre && note.titre.toLowerCase().includes(q)) ||
          (note.note && note.note.toLowerCase().includes(q))
        );
      })
    : notes;

  const styles = {
    container: { flex: 1 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTabSecondary message1="Vos" message2="Notes" />
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', backgroundColor: colors.background, marginBottom: 10, marginTop: 20, alignSelf: 'center', width: '90%', justifyContent: 'space-between', padding: 10, borderRadius: 5, shadowColor: colors.textPrimary, elevation: 1, shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="search-outline" size={16} color={colors.textPrimary} />
            <TextInput
              placeholder={t('searchPlaceholder')}
              style={[{ marginLeft: 5, width: '100%', color: colors.textPrimary }, styles.textFontRegular]}
              placeholderTextColor={colors.textPrimary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('NoteAI')} style={{ marginLeft: 8, padding: 4 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons name="robot-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={{ width: '90%', alignSelf: 'center', flex: 1 }}>
          {isLoading ? (
            <ListSkeleton count={5} variant="note" />
          ) : isError ? (
            <AppErrorState message="Impossible de charger les notes." onRetry={() => void refetch()} />
          ) : notes.length === 0 ? (
            <AppEmptyState icon="note-outline" title="Aucune note enregistrée" description="Ajoutez une note pour garder une trace utile." />
          ) : (
            <>
              {searchQuery.length > 0 && (
                <Text style={{ marginBottom: 10, textAlign: 'center', color: colors.textPrimary }}>
                  {t('searchResults', { query: searchQuery })}
                </Text>
              )}
              <FlatList
                data={filteredNotes}
                keyExtractor={(item: Note) => item.id.toString()}
                renderItem={({ item }) => (
                  <NoteCard
                    note={item}
                    handleNoteChange={() => undefined}
                    handleNoteDelete={() => undefined}
                  />
                )}
                numColumns={1}
              />
            </>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}
