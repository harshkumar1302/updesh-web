/** Privilege Residential / Updesh design tokens from DESIGN.md */

export const colors = {
  surface: '#f9f9ff',
  surfaceDim: '#d3daea',
  surfaceBright: '#f9f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f0f3ff',
  surfaceContainer: '#e7eefe',
  surfaceContainerHigh: '#e2e8f8',
  surfaceContainerHighest: '#dce2f3',
  onSurface: '#151c27',
  onSurfaceVariant: '#404944',
  inverseSurface: '#2a313d',
  inverseOnSurface: '#ebf1ff',
  outline: '#707974',
  outlineVariant: '#bfc9c3',
  outlineLight: '#E5E7EB',
  surfaceTint: '#2b6954',
  primary: '#064E3B',
  primaryDark: '#003527',
  onPrimary: '#ffffff',
  primaryContainer: '#064e3b',
  onPrimaryContainer: '#80bea6',
  inversePrimary: '#95d3ba',
  secondary: '#575e70',
  onSecondary: '#ffffff',
  secondaryContainer: '#d9dff5',
  onSecondaryContainer: '#5c6274',
  tertiary: '#2c2f30',
  onTertiary: '#ffffff',
  tertiaryContainer: '#424546',
  onTertiaryContainer: '#b0b2b3',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  background: '#f9f9ff',
  onBackground: '#151c27',
  surfaceVariant: '#dce2f3',
  inputBackground: '#F3F4F6',
} as const;

export const typography = {
  headlineLg: { fontSize: 32, lineHeight: 40, fontWeight: '500' as const, letterSpacing: -0.64 },
  headlineLgMobile: { fontSize: 24, lineHeight: 32, fontWeight: '500' as const, letterSpacing: -0.24 },
  headlineMd: { fontSize: 20, lineHeight: 28, fontWeight: '500' as const },
  bodyLg: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  labelCaps: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const, letterSpacing: 0.6 },
  labelSm: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 64,
  containerMax: 1280,
  gutter: 24,
  marginMobile: 16,
  marginDesktop: 40,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export const shadows = {
  hover: '0px 4px 20px rgba(0, 0, 0, 0.05)',
} as const;

export const mobileTheme = {
  colors,
  typography,
  spacing,
  radii,
} as const;

/** Tailwind-friendly export for web */
export const tailwindExtend = {
  colors: {
    primary: {
      DEFAULT: colors.primary,
      dark: colors.primaryDark,
      light: colors.onPrimaryContainer,
      container: colors.primaryContainer,
    },
    surface: {
      DEFAULT: colors.surface,
      dim: colors.inputBackground,
      container: colors.surfaceContainerLowest,
      variant: colors.surfaceVariant,
    },
    onSurface: {
      DEFAULT: colors.onSurface,
      variant: colors.onSurfaceVariant,
    },
    outline: {
      DEFAULT: colors.outlineLight,
      variant: colors.outlineVariant,
    },
    error: colors.error,
    background: colors.background,
  },
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
  maxWidth: {
    container: `${spacing.containerMax}px`,
  },
  borderRadius: {
    sm: `${radii.sm}px`,
    md: `${radii.md}px`,
  },
  boxShadow: {
    hover: shadows.hover,
  },
};
