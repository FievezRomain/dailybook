import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useForm } from 'react-hook-form';

import { wishFormSchema, type WishFormValues } from '@business/validators/wish';
import { useWishMutations } from '@hooks/queries/useWishesQuery';
import type { Wish } from '@models/Wish';
import { FileService } from '@services/api/FileService';
import LoggerService from '@services/logs/LoggerService';
import { Banner, ControlledTextField, FormSheet, LinearProgress, MediaUpload } from '@shared/components/ui';
import { radii, spacing, typography } from '@theme/scales';
import { useAppTheme } from '@theme/useAppTheme';
import { parseApiError } from '@utils/errorParser';

import { buildWishPayload, buildWishUpdatePayload, getWishLinkLabel, wishToDraft } from '../wishUtils';

interface WishFormSheetScreenProps {
  mode: 'create' | 'edit';
  wish?: Wish;
  onClose: () => void;
  onSaved: (wishId?: number) => void;
}
export function WishFormSheetScreen({ mode, wish, onClose, onSaved }: WishFormSheetScreenProps) {
  const { colors } = useAppTheme();
  const mutations = useWishMutations();
  const [step, setStep] = useState(0);
  const [imageAsset, setImageAsset] = useState<ImagePicker.ImagePickerAsset>();
  const [createdWishId, setCreatedWishId] = useState<number>();
  const [saveError, setSaveError] = useState<string>();
  const [permissionError, setPermissionError] = useState(false);
  const initial = wishToDraft(wish);
  const form = useForm<WishFormValues>({ resolver: zodResolver(wishFormSchema), defaultValues: initial });
  const values = form.watch();
  const pending = mutations.create.isPending || mutations.update.isPending;
  const dirty = form.formState.isDirty || Boolean(imageAsset);

  useEffect(() => {
    form.reset(wishToDraft(wish));
    setStep(0);
    setImageAsset(undefined);
    setCreatedWishId(undefined);
  }, [form, wish]);

  const chooseImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setPermissionError(true);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (!result.canceled) {
      setPermissionError(false);
      setImageAsset(result.assets[0]);
    }
  };

  const continueWizard = async () => {
    setSaveError(undefined);
    if (step === 0) {
      if (!(await form.trigger(['nom', 'url']))) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!(await form.trigger(['prix', 'destinataire']))) return;
      setStep(2);
      return;
    }
    await saveWish();
  };

  const saveWish = async () => {
    const parsed = wishFormSchema.safeParse(form.getValues());
    if (!parsed.success) return;
    const payload = buildWishPayload(parsed.data);
    try {
      let savedId = wish?.id ?? createdWishId;
      if (mode === 'create' && !savedId) {
        const created = await mutations.create.mutateAsync(payload);
        savedId = created.id;
        setCreatedWishId(savedId);
      }
      if (!savedId) throw new Error('Wish identifier missing after creation');

      let uploadedImage = wish?.image;
      if (imageAsset) {
        uploadedImage = await FileService.upload(
          imageAsset.uri,
          `wish-${savedId}-${Date.now()}.jpg`,
          imageAsset.mimeType || 'image/jpeg',
          'wish',
          savedId,
        );
      }
      if (mode === 'edit' && wish) {
        await mutations.update.mutateAsync({ id: String(savedId), body: buildWishUpdatePayload(parsed.data, wish, uploadedImage) });
      } else if (imageAsset) {
        const createdWish: Wish = { id: savedId, nom: payload.nom, destinataire: payload.destinataire ?? 'Pour moi', acquis: false, url: payload.url, prix: payload.prix, image: uploadedImage };
        await mutations.update.mutateAsync({ id: String(savedId), body: buildWishUpdatePayload(parsed.data, createdWish, uploadedImage) });
      }
      onSaved(savedId);
    } catch (error) {
      const message = createdWishId || (mode === 'create' && mutations.create.isSuccess)
        ? "Le souhait est enregistré, mais l’image n’a pas pu être ajoutée. Réessayez sans recréer le souhait."
        : parseApiError(error).message;
      setSaveError(message);
      LoggerService.error('Wish form submit failed', error, { feature: 'wishes', operation: mode, step, hasCreatedWish: Boolean(createdWishId) });
    }
  };

  const footerLabel = step === 2 ? (mode === 'edit' ? 'Enregistrer les modifications' : 'Créer le souhait') : 'Continuer';

  return (
    <FormSheet
      title="Souhaits"
      onBack={() => step > 0 ? setStep(step - 1) : onClose()}
      onClose={onClose}
      dirty={dirty}
      confirmBackWhenDirty={step === 0}
      footerLabel={footerLabel}
      onFooterPress={() => void continueWizard()}
      footerDisabled={pending}
      footerLoading={pending}
      testID="wish-form-sheet"
    >
      <LinearProgress current={step + 1} total={3} label={`Étape ${step + 1} sur 3`} />
      <View style={{ gap: spacing.xs, marginTop: spacing.md }}>
        <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 35 }}>{step === 0 ? (mode === 'edit' ? 'Modifier le souhait' : 'Nouveau souhait') : step === 1 ? 'Détails complémentaires' : 'Vérification'}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 20 }}>{step === 0 ? 'Ajoutez une envie, le reste peut attendre' : step === 1 ? 'Prix et destinataire restent optionnels' : 'Relisez les informations avant de valider'}</Text>
      </View>
      {step === 0 ? <>
        <MediaUpload state={imageAsset || wish?.image ? 'success' : 'empty'} onPress={() => void chooseImage()} empty={{ title: 'Ajouter une image · optionnel', description: 'Choisir une photo dans votre bibliothèque' }} success={{ title: imageAsset ? 'Nouvelle image sélectionnée' : 'Image actuelle', description: 'Touchez pour remplacer' }} testID="wish-image" />
        <ControlledTextField control={form.control} name="nom" label="Nom" placeholder="Ex. Selle western" required maxLength={120} testID="wish-name" />
        <ControlledTextField control={form.control} name="url" label="Lien · optionnel" placeholder="https://vascoandco.fr" autoCapitalize="none" keyboardType="url" maxLength={500} testID="wish-url" />
      </> : null}
      {step === 1 ? <>
        <ControlledTextField control={form.control} name="prix" label="Prix · optionnel" placeholder="Ex. 20 €" keyboardType="decimal-pad" maxLength={30} testID="wish-price" />
        <ControlledTextField control={form.control} name="destinataire" label="Destinataire · optionnel" placeholder="Par défaut, pour vous" maxLength={120} testID="wish-recipient" />
      </> : null}
      {step === 2 ? <View style={{ gap: spacing.lg, padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.surfaceVariant }}>
        <SummaryRow label="Nom" value={values.nom} strong />
        <SummaryRow label="Lien" value={getWishLinkLabel(values.url) ?? 'Non renseigné'} />
        <SummaryRow label="Prix" value={values.prix || 'Non renseigné'} />
        <SummaryRow label="Destinataire" value={values.destinataire || 'Pour moi'} />
      </View> : null}
      {permissionError ? <Banner tone="error" title="Accès aux photos requis" message="Autorisez Vasco à accéder à vos photos pour ajouter une image." onDismiss={() => setPermissionError(false)} /> : null}
      {saveError ? <Banner tone="error" title="Enregistrement incomplet" message={saveError} blocking testID="wish-save-error" /> : null}
    </FormSheet>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  const { colors } = useAppTheme();
  return <Text style={{ color: strong ? colors.textPrimary : colors.textSecondary, fontFamily: strong ? typography.fonts.semiBold : typography.fonts.regular, fontSize: strong ? typography.sizes.md : typography.sizes.sm, lineHeight: 22 }}>{label} · {value}</Text>;
}
