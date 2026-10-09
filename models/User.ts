export type UserProfile = {
  id: string;
  email: string;
  prenom?: string;
  expotoken?: string;
  timezone?: string;
  filename?: string;
  subscription?: string;
  subscription_date_fin?: string | null;
  daily_reminder_enabled?: boolean;
};
