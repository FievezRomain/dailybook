import { IconButton } from '../actions';
import { Icon } from '../icons';
import { TextField, type TextFieldProps } from './TextField';

export interface SearchFieldProps extends Omit<TextFieldProps, 'label' | 'leading' | 'trailing'> {
  label?: string;
  noResults?: boolean;
  noResultsText?: string;
  onClear?: () => void;
}

export function SearchField({
  label = 'Rechercher',
  noResults = false,
  noResultsText = 'Aucun résultat',
  onClear,
  value,
  ...props
}: SearchFieldProps) {
  const hasQuery = Boolean(value);
  return (
    <TextField
      {...props}
      value={value}
      label={label}
      helperText={noResults ? noResultsText : props.helperText}
      leading={<Icon name="search" size="sm" />}
      trailing={hasQuery && onClear ? (
        <IconButton
          icon="close"
          accessibilityLabel="Effacer la recherche"
          size="small"
          variant="ghost"
          onPress={onClear}
        />
      ) : undefined}
      returnKeyType="search"
    />
  );
}
