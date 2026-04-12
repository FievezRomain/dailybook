export type CreateNotePayload = {
  titre: string;
  note: string;
};

export type UpdateNotePayload = CreateNotePayload & { id: number };
