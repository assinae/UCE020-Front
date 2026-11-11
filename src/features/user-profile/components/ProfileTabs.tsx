'use client';

import { Box, ButtonBase, alpha } from '@mui/material';
import { colorTokens } from '@/lib/colors';

export type ProfileTab = 'account' | 'activity';

const TABS: { value: ProfileTab; label: string }[] = [
  { value: 'account', label: 'Minha conta' },
  { value: 'activity', label: 'Atividade' },
];

export const profileTabId = (tab: ProfileTab) => `profile-tab-${tab}`;
export const profilePanelId = (tab: ProfileTab) => `profile-panel-${tab}`;

interface ProfileTabsProps {
  value: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export function ProfileTabs({ value, onChange }: ProfileTabsProps) {
  const activeIndex = TABS.findIndex((tab) => tab.value === value);

  return (
    <Box
      role="tablist"
      aria-label="Seções do perfil"
      className="animate-fade-up motion-reduce:animate-none"
      style={{ animationDelay: '0.02s' }}
      sx={{
        position: 'relative',
        display: 'flex',
        gap: 0.5,
        p: '5px',
        borderRadius: '999px',
        bgcolor: colorTokens.neutral.white,
        border: `1px solid ${alpha(colorTokens.navigation.default, 0.08)}`,
        boxShadow: `0 4px 14px ${alpha(colorTokens.shadow.ink, 0.05)}`,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 5,
          bottom: 5,
          left: 5,
          width: 'calc(50% - 7px)',
          borderRadius: '999px',
          bgcolor: colorTokens.navigation.deep,
          transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 4}px))`,
          transition: 'transform .35s cubic-bezier(0.22, 0.85, 0.3, 1)',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      />
      {TABS.map((tab) => {
        const selected = tab.value === value;
        return (
          <ButtonBase
            key={tab.value}
            id={profileTabId(tab.value)}
            role="tab"
            aria-selected={selected}
            aria-controls={profilePanelId(tab.value)}
            onClick={() => onChange(tab.value)}
            sx={{
              position: 'relative',
              flex: 1,
              py: 1.375,
              px: 2,
              borderRadius: '999px',
              fontSize: 13.5,
              fontWeight: 700,
              color: selected ? colorTokens.neutral.white : colorTokens.text.muted,
              transition: 'color .2s ease',
              '&:hover': { color: selected ? undefined : colorTokens.navigation.deep },
            }}
          >
            {tab.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
