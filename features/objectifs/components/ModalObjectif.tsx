import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useObjectifMutations } from '../../../hooks/queries/useObjectifsQuery';
import CalendarPicker from '../../../shared/components/modals/inputs/ModalDatePicker';
import { AppDivider, AppInput, AppSheet } from '../../../shared/components/ui';
import Button from '../../../shared/components/ui/AppButton';
import ModalAnimals from '../../animals/components/ModalSelectAnimals';
import LoggerService from '../../../services/logs/LoggerService';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { Animal } from '../../../models/Animal';
import type { Objectif } from '../../../models/Objectif';
import type { CreateObjectifPayload, SubTaskPayload, UpdateObjectifPayload } from '../types';

type ModalObjectifValue = Omit<Partial<Objectif>, 'animaux'> & {
  titre?: string;
  animaux?: Animal[] | number[];
  sousEtapes?: { titre?: string; etape?: string }[];
};

interface ModalObjectifProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: 'create' | 'modify';
  objectif?: ModalObjectifValue;
  onModify?: (data?: unknown) => void;
}

type ObjectifFormValues = Partial<UpdateObjectifPayload> & {
  titre?: string;
  sousEtapes?: string[];
};

const toDateInput = (value: unknown) => {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().split('T')[0];
  return String(value).split('T')[0];
};

const isAnimal = (value: unknown): value is Animal =>
  typeof value === 'object' && value !== null && 'id' in value && 'nom' in value;

const ModalObjectif = ({ isVisible, setVisible, actionType, objectif = {}, onModify = undefined }: ModalObjectifProps) => {
  const { colors, fonts, tokens } = useAppTheme();
  const { register, handleSubmit, formState: { errors }, setValue, getValues, watch, reset } = useForm<ObjectifFormValues>();
  const [modalAnimalVisible, setModalAnimalVisible] = useState(false);
  const [selected, setSelected] = useState<Animal[]>([]);
  const [inputs, setInputs] = useState<string[]>(['']);
  const { data: animaux = [] } = useAnimalsQuery();
  const { create, update } = useObjectifMutations();
  const sheetRef = useRef<BottomSheetModal>(null);
  const loading = create.isPending || update.isPending;

  useEffect(() => {
    register('title', { required: true });
    register('datedebut');
    register('datefin');
    register('animaux');
  }, [register]);

  useEffect(() => {
    if (isVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) initValues();
  }, [isVisible]);

  const closeModal = () => setVisible(false);

  const initValues = () => {
    if (actionType === 'create') {
      reset({ title: '', datedebut: undefined, datefin: undefined, animaux: [] });
      setSelected([]);
      setInputs(['']);
      return;
    }

    const selectedAnimals: Animal[] = Array.isArray(objectif.animaux)
      ? objectif.animaux.filter(isAnimal)
      : [];

    reset({
      id: objectif.id,
      title: objectif.title ?? objectif.titre ?? '',
      datedebut: toDateInput(objectif.datedebut),
      datefin: toDateInput(objectif.datefin),
      animaux: selectedAnimals.map((animal) => animal.id),
    });
    setSelected(selectedAnimals);
    setInputs(objectif.sousEtapes?.map((step) => step.titre ?? step.etape ?? '').filter(Boolean) ?? objectif.sousetapes?.map((step) => step.etape) ?? ['']);
  };

  const handleAddInput = () => setInputs((prev) => [...prev, '']);
  const handleRemoveInput = (index: number) => setInputs((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  const handleInputChange = (value: string, index: number) => {
    setInputs((prev) => prev.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const convertDateToText = (fieldname: 'datedebut' | 'datefin') => {
    const value = watch(fieldname);
    if (!value) return '';
    return new Date(String(value)).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const buildPayload = (data: ObjectifFormValues): CreateObjectifPayload => {
    const today = new Date().toISOString().split('T')[0];
    const sousetapes: SubTaskPayload[] = inputs
      .filter((step) => step.trim() !== '')
      .map((etape, order) => ({ etape, state: 'todo', order }));

    return {
      title: data.title ?? '',
      datedebut: data.datedebut ? String(data.datedebut) : today,
      datefin: data.datefin ? String(data.datefin) : today,
      animaux: selected.map((animal) => animal.id),
      sousetapes,
    };
  };

  const submitRegister = async (data: ObjectifFormValues) => {
    try {
      const payload = buildPayload(data);
      if (actionType === 'modify') {
        const body: UpdateObjectifPayload = { ...payload, id: Number(data.id) };
        const response = await update.mutateAsync({ id: String(data.id), body });
        onModify?.(response);
      } else {
        await create.mutateAsync(payload);
        onModify?.();
      }
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      Toast.show({ type: 'error', position: 'top', text1: message });
      LoggerService.log("Erreur lors de l'enregistrement d'un objectif: " + message);
    }
  };

  const setModalAnimalsValue = (name: string, value: unknown) => {
    setValue(name as keyof ObjectifFormValues, value as never);
  };

  const styles = {
    form: { width: '100%', paddingBottom: 40, flex: 1 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 14, paddingRight: 14, paddingTop: 18, paddingBottom: 10, gap: tokens.spacing.md },
    textInput: { alignSelf: 'flex-start', color: colors.textPrimary, fontFamily: fonts.default.fontFamily },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    containerAnimaux: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.xs },
    containerBadgeAnimal: { borderRadius: tokens.radii.sm, backgroundColor: colors.surfaceVariant },
    badgeAnimal: { padding: tokens.spacing.sm },
    sousEtapeRow: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm },
    containerDate: { flexDirection: 'column', alignSelf: 'flex-start', width: '100%', gap: tokens.spacing.xs },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['88%']} keyboardBehavior="extend" scrollable={false} onDismiss={closeModal}>
      <ModalAnimals
        modalVisible={modalAnimalVisible}
        setModalVisible={setModalAnimalVisible}
        setAnimaux={undefined}
        animaux={animaux}
        selected={selected}
        setSelected={(value: unknown) => setSelected(value as Animal[])}
        setValue={setModalAnimalsValue}
        valueName="animaux"
        displayAnimalsShared={false}
      />
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>Annuler</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { fontSize: 16, color: colors.textPrimary }]}>Objectif</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator size={10} color={colors.textPrimary} />
            ) : (
              <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>
                {actionType === 'modify' ? 'Modifier' : 'Creer'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <AppDivider />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraScrollHeight={10} enableResetScrollToCoords={false}>
          <View style={styles.formContainer}>
            <View style={styles.containerDate}>
              <Text style={styles.textInput}>Date de debut {convertDateToText('datedebut')}</Text>
              <CalendarPicker onDayChange={(_, selectedDate) => setValue('datedebut', selectedDate)} propertyName="datedebut" defaultDate={getValues('datedebut')} />
            </View>
            <View style={styles.containerDate}>
              <Text style={styles.textInput}>Date de fin {convertDateToText('datefin')}</Text>
              <CalendarPicker onDayChange={(_, selectedDate) => setValue('datefin', selectedDate)} propertyName="datefin" defaultDate={getValues('datefin')} />
            </View>
            <View>
              <Text style={styles.textInput}>Animaux</Text>
              <TouchableOpacity style={{ width: '100%', marginTop: tokens.spacing.xs }} onPress={() => setModalAnimalVisible(true)}>
                <View style={styles.containerAnimaux}>
                  {selected.length === 0 && (
                    <View style={[styles.containerBadgeAnimal, { width: '100%' }]}>
                      <Text style={[styles.badgeAnimal, styles.textFontRegular, { color: colors.secondary }]}>Selectionner un ou plusieurs animaux</Text>
                    </View>
                  )}
                  {selected.map((animal) => (
                    <View key={animal.id} style={styles.containerBadgeAnimal}>
                      <Text style={[styles.badgeAnimal, styles.textFontRegular]}>{animal.nom}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            </View>
            <AppInput
              label="Titre"
              required
              error={errors.title ? 'Titre obligatoire' : undefined}
              placeholder="Exemple : Objectif"
              value={String(watch('title') ?? '')}
              onChangeText={(text) => setValue('title', text, { shouldValidate: true })}
            />
            <View style={{ gap: tokens.spacing.sm }}>
              <Text style={styles.textInput}>Sous-etapes</Text>
              {inputs.map((value, index) => (
                <View key={index} style={styles.sousEtapeRow}>
                  <AppInput
                    containerStyle={{ flex: 1 }}
                    value={value}
                    onChangeText={(text) => handleInputChange(text, index)}
                    placeholder={`Etape ${index + 1}`}
                  />
                  <TouchableOpacity onPress={() => handleRemoveInput(index)} accessibilityLabel="Retirer l'etape">
                    <AntDesign name="delete" size={20} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              ))}
              <Button onPress={handleAddInput} type="primary" size="s" isLong>
                <Entypo name="plus" size={16} color="white" />
                <Text style={styles.textFontRegular}> Ajouter une sous-etape</Text>
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </AppSheet>
  );
};

export default ModalObjectif;
