import { Box, Typography, alpha } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SelectInput from '@/components/ui/inputs/SelectInput';
import { Button } from '@/components/ui/Button';
import { Searchbar } from '@/components/ui/Searchbar';
import { colorTokens } from '@/lib/colors';

interface CertificateFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sourceDraft: string;
  statusDraft: string;
  sourceOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  onSourceChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onApply: () => void;
}

export function CertificateFilters({
  search,
  onSearchChange,
  sourceDraft,
  statusDraft,
  sourceOptions,
  statusOptions,
  onSourceChange,
  onStatusChange,
  onApply,
}: CertificateFiltersProps) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 12, color: colorTokens.text.heading, mb: 0.75, fontWeight: 800 }}>
          Buscar certificados
        </Typography>
        <Searchbar
          value={search}
          onChange={onSearchChange}
          placeholder="Nome, e-mail ou atividade"
          sx={{
            mt: 0,
            minHeight: 44,
            px: 1.75,
            py: 0.75,
            boxShadow: 'none',
            bgcolor: colorTokens.surface.muted,
            borderColor: alpha(colorTokens.navigation.default, 0.08),
            '&:focus-within': {
              bgcolor: colorTokens.neutral.white,
              borderColor: colorTokens.brand.secondary,
            },
          }}
        />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr auto' }, gap: 1.25, alignItems: 'end' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 11, color: colorTokens.text.label, mb: 0.65, fontWeight: 700 }}>Certificados de</Typography>
          <SelectInput value={sourceDraft} onChange={onSourceChange} options={sourceOptions} sx={{ '& .MuiInputBase-root': { minHeight: 44, borderRadius: '14px', bgcolor: colorTokens.surface.muted }, '& .MuiSelect-select': { py: 1 } }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 11, color: colorTokens.text.label, mb: 0.65, fontWeight: 700 }}>Status</Typography>
          <SelectInput value={statusDraft} onChange={onStatusChange} options={statusOptions} sx={{ '& .MuiInputBase-root': { minHeight: 44, borderRadius: '14px', bgcolor: colorTokens.surface.muted }, '& .MuiSelect-select': { py: 1 } }} />
        </Box>
        <Button
          variant="outlined"
          onClick={onApply}
          leftIcon={<FilterListIcon sx={{ fontSize: 16 }} />}
          sx={{
            minHeight: 44,
            flexShrink: 0,
            borderColor: alpha(colorTokens.navigation.default, 0.12),
            borderRadius: '14px',
            color: colorTokens.text.heading,
            minWidth: { xs: '100%', sm: 130 },
            px: 2,
            '&:hover': { borderColor: colorTokens.brand.secondary, bgcolor: colorTokens.surface.mintSubtle },
          }}
        >
          Aplicar filtros
        </Button>
      </Box>
    </Box>
  );
}
