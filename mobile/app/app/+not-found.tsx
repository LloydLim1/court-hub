import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { theme } from '../constants/theme';

export default function NotFoundScreen() {
  return (
    <Screen
      eyebrow="Off route"
      title="This screen is not on the game plan."
      subtitle="The route exists as a safety net so the scaffold still feels polished when navigation falls through."
    >
      <SectionCard tone="soft">
        <View style={styles.stack}>
          <Text style={styles.text}>
            Head back to the main experience and keep exploring the CourtHub mobile prototype.
          </Text>
          <PrimaryButton href="/" label="Go home" detail="Return to the landing screen" />
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: theme.spacing.md
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22
  }
});
