import type { ReactNode } from 'react';
import { Box, ButtonBase, alpha } from '@mui/material';
import { BackButton } from '@/components/ui';
import { colorTokens } from '@/lib/colors';

const INK = colorTokens.navigation.default;
const WHITE = colorTokens.neutral.white;

export interface ListPageStat {
  value: number;
  label: string;
  highlighted?: boolean;
}

export interface ListPageAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface ListPageHeaderProps {
  title: string;
  subtitle: string;
  /** Selo escuro ao lado do subtítulo (data/horário); some quando nulo. */
  pill?: { icon: ReactNode; label: string } | null;
  stats: ListPageStat[];
  backHref: string;
  action?: ListPageAction | null;
}

const backButtonSx = {
  flexShrink: 0,
  border: `1px solid ${alpha(INK, 0.1)}`,
  bgcolor: WHITE,
  color: colorTokens.text.heading,
  transition: 'background .18s ease, border-color .18s ease, color .18s ease',
  '&:hover': {
    bgcolor: colorTokens.surface.mintSubtle,
    borderColor: colorTokens.brand.secondary,
    color: colorTokens.brand.secondary,
  },
};

function ActionButton({ action, fullWidth }: { action: ListPageAction; fullWidth?: boolean }) {
  return (
    <ButtonBase
      onClick={action.onClick}
      disabled={action.disabled}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.25,
        width: fullWidth ? '100%' : 'auto',
        py: fullWidth ? '15px' : '14px',
        px: fullWidth ? 3 : '26px',
        borderRadius: '999px',
        background: colorTokens.navigation.gradient,
        color: WHITE,
        fontSize: fullWidth ? 14.5 : 14,
        fontWeight: 700,
        boxShadow: `0 10px 24px ${alpha(INK, 0.24)}`,
        transition: 'transform .2s ease, opacity .2s ease',
        '& svg': { fontSize: 18, color: colorTokens.brand.primary },
        '&:hover': { transform: 'translateY(-2px)' },
        '&.Mui-disabled': { opacity: 0.45 },
        '@media (prefers-reduced-motion: reduce)': { '&:hover': { transform: 'none' } },
      }}
    >
      {action.icon}
      {action.label}
    </ButtonBase>
  );
}

function Stat({ value, label, highlighted }: ListPageStat) {
  return (
    <Box component="span" sx={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
      <Box
        component="strong"
        sx={{
          fontSize: 17,
          fontWeight: 800,
          color: highlighted ? colorTokens.brand.secondary : colorTokens.text.heading,
        }}
      >
        {value}
      </Box>
      <Box component="span" sx={{ fontSize: 12.5, fontWeight: 600, color: colorTokens.text.label }}>
        {label}
      </Box>
    </Box>
  );
}

export function ListPageHeader({
  title,
  subtitle,
  pill,
  stats,
  backHref,
  action,
}: ListPageHeaderProps) {
  return (
    <>
      <Box
        className="animate-fade-up motion-reduce:animate-none"
        sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'row', alignItems: 'center', gap: 1.5 }}
      >
        <BackButton
          fallbackHref={backHref}
          iconVariant="compact"
          sx={{ ...backButtonSx, width: 40, height: 40, '& svg': { fontSize: 16 } }}
        />
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.35 }}>
          <Box
            component="h1"
            sx={{
              m: 0,
              fontSize: 19,
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: colorTokens.text.heading,
              overflowWrap: 'anywhere',
            }}
          >
            {title}
          </Box>
          <Box component="span" sx={{ fontSize: 13.5, lineHeight: 1.2, fontWeight: 700, color: colorTokens.brand.secondary, overflowWrap: 'anywhere' }}>
            {subtitle}
          </Box>
        </Box>
      </Box>

      <Box
        className="animate-fade-up motion-reduce:animate-none"
        sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: '14px' }}
      >
        <BackButton
          fallbackHref={backHref}
          iconVariant="compact"
          sx={{ ...backButtonSx, width: 42, height: 42, '& svg': { fontSize: 16 } }}
        />
        <Box sx={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Box
            component="h1"
            sx={{
              m: 0,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: colorTokens.text.heading,
            }}
          >
            {title}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
            <Box
              component="span"
              sx={{ fontSize: 15.5, fontWeight: 700, color: colorTokens.brand.secondary }}
            >
              {subtitle}
            </Box>
            {pill && (
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  px: '11px',
                  py: '4px',
                  borderRadius: '999px',
                  bgcolor: INK,
                  color: WHITE,
                  fontSize: 12.5,
                  fontWeight: 700,
                  '& svg': { fontSize: 14, color: colorTokens.brand.primary },
                }}
              >
                {pill.icon}
                {pill.label}
              </Box>
            )}
          </Box>
        </Box>
        {action && <ActionButton action={action} />}
      </Box>
    </>
  );
}
