import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import NoteCard from '../components/NoteCard';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import { useNotesQuery, useNoteMutations } from '../../../hooks/queries/useNotesQuery';
import type { AppStackScreenProps } from '../../../navigation/types';

export default function NoteScreen({ navigation }: AppStackScreenProps<'Note'>) {
  const { colors, fonts } = useTheme();
  const { data: notes = [] } = useNotesQuery();
  const { update, remove } = useNoteMutations();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = searchQuery
    ? notes.filter((note: any) => {
        const q = searchQuery.toLowerCase();
        return (
          (note.titre && note.titre.toLowerCase().includes(q)) ||
          (note.note && note.note.toLowerCase().includes(q))
        );
      })
    : notes;

  const styles = StyleSheet.create({
    container: { flex: 1 },
    textFontRegular: { fontFamily: (fonts as any).default.fontFamily },
    textFontBold: { fontFamily: (fonts as any).bodyLarge.fontFamily },
  });

  return (
    <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTabSecondary message1="Vos" message2="Notes" />
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', backgroundColor: colors.background, marginBottom: 10, marginTop: 20, alignSelf: 'center', width: '90%', justifyContent: 'space-between', padding: 10, borderRadius: 5, shadowColor: (colors as any).default_dark, elevation: 1, shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="search-outline" size={16} color={(colors as any).default_dark} />
            <TextInput
              placeholder="Recherche"
              style={[{ marginLeft: 5, width: '100%', color: (colors as any).default_dark }, styles.textFontRegular]}
              placeholderTextColor={(colors as any).default_dark}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        <View style={{ width: '90%', alignSelf: 'center', flex: 1 }}>
          {notes.length === 0 ? (
            <ModalDefaultNoValue text="Aucune note enregistrée" />
          ) : (
            <>
              {searchQuery.length > 0 && (
                <Text style={{ marginBottom: 10, textAlign: 'center', color: (colors as any).default_dark }}>
                  Résultats de la recherche "{searchQuery}"
                </Text>
              )}
              <FlatList
                data={filteredNotes}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={({ item }) => (
                  <NoteCard
                    note={item}
                    handleNoteChange={(n: any) => update.mutate({ id: n.id, body: n })}
                    handleNoteDelete={(n: any) => remove.mutate(n.id)}
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
