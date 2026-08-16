import { useState } from 'react';
import { Text, View } from 'react-native';
import { useNotificationPreferencesMutation } from '../../../hooks/queries/useNotificationPreferencesMutation';
import { useAuthStore } from '../../../stores/useAuthStore';
import { Banner, BottomBar, ListItem, RootScreen, Switch, TopBar } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { tabs, type MainTabId } from '../../home/mainTabs';

interface Props { activeTab: MainTabId; onSelectTab: (tab: MainTabId) => void; onBack: () => void }

export function NotificationPreferencesScreen({ activeTab, onSelectTab, onBack }: Props) {
  const { colors } = useAppTheme();
  const stored = useAuthStore((state) => state.user?.daily_reminder_enabled ?? true);
  const [value, setValue] = useState(stored);
  const mutation = useNotificationPreferencesMutation();
  const change = (enabled: boolean) => {
    setValue(enabled);
    mutation.mutate(enabled, { onError: () => setValue(!enabled) });
  };
  return <RootScreen header={<TopBar title="Notifications" context="detail" onBack={onBack} />} bottomBar={<BottomBar items={tabs} activeId={activeTab} onSelect={onSelectTab} />} contentContainerStyle={{ gap: spacing.lg }} testID="notification-preferences">
    <View style={{ gap: spacing.xs }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 35 }}>Préférences de notification</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 20 }}>Choisissez les notifications que vous souhaitez recevoir.</Text></View>
    {mutation.isError ? <Banner tone="error" title="Modification impossible" message="Votre préférence n’a pas pu être enregistrée." onDismiss={() => mutation.reset()} /> : null}
    <ListItem title="Rappel journalier" subtitle="Pour ne pas oublier d’enregistrer un événement" trailing={<Switch value={value} onValueChange={change} disabled={mutation.isPending} accessibilityLabel="Rappel journalier" testID="daily-reminder-switch" />} />
    {!value ? <Banner tone="info" title="Rappel journalier désactivé" message="Vous ne recevrez plus la notification de 20 h. Vous pourrez la réactiver à tout moment." onDismiss={undefined} /> : null}
  </RootScreen>;
}
