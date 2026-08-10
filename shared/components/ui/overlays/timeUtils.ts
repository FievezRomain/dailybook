export function wrapTimePart(value: number, delta: number, max: number) { return (value + delta + max + 1) % (max + 1); }
export function formatTimePart(value: number) { return String(value).padStart(2, '0'); }
