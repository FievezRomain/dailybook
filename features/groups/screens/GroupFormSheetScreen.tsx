import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';

import { groupDetailsSchema, groupMemberEmailSchema, type GroupDetailsValues } from '../../../business/validators/group';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useGroupMutations } from '../../../hooks/queries/useGroupsQuery';
import type { Group } from '../../../models/Group';
import LoggerService from '../../../services/logs/LoggerService';
import { AnimalSelectorItem, Banner, Button, ControlledField, ControlledTextField, FormSheet, IconButton, LinearProgress, TextArea, TextField } from '../../../shared/components/ui';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { parseApiError } from '../../../utils/errorParser';
import { getAcceptedAnimals, getAcceptedMembers, getPendingAnimals, getPendingMembers } from '../groupUtils';

interface GroupFormSheetScreenProps {
  mode: 'create' | 'edit';
  group?: Group;
  initialStep?: 0 | 1 | 2;
  onClose: () => void;
  onSaved: (groupId?: number) => void;
}

type GroupWizardStep = 0 | 1 | 2 | 3;

export function GroupFormSheetScreen({ mode, group, initialStep = 0, onClose, onSaved }: GroupFormSheetScreenProps) {
  const { colors } = useAppTheme();
  const animalsQuery = useAnimalsQuery();
  const mutations = useGroupMutations();
  const existingMemberEmails = useMemo(() => group ? [...getAcceptedMembers(group), ...getPendingMembers(group)].map((member) => member.email.trim().toLocaleLowerCase()) : [], [group]);
  const existingAnimalIds = useMemo(() => group ? [...getAcceptedAnimals(group), ...getPendingAnimals(group)].map((animal) => animal.id) : [], [group]);
  const [step, setStep] = useState<GroupWizardStep>(initialStep);
  const [members, setMembers] = useState<string[]>(mode === 'create' ? [''] : []);
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<number[]>(existingAnimalIds);
  const [memberError, setMemberError] = useState<string>();
  const [saveError, setSaveError] = useState<string>();
  const form = useForm<GroupDetailsValues>({ resolver: zodResolver(groupDetailsSchema), defaultValues: { name: group?.name ?? '', informations: group?.informations ?? '' } });
  const values = form.watch();
  const pending = Object.values(mutations).some((mutation) => mutation.isPending);
  const newMemberEmails = members.map((email) => email.trim().toLocaleLowerCase()).filter((email) => email && !existingMemberEmails.includes(email));
  const newAnimalIds = selectedAnimalIds.filter((id) => !existingAnimalIds.includes(id));
  const dirty = form.formState.isDirty || newMemberEmails.length > 0 || newAnimalIds.length > 0;

  useEffect(() => {
    form.reset({ name: group?.name ?? '', informations: group?.informations ?? '' });
    setMembers(mode === 'create' ? [''] : []);
    setSelectedAnimalIds(existingAnimalIds);
    setStep(initialStep);
    setMemberError(undefined);
    setSaveError(undefined);
  }, [existingAnimalIds, form, group, initialStep, mode]);

  const validateMembers = () => {
    setMemberError(undefined);
    const entered = members.map((email) => email.trim()).filter(Boolean);
    if (mode === 'create' && entered.length === 0) { setMemberError('Ajoutez au moins une invitation e-mail.'); return false; }
    const invalid = entered.find((email) => !groupMemberEmailSchema.safeParse(email).success);
    if (invalid) { setMemberError(`Corrigez l’adresse ${invalid}.`); return false; }
    if (new Set(entered.map((email) => email.toLocaleLowerCase())).size !== entered.length) { setMemberError('Chaque adresse e-mail ne doit apparaître qu’une fois.'); return false; }
    return true;
  };

  const submit = async () => {
    const parsed = groupDetailsSchema.safeParse(form.getValues());
    if (!parsed.success || !validateMembers()) return;
    setSaveError(undefined);
    try {
      let savedGroupId = group?.id;
      if (mode === 'edit' && group) {
        await mutations.update.mutateAsync({ id: String(group.id), body: { id: group.id, name: parsed.data.name.trim(), informations: parsed.data.informations.trim() || undefined } });
      } else {
        const created = await mutations.create.mutateAsync({ name: parsed.data.name.trim(), informations: parsed.data.informations.trim() || undefined });
        savedGroupId = created.id;
      }
      if (!savedGroupId) throw new Error('Missing group id');
      if (newMemberEmails.length) await mutations.inviteMembers.mutateAsync({ groupId: String(savedGroupId), body: { members: newMemberEmails } });
      if (newAnimalIds.length) await mutations.proposeAnimal.mutateAsync({ groupId: String(savedGroupId), body: { animals: newAnimalIds } });
      onSaved(savedGroupId);
    } catch (error) {
      setSaveError(parseApiError(error).message);
      LoggerService.error('Group wizard submit failed', error, { feature: 'groups', operation: mode, step, memberCount: newMemberEmails.length, selectedAnimalCount: newAnimalIds.length });
    }
  };

  const continueWizard = async () => {
    setSaveError(undefined);
    if (step === 0) { if (await form.trigger()) setStep(1); return; }
    if (step === 1) { if (validateMembers()) setStep(2); return; }
    if (step === 2) { setStep(3); return; }
    await submit();
  };
  const toggleAnimal = (animalId: number) => {
    if (existingAnimalIds.includes(animalId)) return;
    setSelectedAnimalIds((current) => current.includes(animalId) ? current.filter((id) => id !== animalId) : [...current, animalId]);
  };
  const footerLabel = step === 3 ? (mode === 'edit' ? 'Enregistrer les modifications' : 'Créer le groupe') : 'Continuer';

  return <FormSheet title={mode === 'edit' ? 'Modifier le groupe' : 'Créer un groupe'} onBack={() => step > 0 ? setStep((step - 1) as GroupWizardStep) : onClose()} onClose={onClose} dirty={dirty} confirmBackWhenDirty={step === 0} footerLabel={footerLabel} onFooterPress={() => void continueWizard()} footerDisabled={pending} footerLoading={pending} testID="group-form-sheet">
    <LinearProgress current={step + 1} total={4} label={`Étape ${step + 1} sur 4`} />
    <View style={{ gap: spacing.xs, marginTop: spacing.md }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 35 }}>{step === 0 ? 'Informations' : step === 1 ? 'Membres' : step === 2 ? 'Animaux' : 'Vérification'}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 20 }}>{step === 0 ? 'Donnez un nom clair à cet espace partagé.' : step === 1 ? 'Invitez les personnes qui participeront au suivi.' : step === 2 ? 'Proposez les animaux à partager, maintenant ou plus tard.' : 'Relisez les informations avant de confirmer.'}</Text></View>
    {step === 0 ? <><ControlledTextField control={form.control} name="name" label="Nom du groupe" placeholder="Ex. Famille" required helperText="Obligatoire" maxLength={120} autoCapitalize="sentences" testID="group-name" /><ControlledField control={form.control} name="informations">{({ value, onChange, onBlur, errorMessage }) => <TextArea label="Informations" placeholder="But du groupe, organisation…" value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={errorMessage} helperText="Optionnel" maxLength={500} testID="group-information" />}</ControlledField></> : null}
    {step === 1 ? <View style={{ gap: spacing.md }}>
      {existingMemberEmails.length ? <View style={{ gap: spacing.xs }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>Déjà membres ou invités</Text>{existingMemberEmails.map((email) => <Text key={email} style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{email}</Text>)}</View> : null}
      {members.map((email, index) => <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm }}><View style={{ flex: 1 }}><TextField label={`E-mail ${index + 1}`} placeholder="nom@exemple.fr" value={email} keyboardType="email-address" autoCapitalize="none" maxLength={254} onChangeText={(value) => setMembers((current) => current.map((item, itemIndex) => itemIndex === index ? value : item))} /></View>{members.length > 1 || mode === 'edit' ? <IconButton icon="delete" accessibilityLabel={`Supprimer l’adresse ${index + 1}`} variant="ghost" onPress={() => setMembers((current) => current.filter((_, itemIndex) => itemIndex !== index))} /> : null}</View>)}
      <Button label="Ajouter une adresse" icon="add" variant="secondary" onPress={() => setMembers((current) => [...current, ''])} />
      {memberError ? <Banner tone="error" title="Invitation à corriger" message={memberError} blocking /> : null}
    </View> : null}
    {step === 2 ? <View style={{ gap: spacing.md }}>{animalsQuery.isLoading ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium }}>Chargement des animaux…</Text> : animalsQuery.isError ? <Banner tone="error" title="Animaux indisponibles" message="Vous pouvez continuer sans animal et en ajouter plus tard." /> : (animalsQuery.data ?? []).length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: spacing.sm }}><View style={{ flexDirection: 'row' }}>{(animalsQuery.data ?? []).map((animal) => <AnimalSelectorItem key={animal.id} name={animal.nom} imageUrl={animal.imageUrl} selected={selectedAnimalIds.includes(animal.id)} disabled={existingAnimalIds.includes(animal.id)} onPress={() => toggleAnimal(animal.id)} testID={`group-animal-${animal.id}`} />)}</View></ScrollView> : <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium }}>Aucun animal disponible. Vous pourrez en proposer un plus tard.</Text>}<Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>Les animaux déjà partagés restent sélectionnés. Leur retrait se fait depuis le détail du groupe avec confirmation.</Text></View> : null}
    {step === 3 ? <GroupReview name={values.name} informations={values.informations} memberEmails={[...existingMemberEmails, ...newMemberEmails]} animalNames={(animalsQuery.data ?? []).filter((animal) => selectedAnimalIds.includes(animal.id)).map((animal) => animal.nom)} /> : null}
    {saveError ? <Banner tone="error" title="Enregistrement impossible" message={saveError} blocking testID="group-save-error" /> : null}
  </FormSheet>;
}

function GroupReview({ name, informations, memberEmails, animalNames }: { name: string; informations: string; memberEmails: string[]; animalNames: string[] }) {
  const { colors } = useAppTheme();
  const rows = [['Groupe', name], ['Informations', informations || 'Aucune'], ['Membres', memberEmails.join(', ') || 'Aucun'], ['Animaux', animalNames.join(', ') || 'Aucun']];
  return <View style={{ gap: spacing.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.surface }}>{rows.map(([label, value]) => <View key={label} style={{ flexDirection: 'row', gap: spacing.md }}><Text style={{ width: 82, color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{label}</Text><Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{value}</Text></View>)}</View>;
}
