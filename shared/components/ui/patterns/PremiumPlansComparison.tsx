import { Pressable, Text, View } from 'react-native';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Button } from '../actions';
import { DetailScreen } from '../layout';
import { TopBar } from '../navigation';

const comparisonRows = [
  { label: 'Animaux, événements, objectifs…', free: true },
  { label: 'Statistiques', free: false },
  { label: 'Groupes', free: false },
  { label: 'Création assistée par IA', free: false },
  { label: 'Notes vocales', free: false },
] as const;

export interface PremiumPlansComparisonProps {
  onBack: () => void;
  onDiscoverPremium: () => void;
  onContinueFree: () => void;
  testID?: string;
}

export function PremiumPlansComparison({ onBack, onDiscoverPremium, onContinueFree, testID }: PremiumPlansComparisonProps) {
  const { colors } = useAppTheme();
  return (
    <DetailScreen header={<TopBar title="Abonnement" context="detail" onBack={onBack} />} testID={testID} contentContainerStyle={{ gap: spacing.md, paddingTop: spacing.lg }} footer={<View style={{ gap: spacing.sm, paddingBottom: spacing.sm }}><Button label="Découvrir Premium" onPress={onDiscoverPremium} size="large" fullWidth /><Pressable accessibilityRole="button" accessibilityLabel="Continuer avec la version gratuite" onPress={onContinueFree} style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.control }}>Je continue avec la version gratuite</Text></Pressable></View>}>
      <View style={{ gap: spacing.xs }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: 26, lineHeight: 32 }}>Choisissez votre expérience</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>Les fonctions essentielles restent disponibles gratuitement.</Text></View>
      <View accessibilityRole="summary" accessibilityLabel="Comparatif des offres Gratuit et Premium" style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.surfaceVariant, overflow: 'hidden', paddingHorizontal: spacing.md }}>
        <ComparisonRow label="Fonctionnalité" free="Gratuit" premium="Premium" header />
        {comparisonRows.map((row) => <ComparisonRow key={row.label} label={row.label} free={row.free ? '✓' : '—'} premium="✓" />)}
      </View>
    </DetailScreen>
  );
}

function ComparisonRow({ label, free, premium, header = false }: { label: string; free: string; premium: string; header?: boolean }) {
  const { colors } = useAppTheme();
  const font = header ? typography.fonts.semiBold : typography.fonts.regular;
  return <View style={{ minHeight: header ? 54 : 72, flexDirection: 'row', alignItems: 'center', borderBottomWidth: header ? 1 : 0, borderTopWidth: header ? 0 : 1, borderColor: colors.border }}><Text numberOfLines={2} style={{ flex: 1, color: colors.textPrimary, fontFamily: font, fontSize: typography.sizes.sm }}>{label}</Text><Text accessibilityLabel={`${free === '✓' ? 'Inclus' : free === '—' ? 'Non inclus' : free}`} style={{ width: 66, textAlign: 'center', color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{free}</Text><Text accessibilityLabel={`${premium === '✓' ? 'Inclus' : premium}`} style={{ width: 70, textAlign: 'center', color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{premium}</Text></View>;
}
