export type Notification = {
  id: number;
  user_id: string;
  type: string;
  title: string;
  message: string;
  object_id?: string;
  is_read: boolean;
  created_at: string;
  action_available: boolean;
  proposed_by?: string;
};
