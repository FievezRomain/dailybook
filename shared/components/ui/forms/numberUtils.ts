export function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function stepNumber(value: number, direction: -1 | 1, step: number, min: number, max: number) {
  return clampNumber(value + direction * step, min, max);
}

export function valueFromPosition(position: number, width: number, min: number, max: number, step: number) {
  if (width <= 0 || max <= min) return min;
  const raw = min + clampNumber(position / width, 0, 1) * (max - min);
  const snapped = min + Math.round((raw - min) / step) * step;
  return clampNumber(snapped, min, max);
}
