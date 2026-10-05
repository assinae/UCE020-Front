import type { FormEvent } from 'react';
import { Box, ButtonBase, CircularProgress, InputBase, alpha } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { colorTokens } from '@/lib/colors';

interface HomeHeroProps {
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  searching: boolean;
}

const PLACEHOLDER = 'Pesquise o código do seu evento';

export function HomeHero({ code, onCodeChange, onSubmit, searching }: HomeHeroProps) {
  const hasCode = code.trim().length > 0;

  return (
    <Box
      component="section"
      className="animate-fade-up motion-reduce:animate-none"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 3,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 260 }}>
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            px: '14px',
            py: '6px',
            mb: '14px',
            borderRadius: '999px',
            bgcolor: colorTokens.surface.mint,
            color: colorTokens.text.mint,
            fontSize: 12.5,
            fontWeight: 700,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 7,
              height: 7,
              borderRadius: '999px',
              bgcolor: colorTokens.brand.secondary,
            }}
          />
          Bem-vindo(a) de volta
        </Box>
        <Box
          component="h1"
          sx={{
            m: 0,
            fontSize: { xs: 32, md: 40 },
            lineHeight: 1.08,
            fontWeight: 800,
            letterSpacing: '-0.035em',
            color: colorTokens.text.heading,
          }}
        >
          O que vamos fazer{' '}
          <Box component="span" sx={{ color: colorTokens.brand.secondary }}>
            hoje?
          </Box>
        </Box>
      </Box>

      <Box
        component="form"
        role="search"
        onSubmit={onSubmit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flex: 1,
          minWidth: 260,
          maxWidth: { md: 420 },
          minHeight: 56,
          py: '9px',
          pl: '22px',
          pr: hasCode ? '9px' : '22px',
          bgcolor: colorTokens.neutral.white,
          border: `1px solid ${alpha(colorTokens.navigation.default, 0.07)}`,
          borderRadius: '999px',
          boxShadow: `0 4px 14px ${alpha(colorTokens.shadow.ink, 0.06)}`,
          transition: 'border-color .2s ease, box-shadow .2s ease',
          '&:focus-within': {
            borderColor: colorTokens.brand.secondary,
            boxShadow: `0 4px 16px ${alpha(colorTokens.brand.secondary, 0.16)}`,
          },
        }}
      >
        <SearchRoundedIcon sx={{ color: colorTokens.brand.secondary, fontSize: 21 }} />
        <InputBase
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={PLACEHOLDER}
          inputProps={{ 'aria-label': PLACEHOLDER }}
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: 14.5,
            color: colorTokens.text.heading,
            '& input::placeholder': { color: colorTokens.text.placeholder, opacity: 1 },
          }}
        />
        {hasCode && (
          <ButtonBase
            type="submit"
            disabled={searching}
            sx={{
              flexShrink: 0,
              minHeight: 38,
              minWidth: 84,
              px: 2.5,
              borderRadius: '999px',
              bgcolor: colorTokens.brand.secondary,
              color: colorTokens.neutral.white,
              fontSize: 13,
              fontWeight: 700,
              transition: 'background .18s ease',
              '&:hover': { bgcolor: colorTokens.brand.secondaryDark },
              '&.Mui-disabled': { opacity: 0.7 },
            }}
          >
            {searching ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : 'Buscar'}
          </ButtonBase>
        )}
      </Box>
    </Box>
  );
}
