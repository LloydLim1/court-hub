import { Link, Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { shadows, theme } from '../constants/theme';

type PrimaryButtonProps = {
  href: Href;
  label: string;
  detail?: string;
  variant?: 'solid' | 'ghost';
};

export function PrimaryButton({
  href,
  label,
  detail,
  variant = 'solid'
}: PrimaryButtonProps) {
  const inner = (
    <Pressable style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      {variant === 'solid' ? (
        <LinearGradient
          colors={[theme.colors.primary, '#3D8BFF', theme.colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.solidButton}
        >
          <Text style={styles.solidLabel}>{label}</Text>
          {detail ? <Text style={styles.solidDetail}>{detail}</Text> : null}
        </LinearGradient>
      ) : (
        <View style={styles.ghostButton}>
          <Text style={styles.ghostLabel}>{label}</Text>
          {detail ? <Text style={styles.ghostDetail}>{detail}</Text> : null}
        </View>
      )}
    </Pressable>
  );

  return (
    <Link href={href} asChild>
      {inner}
    </Link>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%'
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }]
  },
  solidButton: {
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 16,
    gap: 4,
    ...shadows.card
  },
  solidLabel: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700'
  },
  solidDetail: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13
  },
  ghostButton: {
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(9, 24, 45, 0.68)'
  },
  ghostLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700'
  },
  ghostDetail: {
    color: theme.colors.textMuted,
    fontSize: 13
  }
});
