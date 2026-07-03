import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '../../../theme/useAppTheme';
import { parseNote } from '../../../services/api/AiService';
import { useNoteMutations } from '../../../hooks/queries/useNotesQuery';
import type { AppStackScreenProps } from '../../../navigation/types';
import type { AiParseResult } from '../../../services/api/AiService';
import Button from '../../../shared/components/ui/AppButton';

export default function NoteAIScreen({ navigation }: AppStackScreenProps<'NoteAI'>) {
  const { colors, fonts } = useAppTheme();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<AiParseResult | null>(null);
  const { create } = useNoteMutations();

  const onParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setPreview(null);
    try {
      const result = await parseNote(text);
      setPreview(result.parsed);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    } catch {
      Toast.show({ type: 'error', text1: 'Impossible d\'analyser le texte', position: 'top' });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = () => {
    if (!preview) return;
    create.mutate(
      { titre: String(preview.titre ?? preview.nom ?? 'Note'), note: String(preview.note ?? preview.contenu ?? text) },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Note créée !', position: 'top' });
          navigation.goBack();
        },
        onError: () => Toast.show({ type: 'error', text1: 'Erreur lors de la création', position: 'top' }),
      },
    );
  };

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Entypo name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily }}>Note par IA ??</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }}>
        <Text style={{ fontSize: 14, color: colors.secondary, fontFamily: fonts.default?.fontFamily, marginBottom: 10 }}>
          Décrivez votre note librement, l'IA l'organisera pour vous.
        </Text>
        <TextInput
          style={{ backgroundColor: colors.background, borderRadius: 12, padding: 14, fontSize: 15, color: colors.textPrimary, fontFamily: fonts.default?.fontFamily, minHeight: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.surfaceVariant }}
          placeholder="Ex: Rappeler de contacter le vétérinaire pour Isis, la jument grise..."
          placeholderTextColor={colors.secondary}
          value={text}
          onChangeText={setText}
          multiline
        />
        <View style={{ marginTop: 16 }}>
          <Button onPress={onParse} isUppercase={false} disabled={!text.trim() || loading}>{loading ? 'Analyse en cours...' : "Analyser avec l'IA"}</Button>
        </View>
        {loading && (
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        )}
        {preview && (
          <View style={{ backgroundColor: colors.background, borderRadius: 14, padding: 18, marginTop: 24, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontFamily: fonts.bodyMedium.fontFamily, color: colors.textPrimary, marginBottom: 12 }}>Aperéu de la note</Text>
            {Object.entries(preview).map(([k, v]) =>
              v != null && String(v).trim() !== '' ? (
                <View key={k} style={{ flexDirection: 'row', marginBottom: 6 }}>
                  <Text style={{ fontSize: 13, color: colors.secondary, fontFamily: fonts.bodyMedium.fontFamily, width: 110 }}>{k}</Text>
                  <Text style={{ fontSize: 13, color: colors.textPrimary, fontFamily: fonts.default?.fontFamily, flex: 1 }}>{String(v)}</Text>
                </View>
              ) : null,
            )}
            <View style={{ marginTop: 16 }}>
              <Button onPress={onConfirm} isUppercase={false} disabled={create.isPending}>Créer cette note</Button>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
