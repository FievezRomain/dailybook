export function normalizeProgress(current: number, total: number) {
  const safeTotal = Math.max(1, Math.floor(total));
  const safeCurrent = Math.min(safeTotal, Math.max(1, Math.floor(current)));
  return { current: safeCurrent, total: safeTotal, ratio: safeCurrent / safeTotal } as const;
}
