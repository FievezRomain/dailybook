import type { ReactNode } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { TextField, type TextFieldProps } from './TextField';

export interface ControlledFieldRenderProps<TValue> {
  value: TValue;
  onChange: (value: TValue) => void;
  onBlur: () => void;
  errorMessage?: string;
  disabled: boolean;
}

export interface ControlledFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  rules?: RegisterOptions<TFieldValues, TName>;
  disabled?: boolean;
  children: (props: ControlledFieldRenderProps<FieldPathValue<TFieldValues, TName>>) => ReactNode;
}

export function ControlledField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ control, name, rules, disabled = false, children }: ControlledFieldProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name, rules, disabled });
  return children({
    value: field.value,
    onChange: field.onChange,
    onBlur: field.onBlur,
    errorMessage: fieldState.error?.message,
    disabled: Boolean(field.disabled),
  });
}

export interface ControlledTextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends Omit<TextFieldProps, 'value' | 'onChangeText' | 'onBlur' | 'errorMessage' | 'editable'> {
  control: Control<TFieldValues>;
  name: TName;
  rules?: RegisterOptions<TFieldValues, TName>;
  disabled?: boolean;
}

export function ControlledTextField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ control, name, rules, disabled, ...props }: ControlledTextFieldProps<TFieldValues, TName>) {
  return (
    <ControlledField control={control} name={name} rules={rules} disabled={disabled}>
      {({ value, onChange, onBlur, errorMessage, disabled: fieldDisabled }) => (
        <TextField
          {...props}
          value={value == null ? '' : String(value)}
          onChangeText={(text) => onChange(text as FieldPathValue<TFieldValues, TName>)}
          onBlur={onBlur}
          errorMessage={errorMessage}
          editable={!fieldDisabled}
        />
      )}
    </ControlledField>
  );
}
