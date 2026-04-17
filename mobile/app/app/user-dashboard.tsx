import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { userActions, userMoments } from '../constants/data';
import { theme } from '../constants/theme';

export default function UserDashboardScreen() {
  return (
    <Screen
      eyebrow="Player dashboard"
      title="Your next session is already lined up."
      subtitle="A hospitality-style dashboard that leads with your next moments, then fans out into bookings, performance, and club access."
    >
      <SectionCard
        title="League Pass status"
        subtitle="Premium member since January 2026"
        rightSlot={<Text style={styles.statusPill}>Active</Text>}
        tone="strong"
      >
        <View style={styles.metricStack}>
          <Text style={styles.metricValue}>4 upcoming bookings</Text>
          <Text style={styles.metricNote}>
            Your priority window opens 15 minutes before public release for finals-week courts.
          </Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressCaption}>Season goal progress: 78% of planned sessions completed</Text>
        </View>
      </SectionCard>

      <SectionCard
        title="Next up"
        subtitle="A calm, vertical feed instead of a dense tile wall."
      >
        <View style={styles.list}>
          {userMoments.map((moment) => (
            <View key={moment.title} style={styles.item}>
              <Text style={styles.itemTitle}>{moment.title}</Text>
              <Text style={styles.itemDetail}>{moment.detail}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard
        title="Quick actions"
        subtitle="Reserved for the highest-frequency player tasks."
      >
        <View style={styles.actionList}>
          {userActions.map((action) => (
            <View key={action} style={styles.actionRow}>
              <View style={styles.actionDot} />
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
        </View>
        <PrimaryButton
          href="/"
          label="Back to home"
          detail="Return to the landing experience"
          variant="ghost"
        />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusPill: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(52, 211, 153, 0.14)'
  },
  metricStack: {
    gap: theme.spacing.sm
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '700'
  },
  metricNote: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21
  },
  progressTrack: {
    height: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden'
  },
  progressFill: {
    width: '78%',
    height: '100%',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.accent
  },
  progressCaption: {
    color: theme.colors.textSoft,
    fontSize: 13
  },
  list: {
    gap: theme.spacing.md
  },
  item: {
    gap: 4,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  itemTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '700'
  },
  itemDetail: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21
  },
  actionList: {
    gap: theme.spacing.sm
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm
  },
  actionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent
  },
  actionText: {
    color: theme.colors.textMuted,
    fontSize: 15
  }
});
