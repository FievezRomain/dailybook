import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { Animal } from '../../../models/Animal';
import { useAnimalMutations } from '../../../hooks/queries/useAnimalsQuery';
import { uploadFile } from '../../../services/aws/FileStorageService';
import { useAnimalWizardStore, type AnimalWizardFormData } from '../../../stores/useAnimalWizardStore';
import { Banner, CalendarPicker, FormSheet, IconButton, LinearProgress, MediaUpload, Select, SelectionModal, TextArea, TextField } from '../../../shared/components/ui';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { animalFormFingerprint, animalToWizardForm, buildAnimalPayload, buildAnimalUpdatePayload, buildChangedAnimalHistory, formDateLabel, getAnimalSaveError, isAnimalBodyValid, isAnimalProfileValid, pickerDate } from '../animalFormUtils';

const steps = [['Son profil', 'Commençons par les informations essentielles.'], ['Dates importantes', 'Elles permettent d’adapter l’âge et le suivi.'], ['Identité', 'Ajoutez les éléments utiles pour le reconnaître.'], ['Origines', 'Ces informations restent modifiables à tout moment.'], ['Corps & alimentation', 'Des repères précis pour un suivi quotidien utile.'], ['Notes & vérification', 'Un dernier regard avant d’enregistrer le profil.']] as const;
const choices = { species: ['Chat', 'Chien', 'Poisson', 'Oiseaux', 'Lapin', 'Rongeur', 'Reptile', 'Furet', 'Cheval', 'Poney', 'Âne', 'Mulet et bardot', 'Poule', 'Canard', 'Cochon', 'Chèvre', 'Mouton', 'Bovin', 'Dinde', 'Oie', 'Caille', 'Écureuil', 'Amphibien', 'Insecte', 'Crustacé', 'Arachnide', 'Lama et alpaga', 'Autruche et émeu', 'Autre'], unit: ['g', 'kg', 'ml', 'portion'] } as const;

export interface AnimalFormSheetScreenProps { mode: 'create' | 'edit'; animal?: Animal; onClose: () => void; onSaved: (animal: Animal) => void }

export function AnimalFormSheetScreen({ mode, animal, onClose, onSaved }: AnimalFormSheetScreenProps) {
  const { colors } = useAppTheme(); const mutations = useAnimalMutations();
  const step = useAnimalWizardStore((state) => state.step); const form = useAnimalWizardStore((state) => state.formData); const setStep = useAnimalWizardStore((state) => state.setStep); const setField = useAnimalWizardStore((state) => state.setField); const replaceFormData = useAnimalWizardStore((state) => state.replaceFormData);
  const [baseline, setBaseline] = useState('{}'); const [showErrors, setShowErrors] = useState(false); const [selection, setSelection] = useState<keyof typeof choices>(); const [calendarField, setCalendarField] = useState<'datenaissance' | 'datearrivee' | 'datedepart'>(); const [photoUploading, setPhotoUploading] = useState(false); const [localError, setLocalError] = useState<{ title: string; message: string }>();
  useEffect(() => { const initial = mode === 'edit' && animal ? animalToWizardForm(animal) : {}; replaceFormData(initial); setBaseline(animalFormFingerprint(initial)); }, [animal, mode, replaceFormData]);
  const dirty = animalFormFingerprint(form) !== baseline; const pending = mutations.create.isPending || mutations.update.isPending || mutations.createHistory.isPending || photoUploading; const datesValid = isManualDateValid(form.datenaissance, true) && isManualDateValid(form.datearrivee) && isManualDateValid(form.datedepart); const valid = step === 0 ? isAnimalProfileValid(form) : step === 1 ? datesValid : step === 4 ? isAnimalBodyValid(form) : true;
  const choosePhoto = async () => { const permission = await ImagePicker.requestMediaLibraryPermissionsAsync(); if (!permission.granted) { setLocalError({ title: 'Accès aux photos requis', message: 'Autorisez Vasco à accéder aux photos pour ajouter une image.' }); return; } const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 }); if (!result.canceled) { setLocalError(undefined); setField('image', result.assets[0].uri); } };
  const save = async () => {
    if (!valid) { setShowErrors(true); return; }
    if (step < 5) { setShowErrors(false); setStep(step + 1); return; }
    setLocalError(undefined);
    try {
      let prepared = form;
      let createdWithoutPhoto: Animal | undefined;
      if (mode === 'create' && form.image?.startsWith('file:')) {
        createdWithoutPhoto = await mutations.create.mutateAsync(buildAnimalPayload({ ...form, image: undefined }));
      }
      if (form.image?.startsWith('file:')) {
        setPhotoUploading(true);
        const filename = form.image.split('/').pop() || 'animal.jpg';
        const targetId = animal?.id ?? createdWithoutPhoto?.id;
        if (!targetId) throw new Error('Animal identifier missing before image upload');
        const uploaded = await uploadFile(form.image, filename, 'image/jpeg', 'animal', String(targetId));
        if (!uploaded) { setLocalError({ title: 'Import de la photo impossible', message: 'La photo n’a pas été envoyée. Vos informations sont conservées.' }); return; }
        prepared = { ...form, image: uploaded };
      }
      const saved = mode === 'edit' && animal
        ? await mutations.update.mutateAsync({ id: String(animal.id), body: buildAnimalUpdatePayload(prepared, animal.id) })
        : createdWithoutPhoto
          ? await mutations.update.mutateAsync({ id: String(createdWithoutPhoto.id), body: buildAnimalUpdatePayload(prepared, createdWithoutPhoto.id) })
          : await mutations.create.mutateAsync(buildAnimalPayload(prepared));
      if (mode === 'edit' && animal) {
        const history = buildChangedAnimalHistory(prepared, animal, new Date().toISOString().slice(0, 10));
        await Promise.all(history.map((body) => mutations.createHistory.mutateAsync({ animalId: String(animal.id), body })));
      }
      onSaved(saved);
    } catch (error) { setLocalError(getAnimalSaveError(error, mode)); }
    finally { setPhotoUploading(false); }
  };
  const field = (key: keyof AnimalWizardFormData, label: string, placeholder: string, helperText = 'Optionnel', keyboardType?: 'decimal-pad') => <TextField label={label} placeholder={placeholder} value={form[key] ?? ''} helperText={helperText} keyboardType={keyboardType} onChangeText={(value) => setField(key, value)} />;
  const dateField = (key: 'datenaissance' | 'datearrivee' | 'datedepart', label: string, helperText: string) => {
    const displayed = formDateLabel(form[key]) ?? form[key] ?? '';
    const birthDate = key === 'datenaissance';
    const invalid = Boolean(displayed) && !isManualDateValid(displayed, birthDate);
    return <TextField label={label} placeholder="JJ/MM/AAAA" value={displayed} helperText={helperText} keyboardType="number-pad" maxLength={10} errorMessage={(showErrors || displayed.length === 10) && invalid ? birthDate && isFutureDate(displayed) ? 'La date de naissance ne peut pas être future.' : 'Utilisez une date valide au format JJ/MM/AAAA.' : undefined} onChangeText={(value) => setField(key, maskManualDate(value))} trailing={<IconButton icon="calendar" accessibilityLabel={`Ouvrir le calendrier pour ${label}`} variant="ghost" size="small" onPress={() => setCalendarField(key)} />} />;
  };
  const selectedValue = selection === 'species' ? form.espece : form.unity;
  return <><FormSheet title={mode === 'edit' ? `Modifier ${animal?.nom ?? 'l’animal'}` : 'Ajouter un animal'} onBack={() => step ? setStep(step - 1) : onClose()} onClose={onClose} dirty={dirty} confirmBackWhenDirty={step === 0} footerLabel={step === 5 ? (mode === 'edit' ? 'Enregistrer les modifications' : 'Créer le profil') : 'Continuer'} onFooterPress={() => void save()} footerDisabled={pending} footerLoading={pending} testID="animal-form-sheet">
    <LinearProgress current={step + 1} total={6} label={`Étape ${step + 1} sur 6`} /><View style={{ gap: spacing.xs, marginTop: spacing.md }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: typography.lineHeights.loose }}>{steps[step][0]}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{steps[step][1]}</Text></View>
    {step === 0 ? <><MediaUpload state={photoUploading ? 'uploading' : form.image ? 'success' : 'empty'} onPress={() => void choosePhoto()} empty={{ title: 'Ajouter une photo', description: 'PNG, JPG · 10 Mo max' }} success={form.image?.startsWith('file:') ? { title: 'Nouvelle photo sélectionnée', description: 'Touchez pour en choisir une autre' } : { title: 'Photo actuelle', description: 'Touchez pour la remplacer' }} accessibilityLabel={form.image?.startsWith('file:') ? 'Nouvelle photo sélectionnée, toucher pour la remplacer' : 'Photo actuelle, toucher pour la remplacer'} />{field('nom', 'Nom de l’animal', 'Ex. Vasco', 'Obligatoire')}<Select label="Espèce" placeholder="Sélectionner une espèce" value={form.espece} required helperText="Obligatoire" errorMessage={showErrors && !form.espece ? 'Sélectionnez une espèce.' : undefined} onPress={() => setSelection('species')} /></> : null}
    {step === 1 ? <>{dateField('datenaissance', 'Date de naissance', 'Si inconnue, indiquez une estimation')}{dateField('datearrivee', 'Date d’arrivée', 'Optionnel')}{dateField('datedepart', 'Date de départ', 'Optionnel — peut être ajouté plus tard')}</> : null}
    {step === 2 ? <>{field('race', 'Race', 'Ex. Fjord')}{field('sexe', 'Sexe', 'Ex. Mâle')}{field('couleur', 'Couleur', 'Ex. Isabelle')}{field('numeroidentification', 'N° d’identification', 'Ex. XXXXXXXXX')}</> : null}
    {step === 3 ? <>{field('nompere', 'Nom du père', 'Optionnel')}{field('nommere', 'Nom de la mère', 'Optionnel')}<InfoBox>Ces données servent uniquement à compléter le profil et le suivi de l’animal.</InfoBox></> : null}
    {step === 4 ? <>{field('poids', 'Poids', 'Ex. 400 kg', 'Optionnel', 'decimal-pad')}{field('taille', 'Taille', 'Ex. 140 cm', 'Optionnel', 'decimal-pad')}{field('food', 'Alimentation', 'Ex. Granulés X')}{field('quantity', 'Quantité', 'Ex. 200', 'Optionnel', 'decimal-pad')}<Select label="Unité" placeholder="g / kg / ml / portion" value={form.unity} helperText="Optionnel" onPress={() => setSelection('unit')} />{showErrors && !valid ? <Text accessibilityRole="alert" style={{ color: colors.error }}>Poids, taille et quantité doivent être numériques.</Text> : null}</> : null}
    {step === 5 ? <><TextArea label="Informations complémentaires" placeholder="Allergies, habitudes, particularités…" value={form.informations ?? ''} helperText={`${form.informations?.length ?? 0}/500`} maxLength={500} onChangeText={(value) => setField('informations', value)} /><Summary form={form} onEdit={() => setStep(0)} />{localError ? <Banner tone="error" title={localError.title} message={localError.message} blocking testID="animal-save-error" /> : null}</> : null}
  </FormSheet><SelectionModal open={Boolean(selection)} title={selection === 'species' ? 'Choisir une espèce' : 'Choisir une unité'} options={(selection ? choices[selection] : []).map((label) => ({ id: label, label }))} selectedIds={selectedValue ? [selectedValue] : []} onChange={(ids) => { const value = ids[0]; if (selection === 'species') setField('espece', value); else setField('unity', value); }} onConfirm={() => setSelection(undefined)} onClose={() => setSelection(undefined)} /><CalendarPicker open={Boolean(calendarField)} maximumDate={calendarField === 'datenaissance' ? new Date().toISOString().slice(0, 10) : undefined} current={calendarField ? pickerDate(form[calendarField]) : undefined} selectedStart={calendarField ? pickerDate(form[calendarField]) : undefined} onSelectDay={(value) => calendarField && setField(calendarField, value)} onConfirm={() => setCalendarField(undefined)} onClose={() => setCalendarField(undefined)} /></>;
}
function maskManualDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/');
}
function parsedManualDate(value?: string) {
  if (!value) return undefined;
  const normalized = formDateLabel(value) ?? value;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(normalized);
  if (!match) return undefined;
  const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]), 12);
  return date.getFullYear() === Number(match[3]) && date.getMonth() === Number(match[2]) - 1 && date.getDate() === Number(match[1]) ? date : undefined;
}
function isFutureDate(value?: string) {
  const parsed = parsedManualDate(value);
  if (!parsed) return false;
  const today = new Date(); today.setHours(23, 59, 59, 999);
  return parsed > today;
}
function isManualDateValid(value?: string, rejectFuture = false) {
  if (!value) return true;
  const parsed = parsedManualDate(value);
  return Boolean(parsed && (!rejectFuture || !isFutureDate(value)));
}

function InfoBox({ children }: { children: string }) { const { colors } = useAppTheme(); return <View style={{ padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.backgroundPaper }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{children}</Text></View>; }
function Summary({ form, onEdit }: { form: AnimalWizardFormData; onEdit: () => void }) { const { colors } = useAppTheme(); const rows = [['Profil', [form.nom, form.espece].filter(Boolean).join(' · ')], ['Dates', form.datenaissance || 'Non renseignées'], ['Identité', [form.race, form.sexe].filter(Boolean).join(' · ') || 'Non renseignée'], ['Origines', [form.nompere, form.nommere].filter(Boolean).join(' · ') || 'Non renseignées'], ['Corps', [form.poids && `${form.poids} kg`, form.taille && `${form.taille} cm`].filter(Boolean).join(' · ') || 'Non renseigné'], ['Alimentation', [form.food, form.quantity && `${form.quantity} ${form.unity ?? ''}`].filter(Boolean).join(' · ') || 'Non renseignée']]; return <View style={{ gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.surface }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.lg }}>Récapitulatif</Text>{rows.map(([label, value]) => <View key={label} style={{ flexDirection: 'row', gap: spacing.md }}><Text style={{ width: 88, color: colors.textSecondary, fontFamily: typography.fonts.regular }}>{label}</Text><Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.medium }}>{value}</Text></View>)}<Text accessibilityRole="button" onPress={onEdit} style={{ alignSelf: 'flex-end', color: colors.primaryDark, fontFamily: typography.fonts.medium }}>Modifier une section</Text></View>; }
