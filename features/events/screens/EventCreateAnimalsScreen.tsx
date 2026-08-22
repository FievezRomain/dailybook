import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAnimalsQuery } from "../../../hooks/queries/useAnimalsQuery";
import { useGroupsQuery } from "../../../hooks/queries/useGroupsQuery";
import { useAnimalImageUrl } from "../../../hooks/queries/useAnimalImageUrl";
import type { Animal } from "../../../models/Animal";
import {
  AnimalHistoryToggle,
  AnimalProvenanceAvatar,
  Banner,
  Button,
  Checkbox,
  EmptyState,
  ErrorState,
  FormSheet,
  LinearProgress,
  ListItem,
  Skeleton,
} from "../../../shared/components/ui";
import {
  getAnimalPresence,
  isSharedAnimal,
  sortAnimalsForWorkspace,
} from "../../animals/animalWorkspaceUtils";
import { useEventWizardStore } from "../../../stores/useEventWizardStore";
import { spacing, typography } from "../../../theme/scales";
import { useAppTheme } from "../../../theme/useAppTheme";
import {
  getAnimalSelectionCta,
  getAnimalSelectionSubtitle,
  toggleEventAnimal,
} from "../eventAnimalsUtils";
import { getAllowedEventAnimals } from "../eventGroupSharing";

export interface EventCreateAnimalsScreenProps {
  onBack: () => void;
  onContinue: () => void;
  onClose?: () => void;
}

export function EventCreateAnimalsScreen({
  onBack,
  onContinue,
  onClose = onBack,
}: EventCreateAnimalsScreenProps) {
  const { colors } = useAppTheme();
  const animalsQuery = useAnimalsQuery();
  const groupsQuery = useGroupsQuery();
  const sharedGroupIds = useEventWizardStore((state) => state.formData.shared_groups) ?? [];
  const storedSelectedIds = useEventWizardStore(
    (state) => state.formData.animaux,
  );
  const selectedIds = storedSelectedIds ?? EMPTY_SELECTED_IDS;
  const setField = useEventWizardStore((state) => state.setField);
  const [showError, setShowError] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const allAnimals = animalsQuery.data ?? [];
  const animals = sortAnimalsForWorkspace(getAllowedEventAnimals(allAnimals, groupsQuery.data ?? [], sharedGroupIds));
  const listRestrictedByGroups = sharedGroupIds.length > 0 && animals.length < allAnimals.length;
  const presentAnimals = animals.filter(
    (animal) => getAnimalPresence(animal) === "present",
  );
  const historicalAnimals = animals.filter(
    (animal) => getAnimalPresence(animal) === "history",
  );
  const visibleAnimals = historyExpanded
    ? [...presentAnimals, ...historicalAnimals]
    : presentAnimals;
  useEffect(() => {
    if (historicalAnimals.some((animal) => selectedIds.includes(animal.id)))
      setHistoryExpanded(true);
  }, [historicalAnimals, selectedIds]);
  const change = (id: number) => {
    setField("animaux", toggleEventAnimal(selectedIds, id));
    setShowError(false);
  };
  const next = () => {
    const allowedIds = new Set(animals.map((animal) => animal.id));
    const validSelectedIds = selectedIds.filter((id) => allowedIds.has(id));
    if (!validSelectedIds.length) {
      setShowError(true);
      return;
    }
    if (validSelectedIds.length !== selectedIds.length) setField("animaux", validSelectedIds);
    onContinue();
  };
  const footer = (
    <View style={{ gap: spacing.sm, paddingHorizontal: spacing.md }}>
      {showError ? (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={{
            color: colors.error,
            fontFamily: typography.fonts.regular,
            fontSize: typography.sizes.sm,
            lineHeight: 18,
            textAlign: "center",
          }}
        >
          Sélectionnez au moins un animal.
        </Text>
      ) : null}
      <Button
        testID="event-animals-continue"
        label={getAnimalSelectionCta(selectedIds.length)}
        onPress={next}
        size="large"
        fullWidth
      />
    </View>
  );

  return (
    <FormSheet
      title="Animaux associés"
      onBack={onBack}
      onClose={onClose}
      dirty
      footer={footer}
      testID="event-create-animals"
    >
      <LinearProgress current={3} total={4} label="Étape 3 sur 4" />
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: typography.fonts.regular,
          fontSize: typography.sizes.control,
          lineHeight: 20,
          marginTop: spacing.lg,
        }}
      >
        Sélectionnez un ou plusieurs animaux
      </Text>
      {listRestrictedByGroups ? (
        <Banner
          tone="info"
          title="Liste adaptée aux groupes partagés"
          message="Cet événement est partagé avec un ou plusieurs groupes. Seuls vos animaux acceptés dans tous ces groupes peuvent être associés."
        />
      ) : null}
      {animalsQuery.isLoading || (sharedGroupIds.length > 0 && groupsQuery.isLoading) ? (
        <>
          <Skeleton type="profile" density="compact" />
          <Skeleton type="profile" density="compact" />
          <Skeleton type="profile" density="compact" />
        </>
      ) : animalsQuery.isError || (sharedGroupIds.length > 0 && groupsQuery.isError) ? (
        <ErrorState
          title="Animaux indisponibles"
          message="Impossible de charger vos animaux pour le moment."
          onRetry={() => void Promise.all([animalsQuery.refetch(), groupsQuery.refetch()])}
        />
      ) : animals.length === 0 ? (
        <EmptyState
          icon="animals"
          title={sharedGroupIds.length ? "Aucun animal compatible" : "Aucun animal"}
          message={sharedGroupIds.length ? "Pour cet événement partagé, seuls vos animaux acceptés dans tous les groupes concernés peuvent être associés." : "Ajoutez d’abord un animal pour pouvoir créer cet événement."}
        />
      ) : (
        <View accessibilityRole="list" style={{ gap: 10 }}>
          {visibleAnimals.map((animal) => {
            const selected = selectedIds.includes(animal.id);
            return (
              <View
                key={animal.id}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Checkbox
                  value={selected}
                  accessibilityLabel={`${selected ? "Désélectionner" : "Sélectionner"} ${animal.nom}`}
                  onValueChange={() => change(animal.id)}
                />
                <View style={{ flex: 1 }}>
                  <ListItem
                    testID={`event-animal-${animal.id}`}
                    title={animal.nom}
                    subtitle={getAnimalSelectionSubtitle(animal)}
                    leading={<ResolvedAnimalAvatar animal={animal} />}
                    accessibilityLabel={`${animal.nom}, ${getAnimalSelectionSubtitle(animal)}, ${selected ? "sélectionné" : "non sélectionné"}`}
                    accessibilityHint="Active ou désactive cet animal"
                    showDisclosure={false}
                    onPress={() => change(animal.id)}
                  />
                </View>
              </View>
            );
          })}
          {historicalAnimals.length ? (
            <AnimalHistoryToggle
              expanded={historyExpanded}
              onPress={() => setHistoryExpanded((value) => !value)}
              testID="event-animals-history-toggle"
            />
          ) : null}
        </View>
      )}
    </FormSheet>
  );
}

const EMPTY_SELECTED_IDS: readonly number[] = [];

function ResolvedAnimalAvatar({ animal }: { animal: Animal }) {
  const fallbackImageUrl = useAnimalImageUrl(animal.image, animal.id);
  return <AnimalProvenanceAvatar name={animal.nom} imageUrl={animal.imageUrl ?? fallbackImageUrl} sharedFromGroup={isSharedAnimal(animal)} size={40} />;
}
