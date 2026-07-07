'use client';

import { Box, Typography, IconButton } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { colorTokens } from '@/lib/colors';

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Imagem',
  error = false,
  helperText,
  onBlur,
}: ImageUploadProps) {
  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveImage() {
    onChange(null);
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      {label && (
        <Typography sx={{ fontSize: 12, fontWeight: 500, color: colorTokens.text.primary, mb: 0.75 }}>
          {label}
        </Typography>
      )}
      <Box
        sx={{
          border: `2px dashed ${error ? 'error.main' : colorTokens.neutral.gray300}`,
          borderRadius: '8px',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 120,
          cursor: 'pointer',
          position: 'relative',
          '&:hover': {
            borderColor: colorTokens.navigation.default,
          },
        }}
        onClick={() => document.getElementById('image-upload-input')?.click()}
      >
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          onBlur={onBlur}
          style={{ display: 'none' }}
        />
        {value ? (
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Box
              component="img"
              src={value}
              alt="Preview"
              sx={{
                width: '100%',
                maxHeight: 200,
                objectFit: 'contain',
                borderRadius: '4px',
              }}
            />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: colorTokens.neutral.white,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  backgroundColor: colorTokens.neutral,
                },
              }}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <ImageOutlinedIcon sx={{ fontSize: 32, color: colorTokens.neutral }} />
            <Typography sx={{ fontSize: 12, color: colorTokens.neutral.gray500, textAlign: 'center' }}>
              Clique para adicionar a imagem
            </Typography>
          </Box>
        )}
      </Box>
      {helperText && error ? (
        <Typography sx={{ mt: 0.4, fontSize: 11, color: 'error.main' }}>{helperText}</Typography>
      ) : null}
    </Box>
  );
}
