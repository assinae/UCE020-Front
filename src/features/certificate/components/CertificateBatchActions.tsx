import { Box } from '@mui/material';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Button } from '@/components/ui/Button';

interface CertificateBatchActionsProps {
  onSignBatch: () => void;
  onSendBatch: () => void;
}

export function CertificateBatchActions({
  onSignBatch,
  onSendBatch,
}: CertificateBatchActionsProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
      <Button
        variant="contained"
        fullWidth
        leftIcon={<DrawOutlinedIcon sx={{ fontSize: 17 }} />}
        onClick={onSignBatch}
        sx={{ bgcolor: '#0F1D35', '&:hover': { bgcolor: '#1a2e50' } }}
      >
        Assinar em lote
      </Button>
      <Button
        variant="outlined"
        fullWidth
        leftIcon={<SendOutlinedIcon sx={{ fontSize: 17 }} />}
        onClick={onSendBatch}
        sx={{
          borderColor: '#2EC4A0',
          color: '#2EC4A0',
          '&:hover': { borderColor: '#25a98a', bgcolor: '#f0fdf9' },
        }}
      >
        Encaminhar
      </Button>
    </Box>
  );
}
