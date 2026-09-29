import type { Edge } from 'react-native-safe-area-context';

export type ScreenKind = 'base' | 'root' | 'detail';
export function getScreenEdges(kind: ScreenKind): readonly Edge[] {
  return kind === 'root' ? ['top', 'bottom'] : ['top', 'bottom'];
}
export function getKeyboardAvoidingBehavior(platform: string): 'padding' | 'height' {
  return platform === 'ios' ? 'padding' : 'height';
}
