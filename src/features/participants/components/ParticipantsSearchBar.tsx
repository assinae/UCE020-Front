import { Box, Paper, InputBase } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { colorTokens } from '@/lib/colors';

interface ParticipantsSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

// O filtro de presença saiu daqui para o menu de ordenar e filtrar do card.
export function ParticipantsSearchBar({
  search,
  onSearchChange,
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

    </Box>
  );
}
