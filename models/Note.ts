export type Note = {
  id: number;
  titre: string;
  note: string;
  is_pinned?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  content_format?: "legacy_html" | "plain_text" | "markdown";
  /** UI-only — true pendant la sync optimiste */
  syncing?: boolean;
};
