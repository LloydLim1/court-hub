import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { featuredCourts, homeHighlights } from '../constants/data';
import { theme } from '../constants/theme';

export default function HomeScreen() {
  return (
    <Screen
      eyebrow="CourtHub Mobile"
      title="Where club energy meets frictionless court bookings."
      subtitle="A blue-hour sports experience for players, coaches, and operators who want the whole venue in their pocket."
    >
      <SectionCard tone="strong">
        <View style={styles.heroStack}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Airy hospitality, built for game night</Text>
          </View>
          <Text style={styles.heroText}>
            Move from discovery to booking to live operations without leaving the app. Every screen is tuned for a premium sports club rhythm.
          </Text>
          <View style={styles.buttonStack}>
            <PrimaryButton
              href="/login"
              label="Log in and hit the floor"
              detail="Player, coach, or club staff"
            />
            <PrimaryButton
              href="/signup"
              label="Create your membership"
              detail="Join the waitlist or launch a new club profile"
              variant="ghost"
            />
          </View>
        </View>
      </SectionCard>

      <SectionCard
        title="Club pulse"
        subtitle="A vertical feed of what feels alive inside CourtHub right now."
      >
        <View style={styles.list}>
          {homeHighlights.map((item) => (
            <View key={item.label} style={styles.listItem}>
              <Text style={styles.listLabel}>{item.label}</Text>
              <Text style={styles.listValue}>{item.value}</Text>
              <Text style={styles.listNote}>{item.note}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard
        title="Explore the experience"
        subtitle="Jump into the role-specific views to see how the mobile flow feels."
      >
        <View style={styles.buttonStack}>
          <PrimaryButton
            href="/user-dashboard"
            label="Preview user dashboard"
            detail="Bookings, performance, and club perks"
          />
          <PrimaryButton
            href="/admin-dashboard"
            label="Preview admin dashboard"
            detail="Operations, utilization, and revenue visibility"
            variant="ghost"
          />
        </View>
      </SectionCard>

      <SectionCard
        title="Featured spaces"
        subtitle="Polished, hospitality-first descriptions instead of dense management screens."
      >
        <View style={styles.list}>
          {featuredCourts.map((court) => (
            <View key={court.title} style={styles.courtCard}>
              <Text style={styles.courtTitle}>{court.title}</Text>
              <Text style={styles.courtDetail}>{court.detail}</Text>
              <Text style={styles.courtMeta}>{court.meta}</Text>
            </View>
          ))}
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroStack: {
    gap: theme.spacing.md
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: theme.colors.accentSoft
  },
  badgeText: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6
  },
  heroText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 23
  },
  buttonStack: {
    gap: theme.spacing.sm
  },
  list: {
    gap: theme.spacing.md
  },
  listItem: {
    gap: 4,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  listLabel: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase'
  },
  listValue: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700'
  },
  listNote: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  courtCard: {
    gap: 6,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  courtTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700'
  },
  courtDetail: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21
  },
  courtMeta: {
    color: theme.colors.accent,
    fontSize: 13,
    fontWeight: '600'
  }
});
