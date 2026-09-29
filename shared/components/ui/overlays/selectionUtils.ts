export function toggleSelection<T extends string>(selected: readonly T[], id: T, mode: 'single' | 'multi'): T[] {
  if (mode === 'single') return [id];
  return selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id];
}

export function filterSelectionOptions<T extends { label: string }>(options: readonly T[], query: string): T[] {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  const normalized = normalize(query.trim());
  if (!normalized) return [...options];
  return options.filter((option) => normalize(option.label).includes(normalized));
}
