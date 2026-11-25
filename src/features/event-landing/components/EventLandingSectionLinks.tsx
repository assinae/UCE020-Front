import { Box } from '@mui/material';
import { colorTokens } from '@/lib/colors';

export interface SectionLink {
  id: string;
  label: string;
}

interface EventLandingSectionLinksProps {
  sections: SectionLink[];
  activeId: string;
  size?: 'header' | 'bar';
}

export function EventLandingSectionLinks({
  sections,
  activeId,
  size = 'bar',
}: EventLandingSectionLinksProps) {
  const isHeader = size === 'header';

  return (
    <Box
      component="ul"
      sx={{
        m: 0,
        p: 0,
        display: 'flex',
        alignItems: 'stretch',
        gap: isHeader ? 0.5 : { xs: 0.5, sm: 1 },
        height: '100%',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {sections.map(({ id, label }) => {
        const isActive = id === activeId;
        return (
          <Box component="li" key={id} sx={{ listStyle: 'none', flexShrink: 0, display: 'flex' }}>
            <Box
              component="a"
              href={`#${id}`}
              aria-current={isActive ? 'location' : undefined}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: isHeader ? 1.75 : { xs: 1.5, sm: 2 },
                py: isHeader ? 0 : 1.75,
                fontSize: isHeader ? 14.5 : 14,
                fontWeight: isActive ? 800 : 600,
                color: isActive ? colorTokens.text.heading : colorTokens.text.muted,
                textDecoration: 'none',
                borderBottom: `3px solid ${isActive ? colorTokens.brand.secondary : 'transparent'}`,
                borderTop: isHeader ? '3px solid transparent' : 'none',
                transition: 'color .18s ease, border-color .18s ease',
                '&:hover': { color: colorTokens.text.heading },
                '&:focus-visible': {
                  outline: `2px solid ${colorTokens.brand.secondary}`,
                  outlineOffset: -2,
                },
              }}
            >
              {label}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
