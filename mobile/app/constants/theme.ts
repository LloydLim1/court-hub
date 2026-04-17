import { TextStyle, ViewStyle } from 'react-native';

export const theme = {
  colors: {
    background: '#061224',
    surface: '#0E1E35',
    surfaceMuted: '#152A48',
    card: 'rgba(16, 33, 58, 0.82)',
    cardStrong: '#183863',
    primary: '#1A73FF',
    primaryDeep: '#0D47BF',
    accent: '#63D2FF',
    accentSoft: 'rgba(99, 210, 255, 0.15)',
    text: '#F5F7FB',
    textMuted: '#A9B7CF',
    textSoft: '#7F93B2',
    border: 'rgba(161, 188, 255, 0.18)',
    success: '#34D399',
    warning: '#F59E0B',
    danger: '#FB7185',
    white: '#FFFFFF'
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32
  },
  radius: {
    sm: 14,
    md: 20,
    lg: 28,
    pill: 999
  }
} as const;

export const shadows = {
  card: {
    shadowColor: '#02101F',
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10
  } satisfies ViewStyle,
  soft: {
    shadowColor: '#0C2A4D',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6
  } satisfies ViewStyle
};

export const typography = {
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    color: theme.colors.text
  } satisfies TextStyle,
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text
  } satisfies TextStyle,
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textMuted
  } satisfies TextStyle,
  caption: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.colors.accent
  } satisfies TextStyle
};
