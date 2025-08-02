// App-wide constants
export const COLORS = {
  primary: '#66C4FF', // Light Blue
  secondary: '#7D99AA', // Gray Blue
  accent: '#66F4FF', // Cyan
  warning: '#FFC067', // Orange
  background: '#fff',
  surface: '#f9fafb',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#f3f4f6',
  success: '#66F4FF', // Using cyan for success
  error: '#ef4444',
} as const;

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const ANIMATION_DURATION = {
  fast: 100,
  normal: 200,
  slow: 300,
} as const;