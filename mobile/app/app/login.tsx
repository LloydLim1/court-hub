import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { theme } from '../constants/theme';

export default function LoginScreen() {
  return (
    <Screen
      eyebrow="Sign in"
      title="Welcome back to the club."
      subtitle="Designed like a premium stay arrival, but tuned for players who need fast access to bookings, training, and live venue updates."
    >
      <SectionCard tone="strong">
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="captain@courthub.club"
              placeholderTextColor={theme.colors.textSoft}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor={theme.colors.textSoft}
              style={styles.input}
            />
          </View>

          <View style={styles.buttonStack}>
            <PrimaryButton
              href="/user-dashboard"
              label="Continue as player"
              detail="Sample route into the member dashboard"
            />
            <PrimaryButton
              href="/admin-dashboard"
              label="Continue as admin"
              detail="Preview the operations dashboard"
              variant="ghost"
            />
          </View>
        </View>
      </SectionCard>

      <SectionCard
        title="Fast lane"
        subtitle="Use the scaffolded routes below while wiring real auth later."
        tone="soft"
      >
        <View style={styles.metaList}>
          <Text style={styles.metaItem}>Player demo: any email and password combination</Text>
          <Text style={styles.metaItem}>Admin demo: use the admin route button for operations preview</Text>
          <Text style={styles.metaItem}>Need an account first? Head to sign up for a hospitality-style onboarding screen</Text>
        </View>
        <PrimaryButton
          href="/signup"
          label="Create a new account"
          detail="Launch the sign-up flow"
          variant="ghost"
        />
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
  metaList: {
    gap: theme.spacing.sm
  },
  metaItem: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  }
});
