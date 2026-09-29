import { Text, View } from 'react-native';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { DetailScreen } from '../layout';
import { TopBar } from '../navigation';

const comparisonRows = [
  { label: "Gestion d'animaux", free: true },
  { label: 'Gestion de tâches', free: true },
  { label: 'Gestion des objectifs', free: true },
  { label: 'Planification et suivi des événements', free: true },
  { label: 'Rappels des événements', free: true },
  { label: 'Gestion de plus de trois animaux', free: false },
  { label: "Partage des tâches avec d'autres membres", free: false },
  { label: 'Suivi du budget', free: false },
  { label: "Suivi de l'alimentation", free: false },
  { label: "Statistiques d'activités", free: false },
  { label: 'Gestion du dossier médical', free: false },
  { label: 'Enregistrement GPS lors des activités', free: false },
  { label: "Suivi de l'évolution physique de l'animal", free: false },
] as const;

export interface PremiumPlansComparisonProps {
  onBack: () => void;
  testID?: string;
}

export function PremiumPlansComparison({ onBack, testID }: PremiumPlansComparisonProps) {
  const { colors } = useAppTheme();
  return (
    <DetailScreen header={<TopBar title="Abonnement" context="detail" onBack={onBack} />} testID={testID} contentContainerStyle={{ gap: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.lg }}>
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
