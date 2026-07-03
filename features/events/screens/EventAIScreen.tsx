import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { parseEvent } from '../../../services/api/AiService';
import Button from '../../../shared/components/ui/AppButton';
import { useTranslation } from 'react-i18next';
import type { AppStackScreenProps } from '../../../navigation/types';

export default function EventAIScreen({ navigation }: AppStackScreenProps<'EventAI'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('events');
  const setFormData = useEventWizardStore((s) => s.setFormData);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);

  const handleParse = async () => {
    if (!text.trim()) {
      Toast.show({ type: 'error', position: 'top', text1: t('aiDescribeFirst') });
      return;
    }
    setLoading(true);
    try {
      const result = await parseEvent(text);
      setPreview(result.parsed);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    } catch {
      Toast.show({ type: 'error', position: 'top', text1: t('aiParseError') });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    } finally {
      setLoading(false);
    }
  };

  const confirmPreview = () => {
    if (!preview) return;
    setFormData(preview as any);
    navigation.navigate('EventWizardAnimals', { formData: preview });
  };

  const styles = {
    container: { flex: 1 },
    header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
    title: { fontSize: 22, color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily, flex: 1 },
    body: { paddingHorizontal: 20, flex: 1 },
    hint: { fontSize: 13, color: colors.secondary, fontFamily: fonts.default.fontFamily, marginBottom: 12 },
    textArea: { backgroundColor: colors.surfaceVariant, borderRadius: 12, padding: 16, color: colors.textPrimary, fontFamily: fonts.default.fontFamily, fontSize: 16, minHeight: 120, textAlignVertical: 'top' },
    previewCard: { backgroundColor: colors.background, borderRadius: 12, padding: 16, marginTop: 20, elevation: 2, shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
    previewTitle: { fontSize: 15, fontFamily: fonts.bodyMedium.fontFamily, color: colors.textPrimary, marginBottom: 8 },
    previewRow: { flexDirection: 'row', marginBottom: 4 },
    previewKey: { fontSize: 13, color: colors.secondary, fontFamily: fonts.default.fontFamily, width: 120 },
    previewVal: { fontSize: 13, color: colors.textPrimary, fontFamily: fonts.default.fontFamily, flex: 1 },
    footer: { padding: 20, paddingBottom: 40 },
  } as const;

  const previewEntries = preview ? Object.entries(preview).filter(([, v]) => v !== undefined && v !== null && v !== '') : [];

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
            <Entypo name="chevron-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Dictée intelligente</Text>
          <MaterialCommunityIcons name="robot-outline" size={24} color={colors.primary} />
        </View>

        <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.hint}>Décrivez votre événement en langage naturel. Ex : "Rdv véto samedi pour Caramel, vaccin annuel"</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Décrivez votre événement…"
            placeholderTextColor={colors.secondary}
            value={text}
            onChangeText={setText}
            multiline
            autoFocus
          />

          {preview && previewEntries.length > 0 && (
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>Voici ce que j'ai compris :</Text>
              {previewEntries.map(([k, v]) => (
                <View style={styles.previewRow} key={k}>
                  <Text style={styles.previewKey}>{k}</Text>
                  <Text style={styles.previewVal}>{String(v)}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {preview ? (
            <Button type="primary" size="l" isLong isUppercase={false} onPress={confirmPreview}>
              Confirmer et continuer
            </Button>
          ) : (
            <Button type="primary" size="l" isLong isUppercase={false} onPress={handleParse} disabled={loading}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : 'Analyser 🤖'}
            </Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
