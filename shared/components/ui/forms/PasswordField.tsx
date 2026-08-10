import { useState } from 'react';
import { IconButton } from '../actions';
import { TextField, type TextFieldProps } from './TextField';

export type PasswordFieldProps = Omit<TextFieldProps, 'secureTextEntry' | 'trailing'>;

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      secureTextEntry={!visible}
      autoCapitalize="none"
      trailing={
        <IconButton
          icon={visible ? 'visibilityOff' : 'visibilityOn'}
          accessibilityLabel={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          size="small"
          variant="ghost"
          onPress={() => setVisible((current) => !current)}
        />
      }
    />
  );
}
