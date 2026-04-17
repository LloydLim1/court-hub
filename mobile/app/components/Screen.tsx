import { PropsWithChildren, ReactNode } from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { shadows, theme, typography } from '../constants/theme';

type ScreenProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  subtitle: string;
  headerRight?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export function Screen({
  children,
  eyebrow,
  title,
  subtitle,
  headerRight,
  contentContainerStyle
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#04101E', '#0A1930', '#061224']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />

      <ScrollView
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            {eyebrow ? <Text style={typography.caption}>{eyebrow}</Text> : null}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
        </View>

        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.lg
  },
  header: {
    gap: theme.spacing.md
  },
  headerText: {
    gap: theme.spacing.sm
  },
  headerRight: {
    alignSelf: 'flex-start'
  },
  title: {
    ...typography.title,
    maxWidth: 320
  },
  subtitle: {
    ...typography.body,
    maxWidth: 340
  },
  orbTop: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(32, 132, 255, 0.18)',
    ...shadows.soft
  },
  orbBottom: {
    position: 'absolute',
    bottom: 80,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(99, 210, 255, 0.12)'
  }
});
