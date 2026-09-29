import { Icon } from '../icons';
import { Select, type SelectProps } from './Select';

export type DateTimeKind = 'date' | 'time';

export interface DateTimeFieldProps extends Omit<SelectProps, 'leading'> {
  kind: DateTimeKind;
  onClear?: () => void;
}

export function DateTimeField({ kind, onClear, ...props }: DateTimeFieldProps) {
  return (
    <Select
      {...props}
      leading={undefined}
      trailing={<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>{props.value && onClear ? <Pressable accessibilityRole="button" accessibilityLabel={`Effacer ${props.label}`} hitSlop={8} onPress={(event) => { event.stopPropagation(); onClear(); }}><Icon name="close" size="sm" /></Pressable> : null}<DateTimeFieldIcon kind={kind} /></View>}
      accessibilityLabel={props.accessibilityLabel ?? `${props.label}, ${props.value ?? props.placeholder}`}
    />
  );
}

export function DateTimeFieldIcon({ kind, color }: { kind: DateTimeKind; color?: string }) {
  return <Icon name={kind === 'date' ? 'calendar' : 'time'} size="sm" color={color} />;
}
import { Pressable, View } from 'react-native';
