import type { ReactNode } from 'react';
import { ListItem } from '../../../shared/components/ui';
import { radii, spacing } from '../../../theme/scales';

interface SettingsRowProps {
  title: string;
  subtitle: string;
  subtitleNumberOfLines?: number;
  trailing?: ReactNode;
  onPress?: () => void;
}

export function SettingsRow({ title, subtitle, subtitleNumberOfLines, trailing, onPress }: SettingsRowProps) {
  return (
    <ListItem
      title={title}
      subtitle={subtitle}
      subtitleNumberOfLines={subtitleNumberOfLines}
      trailing={trailing}
      onPress={onPress}
      style={{ borderBottomWidth: 0, borderRadius: radii.lg, paddingVertical: subtitleNumberOfLines && subtitleNumberOfLines > 1 ? spacing.md : undefined }}
    />
  );
}
