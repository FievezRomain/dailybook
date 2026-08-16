import { ControlledField, ControlledTextField, FormSheet, TextArea } from '../../../shared/components/ui';
import type { Note } from '../../../models/Note';
import { useNoteForm } from '../hooks/useNoteForm';

interface NoteFormSheetScreenProps {
  mode: 'create' | 'edit';
  note?: Note;
  onClose: () => void;
  onSaved: () => void;
}

export function NoteFormSheetScreen({ mode, note, onClose, onSaved }: NoteFormSheetScreenProps) {
  const { form, loading, submit } = useNoteForm(mode === 'edit' ? 'modify' : 'create', note, onSaved);
  const save = form.handleSubmit((values) => submit(values, onClose));

  return (
    <FormSheet
      title={mode === 'edit' ? 'Modifier la note' : 'Créer une note'}
      onBack={onClose}
      onClose={onClose}
      footerLabel={mode === 'edit' ? 'Enregistrer' : 'Créer la note'}
      onFooterPress={() => void save()}
      footerLoading={loading}
      dirty={form.formState.isDirty}
      confirmBackWhenDirty
      testID="note-form-sheet"
    >
      <ControlledTextField control={form.control} name="titre" label="Titre" placeholder="Ex. Liste pour le week-end" helperText="Obligatoire" maxLength={120} disabled={loading} testID="input-note-titre" />
      <ControlledField control={form.control} name="note" disabled={loading}>
        {({ value, onChange, onBlur, errorMessage, disabled }) => <TextArea label="Contenu" placeholder="Écrivez votre note…" value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={errorMessage} helperText={`${value.length}/500`} maxLength={500} editable={!disabled} testID="input-note-contenu" />}
      </ControlledField>
    </FormSheet>
  );
}