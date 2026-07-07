import { Paper, InputBase } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { colorTokens } from '@/lib/colors';

interface ManagementSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function ManagementSearchBar({
  search,
  onSearchChange,
  placeholder = 'Buscar',
  ariaLabel = 'Buscar',
}: ManagementSearchBarProps) {
  return (
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
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        fullWidth
        inputProps={{ 'aria-label': ariaLabel }}
        sx={{ fontSize: 14 }}
      />
    </Paper>
  );
}
