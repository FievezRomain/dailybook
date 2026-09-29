import { useState } from 'react';
import { Text, View } from 'react-native';
import type { Event } from '../../../models/Event';
import { Banner, FormSheet, PeriodSelector, StarRatingField, TextArea, TextField } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getEventQuickFieldKeys } from '../eventDetailsConfig';
import type { PatchEventPayload } from '../types';

const stateOptions = [{ value: 'pending', label: 'À faire' }, { value: 'completed', label: 'Terminé' }] as const;

export function EventQuickEditSheet({ event, onClose, onSave }: { event: Event; onClose: () => void; onSave: (body: PatchEventPayload) => Promise<void> }) {
  const { colors } = useAppTheme();
  const source = event as Event & Record<string, unknown>;
  const editableKeys = new Set(getEventQuickFieldKeys(event.eventtype));
  const supportsNote = editableKeys.has('note');
  const supportsPlacement = editableKeys.has('placement');
  const supportsExpense = editableKeys.has('depense');
  const initialNote = typeof source.note === 'number' ? source.note : undefined;
  const initialPlacement = String(source.placement ?? '');
  const initialExpense = event.depense == null ? '' : String(event.depense);
  const initialComment = event.commentaire ?? '';
  const initialState = ['completed', 'terminé', 'termine', 'done', 'true'].includes(String(event.state).toLocaleLowerCase('fr-FR')) ? 'completed' : 'pending';
  const [note, setNote] = useState<number | undefined>(initialNote);
  const [placement, setPlacement] = useState(initialPlacement);
  const [expense, setExpense] = useState(initialExpense);
  const [comment, setComment] = useState(initialComment);
  const [state, setState] = useState<'pending' | 'completed'>(initialState);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const normalizedExpense = expense.trim().replace(',', '.');
  const expenseValid = !normalizedExpense || (Number.isFinite(Number(normalizedExpense)) && Number(normalizedExpense) >= 0);
  const dirty = state !== initialState
    || comment !== initialComment
    || (supportsNote && note !== initialNote)
    || (supportsPlacement && placement !== initialPlacement)
    || (supportsExpense && expense !== initialExpense);
  const save = async () => {
    const body: PatchEventPayload = { state, commentaire: comment.trim() || null };
    if (supportsNote) body.note = note ?? null;
    if (supportsPlacement) body.placement = placement.trim() || null;
    if (supportsExpense) body.depense = normalizedExpense ? Number(normalizedExpense) : null;
    setPending(true);
    setError(false);
    try { await onSave(body); } catch { setError(true); } finally { setPending(false); }
  };
  return <FormSheet title="Modifier le suivi" onBack={onClose} onClose={onClose} dirty={dirty} confirmBackWhenDirty footerLabel="Enregistrer" footerLoading={pending} footerDisabled={!dirty || !expenseValid} onFooterPress={() => void save()} testID="event-quick-edit">
    {error ? <Banner tone="error" title="Mise à jour impossible" message="La modification n’a pas pu être enregistrée. Réessayez." blocking onDismiss={undefined} /> : null}
    <View style={{ gap: spacing.xs }}>
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>État</Text>
      <PeriodSelector options={stateOptions} value={state} onChange={setState} accessibilityLabel="État de l’événement" testID="event-quick-state" />
    </View>
    {supportsNote ? <StarRatingField label="Note" value={note} onChange={setNote} /> : null}
    {supportsPlacement ? <TextField label="Classement" placeholder="Ex. 2e" value={placement} helperText="Facultatif" onChangeText={setPlacement} /> : null}
    {supportsExpense ? <TextField label="Dépense" placeholder="0,00 €" value={expense} keyboardType="decimal-pad" helperText="Facultatif" errorMessage={expenseValid ? undefined : 'Saisissez un montant positif.'} onChangeText={setExpense} /> : null}
    <TextArea label="Compte rendu" placeholder="Ajoutez les informations utiles…" value={comment} maxLength={500} helperText={`${comment.length}/500`} onChangeText={setComment} />
  </FormSheet>;
}
