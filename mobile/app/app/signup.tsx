import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { theme } from '../constants/theme';

export default function SignupScreen() {
  return (
    <Screen
      eyebrow="Membership"
      title="Build your CourtHub profile in one smooth set."
      subtitle="A premium sports onboarding flow with room for player identity, membership tier, and the kind of training rhythm you want to keep."
    >
      <SectionCard tone="strong">
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              placeholder="Jordan Reyes"
              placeholderTextColor={theme.colors.textSoft}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="jordan@courthub.club"
              placeholderTextColor={theme.colors.textSoft}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Preferred sport focus</Text>
            <TextInput
              placeholder="Basketball, padel, performance training..."
              placeholderTextColor={theme.colors.textSoft}
              style={styles.input}
            />
          </View>

          <View style={styles.buttonStack}>
            <PrimaryButton
              href="/user-dashboard"
              label="Create and enter dashboard"
              detail="Continue into the member view"
            />
            <PrimaryButton
              href="/login"
              label="Already have an account?"
              detail="Return to login"
              variant="ghost"
            />
          </View>
        </View>
      </SectionCard>

      <SectionCard
        title="What members get"
        subtitle="The experience leans into club warmth rather than cold software panels."
      >
        <View style={styles.perks}>
          <Text style={styles.perk}>Priority court drops and waitlist alerts</Text>
          <Text style={styles.perk}>Coach messaging, wellness scheduling, and session recaps</Text>
          <Text style={styles.perk}>A hospitality-first dashboard with your next moments at the top</Text>
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: theme.spacing.lg
  },
  field: {
    gap: theme.spacing.sm
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700'
  },
  input: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(4, 14, 29, 0.48)',
    color: theme.colors.text,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15
  },
  buttonStack: {
    gap: theme.spacing.sm
  },
  perks: {
    gap: theme.spacing.sm
  },
  perk: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  }
});
