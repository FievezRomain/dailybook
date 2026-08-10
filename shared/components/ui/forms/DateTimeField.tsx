import { Icon } from '../icons';
import { Select, type SelectProps } from './Select';

export type DateTimeKind = 'date' | 'time';

export interface DateTimeFieldProps extends Omit<SelectProps, 'leading'> {
  kind: DateTimeKind;
}

export function DateTimeField({ kind, ...props }: DateTimeFieldProps) {
  return (
    <Select
      {...props}
      leading={undefined}
      trailing={<DateTimeFieldIcon kind={kind} />}
      accessibilityLabel={props.accessibilityLabel ?? `${props.label}, ${props.value ?? props.placeholder}`}
    />
  );
}

export function DateTimeFieldIcon({ kind, color }: { kind: DateTimeKind; color?: string }) {
  return <Icon name={kind === 'date' ? 'calendar' : 'time'} size="sm" color={color} />;
}
