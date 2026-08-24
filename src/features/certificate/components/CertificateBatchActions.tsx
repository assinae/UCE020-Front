import { Box } from '@mui/material';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Button } from '@/components/ui/Button';

interface CertificateBatchActionsProps {
  onSignBatch: () => void;
  onSendBatch: () => void;
  isSigning?: boolean;
  signDisabled?: boolean;
}

export function CertificateBatchActions({
  onSignBatch,
  onSendBatch,
  isSigning = false,
  signDisabled = false,
}: CertificateBatchActionsProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
      <Button
        variant="contained"
        fullWidth
        isLoading={isSigning}
        disabled={signDisabled}
        leftIcon={<DrawOutlinedIcon sx={{ fontSize: 18 }} />}
        onClick={onSignBatch}
        sx={{
          py: 1.25,
          borderRadius: '12px',
          bgcolor: '#0F1D35',
          boxShadow: '0 4px 12px rgba(15, 29, 53, 0.18)',
          '&:hover': { bgcolor: '#1a2e50', boxShadow: '0 6px 16px rgba(15, 29, 53, 0.24)' },
        }}
      >
        {isSigning ? 'Assinando...' : 'Assinar em lote'}
      </Button>
    </Box>
  );
}
