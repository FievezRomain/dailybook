import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { parseEvent } from '../../../services/api/AiService';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { Banner, FormSheet, TextArea } from '../../../shared/components/ui';
import { normalizeAiEvent } from '../eventAiUtils';

export interface EventCreateAiDescriptionScreenProps { onBack: () => void; onAnalyzed: () => void; onClose?: () => void }

export function EventCreateAiDescriptionScreen({ onBack, onAnalyzed, onClose = onBack }: EventCreateAiDescriptionScreenProps) {
  const { colors } = useAppTheme(); const form = useEventWizardStore((state) => state.formData); const setField = useEventWizardStore((state) => state.setField); const setFormData = useEventWizardStore((state) => state.setFormData); const animals = useAnimalsQuery().data ?? [];
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string>(); const description = typeof form.aiDescription === 'string' ? form.aiDescription : '';
  const analyze = async () => { if (!description.trim() || loading) return; setLoading(true); setError(undefined); try { const response = await parseEvent(description.trim()); setFormData(normalizeAiEvent(response.parsed, description.trim(), animals)); onAnalyzed(); } catch { setError('Vasco n’a pas pu analyser cette description. Vérifiez votre connexion puis réessayez.'); } finally { setLoading(false); } };
  return <FormSheet title="Décrire l’événement" onBack={onBack} onClose={onClose} dirty={Boolean(description.trim())} footerLabel="Analyser ma description" onFooterPress={() => void analyze()} footerLoading={loading} footerDisabled={!description.trim()} testID="event-create-ai-description"><View style={{ gap: spacing.xs, marginTop: spacing.lg }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>Écrivez comme vous parleriez à quelqu’un.</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>Vasco identifiera le type, la date, l’heure et les animaux cités.</Text></View>{error ? <Banner tone="error" title="Analyse impossible" message={error} blocking /> : null}<TextArea label="Description" placeholder="Ajoutez les informations utiles…" value={description} onChangeText={(value) => setField('aiDescription', value)} helperText={`${description.length}/500`} maxLength={500} /><View style={{ minHeight: 92, justifyContent: 'center', padding: spacing.md, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>« Vaccin de Milo mardi à 9 h chez le vétérinaire »</Text></View></FormSheet>;
}
