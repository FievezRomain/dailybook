import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Animal } from '../../../models/Animal';
import type { Objectif } from '../../../models/Objectif';
import { useObjectifMutations } from '../../../hooks/queries/useObjectifsQuery';
import { ActionSheet, Card, Checkbox, DetailScreen, Dialog, Icon, LinearProgress, LinkedAnimals, TopBar } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getLinkedAnimals, getObjectiveProgress } from '../../home/homeUtils';
import { isObjectiveStepDone } from '../objectiveUtils';

export function ObjectiveDetailScreen({ objective, animals, initialActionsOpen = false, onBack, onEdit, onDeleted, onDuplicate }: { objective: Objectif; animals: readonly Animal[]; initialActionsOpen?: boolean; onBack: () => void; onEdit: () => void; onDeleted: () => void; onDuplicate: () => void }) {
  const { colors } = useAppTheme();
  const mutations = useObjectifMutations();
  const [actionsOpen, setActionsOpen] = useState(initialActionsOpen);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const progress = getObjectiveProgress(objective);
  const linked = getLinkedAnimals(objective.animaux, animals);
  const setStepCompleted = async (stepId: number, completed: boolean) => { await mutations.updateSubtask.mutateAsync({ objectiveId: String(objective.id), subtaskId: stepId, state: completed }); };
  return <>
    <DetailScreen header={<TopBar title="Objectif" context="detail" onBack={onBack} />} testID="objective-detail">
      <View style={{ gap: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text accessibilityRole="header" style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xl }}>{objective.title}</Text><Pressable accessibilityRole="button" accessibilityLabel="Actions sur l’objectif" onPress={() => setActionsOpen(true)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon name="moreHorizontal" size="lg" /></Pressable></View>
        <Card accessibilityLabel={`Progression, ${Math.round(progress * 100)} pour cent`} style={{ minHeight: 120 }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium }}>Progression</Text><Text style={{ color: colors.success, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xl }}>{Math.round(progress * objective.sousetapes.length)} / {objective.sousetapes.length} étapes</Text><LinearProgress current={Math.round(progress * objective.sousetapes.length)} total={Math.max(1, objective.sousetapes.length)} label={`${Math.round(progress * 100)} %`} /></Card>
        <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.lg }}>Étapes</Text>
        {objective.sousetapes.map((step) => { const done = isObjectiveStepDone(step.state); const updating = mutations.updateSubtask.isPending && mutations.updateSubtask.variables?.subtaskId === step.id; return <View key={step.id} style={{ width: '100%', minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.surface }}><Checkbox value={done} disabled={updating} accessibilityLabel={done ? `Marquer ${step.etape} comme à faire` : `Marquer ${step.etape} comme terminée`} onValueChange={(completed) => void setStepCompleted(step.id, completed)} testID={`objective-step-${step.id}-completion`} /><View style={{ flex: 1, minWidth: 0 }}><Text style={{ flexShrink: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold }}>{step.etape}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{done ? 'Terminé' : 'À faire'}</Text></View></View>; })}
        {linked.length ? <LinkedAnimals animals={linked} /> : null}
      </View>
    </DetailScreen>
    <ActionSheet open={actionsOpen} title="Actions sur l’objectif" onClose={() => setActionsOpen(false)} onSelect={(action) => { setActionsOpen(false); if (action === 'edit') onEdit(); else if (action === 'duplicate') onDuplicate(); else setDeleteOpen(true); }} items={[{ id: 'edit', label: 'Modifier', description: 'Mettre à jour toutes les informations', icon: 'edit' }, { id: 'duplicate', label: 'Dupliquer', description: 'Utiliser cet objectif comme modèle', icon: 'duplicate' }, { id: 'delete', label: 'Supprimer', description: 'Une confirmation sera demandée', icon: 'warning', tone: 'destructive' }]} />
    <Dialog open={deleteOpen} type="destructive" title="Supprimer cet objectif ?" description="L’objectif et ses étapes seront supprimés définitivement." confirmLabel="Supprimer" loading={mutations.remove.isPending} onClose={() => setDeleteOpen(false)} onConfirm={async () => { await mutations.remove.mutateAsync(String(objective.id)); onDeleted(); }} />
  </>;
}
