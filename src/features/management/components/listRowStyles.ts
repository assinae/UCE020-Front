import { colorTokens } from '@/lib/colors';

export const managementListRowSx = {
  bgcolor: colorTokens.neutral.white,
  borderRadius: '12px',
  p: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  border: `1px solid ${colorTokens.neutral.border}`,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
} as const;

export const managementListNameSx = {
  flex: 1,
  fontWeight: 500,
  fontSize: 'clamp(12px, 3vw, 14px)',
  color: colorTokens.text.primary,
} as const;

export const managementIconButtonSx = { p: 0 } as const;
