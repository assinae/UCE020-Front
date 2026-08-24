'use client';

import { Box, Typography, IconButton, Dialog, DialogContent, DialogActions } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageUpload from '@/components/ui/inputs/ImageUpload';
import { Button } from '@/components/ui/Button';

interface AvatarUploadDialogProps {
  open: boolean;
  value: string | null;
  error?: string | null;
  onClose: () => void;
  onChange: (dataUrl: string | null) => void;
}

// Modal exibido ao clicar no ícone da câmera no cabeçalho. Isola a etapa de
// seleção do arquivo (ImageUpload) do restante do formulário — depois de
// escolher a imagem, o fluxo segue para o AvatarCropperDialog.
export function AvatarUploadDialog({ open, value, error, onClose, onChange }: AvatarUploadDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: '20px' } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5 }}>
        <Typography sx={{ fontWeight: 700, color: '#0D1E3B', fontSize: '1.05rem' }}>
          Alterar foto de perfil
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Fechar">
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 2 }}>
        <ImageUpload
          label=""
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error ?? undefined}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}