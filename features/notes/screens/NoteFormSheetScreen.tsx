import {
  ControlledField,
  ControlledTextField,
  FormSheet,
} from "../../../shared/components/ui";
import type { Note } from "../../../models/Note";
import { useNoteForm } from "../hooks/useNoteForm";
import { RichNoteEditor } from "../components/RichNoteEditor";

interface NoteFormSheetScreenProps {
  mode: "create" | "edit";
  note?: Note;
  onClose: () => void;
  onSaved: () => void;
}

export function NoteFormSheetScreen({
  mode,
  note,
  onClose,
  onSaved,
}: NoteFormSheetScreenProps) {
  const { form, loading, submit } = useNoteForm(
    mode === "edit" ? "modify" : "create",
    note,
    onSaved,
  );
  const save = form.handleSubmit((values) => submit(values, onClose));

  return (
    <FormSheet
      title={mode === "edit" ? "Modifier la note" : "Créer une note"}
      onBack={onClose}
      onClose={onClose}
      footerLabel={mode === "edit" ? "Enregistrer" : "Créer la note"}
      onFooterPress={() => void save()}
      footerLoading={loading}
      dirty={form.formState.isDirty}
      confirmBackWhenDirty
      testID="note-form-sheet"
    >
      <ControlledTextField
        control={form.control}
        name="titre"
        label="Titre"
        placeholder="Ex. Liste pour le week-end"
        helperText="Obligatoire"
        maxLength={120}
        disabled={loading}
        testID="input-note-titre"
      />
      <ControlledField control={form.control} name="note" disabled={loading}>
        {({ value, onChange, errorMessage, disabled }) => (
          <RichNoteEditor
            value={value}
            onChange={(next) => {
              if (next.length <= 500) onChange(next);
            }}
            errorMessage={errorMessage}
            disabled={disabled}
          />
        )}
      </ControlledField>
    </FormSheet>
  );
}
