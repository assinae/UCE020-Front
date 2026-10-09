'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { Box, ButtonBase, alpha } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { colorTokens } from '@/lib/colors';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 3;

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1).replace('.', ',')} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

interface ImagePickerFieldProps {
  id?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  emptyLabel: string;
}

export function ImagePickerField({ id, value, onChange, emptyLabel }: ImagePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pick = () => inputRef.current?.click();

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError('Formato inválido. Use JPG, PNG ou WEBP.');
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`A imagem deve ter no máximo ${MAX_SIZE_MB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setError(null);
      setFile({ name: selected.name, size: selected.size });
      onChange(reader.result as string);
    };
    reader.readAsDataURL(selected);
  };

  const remove = () => {
    setFile(null);
    setError(null);
    onChange(null);
  };

  const input = (
    <input
      ref={inputRef}
      id={id}
      type="file"
      accept={ACCEPTED_TYPES.join(',')}
      onChange={handleFile}
      hidden
    />
  );

  const errorText = error && (
    <Box
      component="span"
      role="alert"
      sx={{ fontSize: 12, fontWeight: 600, color: colorTokens.status.error }}
    >
      {error}
    </Box>
  );

  if (value) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {input}
        <Box
          className="animate-fade-up motion-reduce:animate-none"
          style={{ animationDuration: '0.3s' }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: '8px 10px 8px 8px',
            border: `1.5px solid ${alpha(colorTokens.brand.secondary, 0.3)}`,
            borderRadius: '16px',
            bgcolor: colorTokens.surface.rowHover,
          }}
        >
          <Box
            component="img"
            src={value}
            alt=""
            sx={{
              width: 72,
              aspectRatio: '16 / 9',
              flexShrink: 0,
              objectFit: 'cover',
              borderRadius: '10px',
              bgcolor: colorTokens.navigation.deep,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Box
              component="span"
              sx={{
                fontSize: 13.5,
                fontWeight: 700,
                color: colorTokens.text.heading,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {file?.name ?? 'Imagem atual'}
            </Box>
            {file && (
              <Box
                component="span"
                sx={{ fontSize: 12, fontWeight: 500, color: colorTokens.text.muted }}
              >
                {formatSize(file.size)}
              </Box>
            )}
          </Box>
          <ButtonBase
            onClick={pick}
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: '999px',
              fontSize: 13,
              fontWeight: 700,
              color: colorTokens.brand.secondary,
              transition: 'background .18s ease',
              '&:hover': { bgcolor: colorTokens.surface.mint },
            }}
          >
            Trocar
          </ButtonBase>
          <ButtonBase
            onClick={remove}
            aria-label="Remover imagem"
            sx={{
              width: 34,
              height: 34,
              flexShrink: 0,
              borderRadius: '999px',
              color: colorTokens.text.label,
              transition: 'background .18s ease, color .18s ease',
              '&:hover': {
                bgcolor: colorTokens.surface.dangerSubtle,
                color: colorTokens.status.error,
              },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </ButtonBase>
        </Box>
        {errorText}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {input}
      <ButtonBase
        onClick={pick}
        sx={{
          justifyContent: 'flex-start',
          gap: 1.5,
          width: '100%',
          p: '10px 10px 10px 16px',
          textAlign: 'left',
          border: `1.5px solid ${alpha(colorTokens.navigation.default, 0.12)}`,
          borderRadius: '16px',
          bgcolor: colorTokens.surface.field,
          transition: 'border-color .18s ease, background .18s ease',
          '&:hover': {
            borderColor: colorTokens.brand.secondary,
            bgcolor: colorTokens.neutral.white,
          },
        }}
      >
        <ImageOutlinedIcon sx={{ fontSize: 22, color: colorTokens.text.icon }} />
        <Box
          component="span"
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: 14,
            fontWeight: 500,
            color: colorTokens.text.label,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {emptyLabel}
        </Box>
        <Box
          component="span"
          sx={{
            px: 2,
            py: '9px',
            borderRadius: '999px',
            bgcolor: colorTokens.surface.mint,
            color: colorTokens.brand.secondary,
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          Selecionar
        </Box>
      </ButtonBase>
      {errorText}
    </Box>
  );
}
