import { Box, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SelectInput from '@/components/ui/inputs/SelectInput';
import { Button } from '@/components/ui/Button';

interface CertificateFiltersProps {
  activityDraft: string;
  statusDraft: string;
  activityOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  onActivityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onApply: () => void;
}

export function CertificateFilters({
  activityDraft,
  statusDraft,
  activityOptions,
  statusOptions,
  onActivityChange,
  onStatusChange,
  onApply,
}: CertificateFiltersProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: 11, color: '#64748B', mb: 0.5 }}>Atividade</Typography>
        <SelectInput value={activityDraft} onChange={onActivityChange} options={activityOptions} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: 11, color: '#64748B', mb: 0.5 }}>Status</Typography>
        <SelectInput value={statusDraft} onChange={onStatusChange} options={statusOptions} />
      </Box>
      <Button
        variant="outlined"
        onClick={onApply}
        leftIcon={<FilterListIcon sx={{ fontSize: 16 }} />}
        sx={{
          flexShrink: 0,
          borderColor: '#E2E8F0',
          color: '#0F1D35',
          height: 40,
          minWidth: 'auto',
        }}
      >
        Filtrar
      </Button>
    </Box>
  );
}
