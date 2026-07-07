export const colorTokens = {
  brand: {
    primary: '#76E3BC',
    primaryLight: '#9FF0D5',
    primaryDark: '#5CC7A2',
    secondary: '#008963',
    secondaryLight: '#00A876',
    secondaryDark: '#006C4F',
  },
  surface: {
    background: '#EDEDED',
    paper: '#FAFAFA',
  },
  text: {
    primary: '#192C48',
    secondary: '#0D1E3B',
    inverse: '#FFFFFF',
  },
  status: {
    error: '#B22C29',
    errorLight: '#D32F2F',
    errorDark: '#8B1A1A',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    border: '#D9D9D9',
    gray300: '#E5E7EB',
    gray500: '#6B7280',
    gray700: '#374151',
  },
  navigation: {
    default: '#0D1E3B',
    hover: '#254778',
  },
} as const;

export type ColorTokenGroup = keyof typeof colorTokens;