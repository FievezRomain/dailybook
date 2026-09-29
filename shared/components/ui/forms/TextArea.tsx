import type { TextFieldProps } from './TextField';
import { componentTokens } from '../../../../theme/componentTokens';
import { spacing } from '../../../../theme/scales';
import { TextField } from './TextField';

export type TextAreaProps = TextFieldProps;

export function TextArea(props: TextAreaProps) {
  return (
    <TextField
      {...props}
      multiline
      textAlignVertical="top"
      inputContainerStyle={[
        { minHeight: componentTokens.textArea.minHeight, alignItems: 'flex-start', paddingVertical: spacing.md },
        props.inputContainerStyle,
      ]}
    />
  );
}
