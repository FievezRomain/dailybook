import { componentTokens } from '../../../../theme/componentTokens';

export type BottomSheetSize = keyof typeof componentTokens.bottomSheet.height;
export type BottomSheetCommand = 'present' | 'dismiss' | 'none';

export function getBottomSheetHeight(size: BottomSheetSize) {
  return componentTokens.bottomSheet.height[size];
}

export function getBottomSheetCommand(open: boolean, presented: boolean): BottomSheetCommand {
  if (open && !presented) return 'present';
  if (!open && presented) return 'dismiss';
  return 'none';
}
