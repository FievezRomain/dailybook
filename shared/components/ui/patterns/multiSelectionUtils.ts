export interface MultiSelectionResult<TId> { values: TId[]; blocked: boolean }
export function toggleMultiSelection<TId>(selected: readonly TId[], id: TId, max?: number): MultiSelectionResult<TId> {
  if (selected.includes(id)) return { values: selected.filter((value) => value !== id), blocked: false };
  if (max !== undefined && selected.length >= max) return { values: [...selected], blocked: true };
  return { values: [...selected, id], blocked: false };
}
export function getMultiSelectionError(count: number, min = 0, max?: number) {
  if (count < min) return min === 1 ? 'Sélectionnez au moins un élément.' : `Sélectionnez au moins ${min} éléments.`;
  if (max !== undefined && count > max) return `Sélectionnez au maximum ${max} éléments.`;
  return undefined;
}
