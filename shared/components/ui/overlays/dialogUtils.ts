import type { VascoIconName } from '../icons';

export type DialogType = 'info' | 'confirm' | 'destructive';

export function getDialogIcon(type: DialogType): VascoIconName {
  if (type === 'destructive') return 'warning';
  if (type === 'confirm') return 'success';
  return 'info';
}
