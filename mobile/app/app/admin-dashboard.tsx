import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { adminQueue, adminSnapshot } from '../constants/data';
import { theme } from '../constants/theme';

export default function AdminDashboardScreen() {
  return (
    <Screen
      eyebrow="Operations"
      title="Run the venue like a premium sports property."
      subtitle="The admin dashboard stays mobile-first with stacked insight cards, staffing visibility, and action queues that feel composed instead of cluttered."
    >
      <SectionCard
        title="Today at a glance"
        subtitle="Operational health without forcing a spreadsheet layout."
        tone="strong"
      >
        <View style={styles.snapshotList}>
          {adminSnapshot.map((item) => (
            <View key={item.label} style={styles.snapshotItem}>
              <Text style={styles.snapshotLabel}>{item.label}</Text>
              <Text style={styles.snapshotValue}>{item.value}</Text>
              <Text style={styles.snapshotNote}>{item.note}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard
        title="Manager queue"
        subtitle="Short, high-signal tasks for the next hour."
      >
        <View style={styles.queue}>
          {adminQueue.map((task, index) => (
            <View key={task} style={styles.queueRow}>
              <Text style={styles.queueIndex}>{String(index + 1).padStart(2, '0')}</Text>
              <Text style={styles.queueText}>{task}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard
        title="Move through the experience"
        subtitle="Helpful routes while real admin actions are being integrated."
      >
        <View style={styles.buttonStack}>
          <PrimaryButton
            href="/login"
            label="Return to login"
            detail="Switch role or test another flow"
            variant="ghost"
          />
          <PrimaryButton
            href="/"
            label="Open landing screen"
            detail="Review the public-facing mobile experience"
          />
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  snapshotList: {
    gap: theme.spacing.md
  },
  snapshotItem: {
    gap: 4,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  snapshotLabel: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase'
  },
  snapshotValue: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '700'
  },
  snapshotNote: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21
  },
  queue: {
    gap: theme.spacing.md
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md
  },
  queueIndex: {
    color: theme.colors.accent,
    fontSize: 13,
    fontWeight: '700',
    width: 24,
    paddingTop: 2
  },
  queueText: {
    flex: 1,
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22
  },
  buttonStack: {
    gap: theme.spacing.sm
  }
});
