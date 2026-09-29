export type Notification = {
  id: number;
  /** Backend Pydantic : int | None (id PostgreSQL) */
  user_id?: number | null;
  type?: string | null;
  title?: string | null;
  message?: string | null;
  /** Backend Pydantic : int | None (id de la ressource liée) */
  object_id?: number | null;
  is_read: boolean;
  created_at?: string | null;
  action_available?: boolean;
  proposed_by?: string | null;
  /** UI-only — true pendant la sync optimiste */
  syncing?: boolean;
};
