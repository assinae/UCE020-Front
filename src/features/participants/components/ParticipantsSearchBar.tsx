import { Box, Paper, InputBase } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { colorTokens } from '@/lib/colors';
import type { PresenceFilter } from '@/types/participant';
import { PresenceFilterButton } from './PresenceFilterButton';

interface ParticipantsSearchBarProps {
  search: string;
  presenceFilter: PresenceFilter;
  onSearchChange: (value: string) => void;
  onFilterToggle: (filter: Exclude<PresenceFilter, 'all'>) => void;
}

export function ParticipantsSearchBar({
  search,
  presenceFilter,
  onSearchChange,
  onFilterToggle,
}: ParticipantsSearchBarProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderRadius: '12px',
          bgcolor: colorTokens.surface.background,
        }}
      >
        <SearchRoundedIcon sx={{ color: colorTokens.neutral.gray500, fontSize: 20 }} />
        <InputBase
          placeholder="Buscar"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          fullWidth
          inputProps={{ 'aria-label': 'Buscar participante' }}
          sx={{ fontSize: 14 }}
        />
      </Paper>

      <Box sx={{ display: 'flex', p: 1, borderRadius: '12px', flexShrink: 0 }}>
        <PresenceFilterButton
          isActive={presenceFilter === 'confirmed'}
          onClick={() => onFilterToggle('confirmed')}
          aria-label="Filtrar presenças confirmadas"
          aria-pressed={presenceFilter === 'confirmed'}
        >
          <CheckRoundedIcon sx={{ fontSize: 20 }} />
        </PresenceFilterButton>
        <PresenceFilterButton
          isActive={presenceFilter === 'pending'}
          onClick={() => onFilterToggle('pending')}
          aria-label="Filtrar validações pendentes"
          aria-pressed={presenceFilter === 'pending'}
        >
          <RemoveRoundedIcon sx={{ fontSize: 20 }} />
        </PresenceFilterButton>
      </Box>
    </Box>
  );
}
