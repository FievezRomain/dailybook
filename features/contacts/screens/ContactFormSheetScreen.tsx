import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useForm } from 'react-hook-form';

import { contactFormSchema, type ContactFormValues } from '@business/validators/contact';
import { useContactMutations } from '@hooks/queries/useContactsQuery';
import type { Contact } from '@models/Contact';
import LoggerService from '@services/logs/LoggerService';
import { Banner, ControlledTextField, FormSheet, LinearProgress } from '@shared/components/ui';
import { radii, spacing, typography } from '@theme/scales';
import { useAppTheme } from '@theme/useAppTheme';
import { parseApiError } from '@utils/errorParser';

import { buildContactPayload, buildContactUpdatePayload, contactToDraft } from '../contactUtils';

interface ContactFormSheetScreenProps {
  mode: 'create' | 'edit';
  contact?: Contact;
  onClose: () => void;
  onSaved: (contactId?: number) => void;
}

export function ContactFormSheetScreen({ mode, contact, onClose, onSaved }: ContactFormSheetScreenProps) {
  const { colors } = useAppTheme();
  const mutations = useContactMutations();
  const [step, setStep] = useState(0);
  const [saveError, setSaveError] = useState<string>();
  const form = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema), defaultValues: contactToDraft(contact) });
  const values = form.watch();
  const pending = mutations.create.isPending || mutations.update.isPending;

  useEffect(() => {
    form.reset(contactToDraft(contact));
    setStep(0);
    setSaveError(undefined);
  }, [contact, form]);

  const continueWizard = async () => {
    setSaveError(undefined);
    if (step === 0) {
      if (!(await form.trigger(['nom', 'profession']))) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!(await form.trigger(['telephone', 'email']))) return;
      setStep(2);
      return;
    }
    const parsed = contactFormSchema.safeParse(form.getValues());
    if (!parsed.success) return;
    try {
      if (mode === 'edit' && contact) {
        await mutations.update.mutateAsync({ id: String(contact.id), body: buildContactUpdatePayload(parsed.data, contact) });
        onSaved(contact.id);
      } else {
        const created = await mutations.create.mutateAsync(buildContactPayload(parsed.data));
        onSaved(created.id);
      }
    } catch (error) {
      setSaveError(parseApiError(error).message);
      LoggerService.error('Contact form submit failed', error, { feature: 'contacts', operation: mode, step });
    }
  };

  const footerLabel = step === 2 ? (mode === 'edit' ? 'Enregistrer les modifications' : 'Créer le contact') : 'Continuer';

  return (
    <FormSheet title="Contacts" onBack={() => step > 0 ? setStep(step - 1) : onClose()} onClose={onClose} dirty={form.formState.isDirty} confirmBackWhenDirty={step === 0} footerLabel={footerLabel} onFooterPress={() => void continueWizard()} footerDisabled={pending} footerLoading={pending} testID="contact-form-sheet">
      <LinearProgress current={step + 1} total={3} label={`Étape ${step + 1} sur 3`} />
      <View style={{ gap: spacing.xs, marginTop: spacing.md }}>
        <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 35 }}>{step === 0 ? (mode === 'edit' ? 'Modifier le contact' : 'Nouveau contact') : step === 1 ? 'Coordonnées' : 'Vérification'}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 20 }}>{step === 0 ? 'Ajoutez uniquement les informations utiles' : step === 1 ? 'Ajoutez seulement les moyens de contact utiles' : 'Relisez les informations avant de valider'}</Text>
      </View>
      {step === 0 ? <>
        <ControlledTextField control={form.control} name="nom" label="Nom" placeholder="Ex. Claire Martin" required maxLength={120} autoCapitalize="words" testID="contact-name" />
        <ControlledTextField control={form.control} name="profession" label="Rôle" placeholder="Ex. Vétérinaire" maxLength={120} testID="contact-role" />
      </> : null}
      {step === 1 ? <>
        <ControlledTextField control={form.control} name="telephone" label="Téléphone · optionnel" placeholder="Ex. 06 00 00 00 00" keyboardType="phone-pad" maxLength={30} testID="contact-phone" />
        <ControlledTextField control={form.control} name="email" label="E-mail · optionnel" placeholder="Ex. nom@exemple.fr" keyboardType="email-address" autoCapitalize="none" maxLength={254} testID="contact-email" />
      </> : null}
      {step === 2 ? <View style={{ gap: spacing.lg, padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.surfaceVariant }}>
        <SummaryRow value={`${values.nom}${values.profession ? ` · ${values.profession}` : ''}`} strong />
        <SummaryRow value={values.telephone || 'Téléphone non renseigné'} />
        <SummaryRow value={values.email || 'E-mail non renseigné'} />
      </View> : null}
      {saveError ? <Banner tone="error" title="Enregistrement impossible" message={saveError} blocking testID="contact-save-error" /> : null}
    </FormSheet>
  );
}

function SummaryRow({ value, strong = false }: { value: string; strong?: boolean }) {
  const { colors } = useAppTheme();
  return <Text style={{ color: strong ? colors.textPrimary : colors.textSecondary, fontFamily: strong ? typography.fonts.semiBold : typography.fonts.regular, fontSize: strong ? typography.sizes.md : typography.sizes.sm, lineHeight: 22 }}>{value}</Text>;
}