import { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { shadows, theme, typography } from '../constants/theme';

type SectionCardProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  tone?: 'default' | 'strong' | 'soft';
}>;

export function SectionCard({
  title,
  subtitle,
  rightSlot,
  tone = 'default',
  children
}: SectionCardProps) {
  return (
    <View
      style={[
        styles.card,
        tone === 'strong' && styles.cardStrong,
        tone === 'soft' && styles.cardSoft
      ]}
    >
      {(title || subtitle || rightSlot) ? (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {rightSlot ? <View>{rightSlot}</View> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    gap: theme.spacing.md,
    ...shadows.card
  },
  cardStrong: {
    backgroundColor: theme.colors.cardStrong
  },
  cardSoft: {
    backgroundColor: 'rgba(11, 24, 44, 0.68)'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md
  },
  headerText: {
    flex: 1,
    gap: 6
  },
  title: {
    ...typography.sectionTitle
  },
  subtitle: {
    ...typography.body
  }
});
