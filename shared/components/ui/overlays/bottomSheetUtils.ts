import { componentTokens } from '../../../../theme/componentTokens';

export type BottomSheetSize = keyof typeof componentTokens.bottomSheet.height;

export function getBottomSheetHeight(size: BottomSheetSize) {
  return componentTokens.bottomSheet.height[size];
}
