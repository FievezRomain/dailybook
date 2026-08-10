import { useState } from 'react';
import type { Animal } from '../../../models/Animal';
import { useAnimalHistoryQuery, useAnimalMutations } from '../../../hooks/queries/useAnimalsQuery';
import { ActionMenu, Banner, DataVisualization, Dialog, ErrorState, FormSheet, ListItem, Skeleton, resolveAsyncState } from '../../../shared/components/ui';
import type { AnimalHistoryRecord } from '../types';
import { AnimalMeasurementSheet } from './AnimalMeasurementSheet';

type MeasurementType = 'poids' | 'taille';
const labels = { poids: 'Poids', taille: 'Taille' } as const;
const units = { poids: 'kg', taille: 'cm' } as const;

export function AnimalMeasurementHistorySheet({ animal, type, onClose }: { animal: Animal; type: MeasurementType; onClose: () => void }) {
  const history = useAnimalHistoryQuery(String(animal.id), type);
  const mutations = useAnimalMutations();
  const [deleteTarget, setDeleteTarget] = useState<AnimalHistoryRecord>();
  const [actionTarget, setActionTarget] = useState<AnimalHistoryRecord>();
  const [editTarget, setEditTarget] = useState<AnimalHistoryRecord>();
  const state = resolveAsyncState({ loading: history.isLoading, error: history.isError, hasData: Boolean(history.data?.length) });
  const data = (history.data ?? []).slice().reverse().map((item) => ({ label: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(`${item.datemodification}T12:00:00`)), value: Number(item.value) }));
  return <><FormSheet title={`Historique · ${labels[type]}`} onBack={onClose} onClose={onClose} testID={`animal-${type}-history`}>
    {history.isError && state === 'success' ? <Banner tone="error" title="Mise à jour impossible" message="Les mesures déjà chargées restent disponibles." blocking onDismiss={undefined} /> : null}{state === 'loading' ? <><Skeleton type="card" density="comfortable" /><Skeleton type="list" density="compact" /></> : state === 'error' ? <ErrorState message="Impossible de charger l’historique." onRetry={() => void history.refetch()} /> : <><DataVisualization title={`${labels[type]} de ${animal.nom}`} type="line" state={data.length ? 'ready' : 'empty'} data={data} valueFormatter={(value) => `${value} ${units[type]}`} accessibilitySummary={`${data.length} mesures de ${labels[type].toLowerCase()}`} />{(history.data ?? []).map((item) => <ListItem key={item.id} title={`${item.value} ${units[type]}`} subtitle={new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(`${item.datemodification}T12:00:00`))} onPress={() => setActionTarget(item)} accessibilityHint="Ouvre les actions de cette mesure" />)}</>}
  </FormSheet><ActionMenu open={Boolean(actionTarget)} title="Actions de la mesure" onClose={() => setActionTarget(undefined)} onSelect={(action) => { if (action === 'edit') setEditTarget(actionTarget); else setDeleteTarget(actionTarget); }} items={[{ id: 'edit', label: 'Modifier', icon: 'edit' }, { id: 'delete', label: 'Supprimer', icon: 'delete', tone: 'destructive' }]} /><Dialog open={Boolean(deleteTarget)} type="destructive" title="Supprimer cette mesure ?" description="Cette valeur sera retirée définitivement de l’historique." confirmLabel="Supprimer" loading={mutations.deleteHistory.isPending} onClose={() => setDeleteTarget(undefined)} onConfirm={async () => { if (!deleteTarget) return; await mutations.deleteHistory.mutateAsync({ animalId: String(animal.id), item: type, historyId: String(deleteTarget.id) }); setDeleteTarget(undefined); }} />{editTarget ? <AnimalMeasurementSheet key={editTarget.id} animal={animal} initialType={type} record={editTarget} onClose={() => setEditTarget(undefined)} onSaved={() => setEditTarget(undefined)} /> : null}</>;
}
