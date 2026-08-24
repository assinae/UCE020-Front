'use client';

import { Box, Avatar, Typography, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import type { UserProfile } from '@/types/userProfile';
import { AvatarUploadDialog } from './AvatarUploadDialog';
import { AvatarCropperDialog } from './AvatarCropperDialog';

interface ProfileHeaderProps {
  user: UserProfile;
  onAvatarChange?: (file: File) => void;
}

const MAX_AVATAR_SIZE_MB = 3;
const MAX_AVATAR_SIZE_BYTES = MAX_AVATAR_SIZE_MB * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// O ImageUpload só entrega uma Data URL (não o File original com metadados),
// então a validação de tipo/tamanho precisa ser extraída dela mesma.
function parseDataUrl(dataUrl: string): { mime: string; sizeBytes: number } | null {
  const match = /^data:(.+);base64,(.*)$/.exec(dataUrl);
  if (!match) return null;
  const [, mime, base64] = match;
  return { mime, sizeBytes: Math.ceil((base64.length * 3) / 4) };
}

export function ProfileHeader({ user, onAvatarChange }: ProfileHeaderProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // ── Avatar (modal de upload + recorte) ────────────────────
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl ?? null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [rawAvatarSrc, setRawAvatarSrc] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleOpenAvatarUpload = () => {
    setAvatarError(null);
    setUploadOpen(true);
  };

  const handleCloseAvatarUpload = () => {
    setAvatarError(null);
    setUploadOpen(false);
  };

  const handleAvatarSelect = (dataUrl: string | null) => {
    if (!dataUrl) {
      // Usuário removeu a foto pelo botão de lixeira do ImageUpload
      setAvatarPreview(null);
      setAvatarError(null);
      setUploadOpen(false);
      return;
    }

    const parsed = parseDataUrl(dataUrl);
    if (!parsed || !ALLOWED_AVATAR_TYPES.includes(parsed.mime)) {
      setAvatarError('Formato inválido. Use JPG, PNG ou WEBP.');
      return;
    }
    if (parsed.sizeBytes > MAX_AVATAR_SIZE_BYTES) {
      setAvatarError(`A imagem deve ter no máximo ${MAX_AVATAR_SIZE_MB}MB.`);
      return;
    }

    setAvatarError(null);
    setRawAvatarSrc(dataUrl);
    setUploadOpen(false);
    setCropOpen(true);
  };

  const handleCropConfirm = (blob: Blob) => {
    if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    const objectUrl = URL.createObjectURL(blob);
    setAvatarPreview(objectUrl);

    const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: 'image/jpeg' });
    onAvatarChange?.(file);
  };

  return (
    <Box
      sx={{
        background: '#0F1D35',
        position: 'relative',
        pt: 3,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            alt={user.name}
            src={avatarPreview || undefined}
            sx={{
              width: 100,
              height: 100,
              border: '4px solid rgba(255, 255, 255, 0.3)',
              mb: 2,
              bgcolor: '#76E3BC',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1a2744',
            }}
          >
            {!avatarPreview ? initials : null}
          </Avatar>

          <IconButton
            onClick={handleOpenAvatarUpload}
            aria-label="Alterar foto de perfil"
            size="small"
            sx={{
              position: 'absolute',
              bottom: 12,
              right: -4,
              width: 32,
              height: 32,
              bgcolor: '#101828',
              border: '2px solid #fff',
              '&:hover': { bgcolor: '#1A2744' },
            }}
          >
            <CameraAltRoundedIcon sx={{ color: '#fff', fontSize: 16 }} />
          </IconButton>
        </Box>

        <Typography
          variant="h5"
          sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: '1.5rem' }}
        >
          {user.name}
        </Typography>
      </Box>

      {/*
        Onda reintroduzida com técnica diferente da anterior, para não
        reintroduzir o seam:
        - Fica em FLUXO NORMAL (não absolute), então não depende de
          overflow:hidden nem de arredondamento de subpixel para recorte —
          não há nenhuma borda "no fio da navalha" para arredondar errado.
        - `mt` negativo sobrepõe a onda na base navy, sem precisar de clip.
        - fill="currentColor" + `color: 'background.default'` amarra a cor
          da onda exatamente ao valor real do tema, eliminando qualquer
          risco de mismatch entre uma cor hardcoded e o fundo da página.
      */}
      <Box
        component="svg"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        sx={{
          display: 'block',
          width: '100%',
          height: '90px',
          mt: '-46px',
          color: 'background.default',
        }}
      >
        <path d="M0,50 Q300,10 600,50 T1200,50 L1200,100 L0,100 Z" fill="currentColor" />
      </Box>

      <AvatarUploadDialog
        open={uploadOpen}
        value={avatarPreview}
        error={avatarError}
        onClose={handleCloseAvatarUpload}
        onChange={handleAvatarSelect}
      />

      <AvatarCropperDialog
        open={cropOpen}
        imageSrc={rawAvatarSrc}
        onClose={() => setCropOpen(false)}
        onConfirm={handleCropConfirm}
      />
    </Box>
  );
}