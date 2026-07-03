export type Notification = {
  id: number;
  /** Backend Pydantic : int | None (id PostgreSQL) */
  user_id: number;
  type: string;
  title: string;
  message: string;
  /** Backend Pydantic : int | None (id de la ressource liée) */
  object_id?: number;
  is_read: boolean;
  created_at: string;
  action_available: boolean;
  proposed_by?: string;
  /** UI-only — true pendant la sync optimiste */
  syncing?: boolean;
};
