import { useState } from 'react';
import { Text } from 'react-native';
import type { Animal } from '../../../models/Animal';
import { useAnimalMutations } from '../../../hooks/queries/useAnimalsQuery';
import { CalendarPicker, DateTimeField, Dialog, FormSheet } from '../../../shared/components/ui';
import { typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { animalToWizardForm, buildAnimalUpdatePayload } from '../animalFormUtils';

export type SensitiveAnimalAction = 'departure' | 'death' | 'delete';
export interface AnimalActionDialogsProps { action: SensitiveAnimalAction; animal: Animal; onClose: () => void; onDone: () => void }

export function AnimalActionDialogs({ action, animal, onClose, onDone }: AnimalActionDialogsProps) {
  const { colors } = useAppTheme(); const mutations = useAnimalMutations();
  const [date, setDate] = useState<string>(); const [calendarOpen, setCalendarOpen] = useState(false); const [error, setError] = useState<string>();
  if (action === 'delete') return <Dialog open type="destructive" title={`Supprimer définitivement ${animal.nom} ?`} description={`Le profil, le carnet, les mesures et les documents de ${animal.nom} seront supprimés. Cette action est irréversible.${error ? `\n\n${error}` : ''}`} confirmLabel="Supprimer" loading={mutations.remove.isPending} onClose={onClose} onConfirm={async () => { try { await mutations.remove.mutateAsync(String(animal.id)); onDone(); } catch { setError('Impossible de supprimer cet animal. Réessayez.'); throw new Error('delete-animal'); } }} onError={() => undefined} testID="animal-delete-dialog" />;
  const noun = action === 'departure' ? 'départ' : 'décès';
  const confirm = async () => { if (!date) { setError(`La date de ${noun} est obligatoire.`); return; } setError(undefined); try { const form = animalToWizardForm(animal); form[action === 'departure' ? 'datedepart' : 'datedeces'] = date; await mutations.update.mutateAsync({ id: String(animal.id), body: buildAnimalUpdatePayload(form, animal.id) }); onDone(); } catch { setError(`Impossible de signaler ce ${noun}. Réessayez.`); } };
  return <><FormSheet title={`Signaler le ${noun} de ${animal.nom}`} onBack={onClose} onClose={onClose} dirty={Boolean(date)} confirmBackWhenDirty footerLabel="Confirmer" onFooterPress={() => void confirm()} footerDisabled={!date} footerLoading={mutations.update.isPending} testID={`animal-${action}-sheet`}>
    <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: typography.lineHeights.normal }}>{action === 'departure' ? `${animal.nom} sera déplacé dans la partie Historique. Son carnet et toutes ses données resteront accessibles.` : `Cette information sensible déplace ${animal.nom} dans l’Historique sans supprimer son carnet.`}</Text>
    <DateTimeField kind="date" label={`Date de ${noun}`} placeholder="JJ / MM / AAAA" value={date} required helperText="Obligatoire" errorMessage={error} onPress={() => setCalendarOpen(true)} />
  </FormSheet><CalendarPicker open={calendarOpen} current={date} selectedStart={date} onSelectDay={setDate} onConfirm={() => setCalendarOpen(false)} onClose={() => setCalendarOpen(false)} /></>;
}
