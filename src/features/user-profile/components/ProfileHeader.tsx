'use client';

import { Avatar, Box, ButtonBase, CircularProgress, alpha } from '@mui/material';
import { useEffect, useState, type ReactNode } from 'react';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { SkeletonBone } from '@/components/ui';
import { colorTokens } from '@/lib/colors';
import type { UserProfile } from '@/types/userProfile';
import { AvatarUploadDialog } from './AvatarUploadDialog';
import { AvatarCropperDialog } from './AvatarCropperDialog';

const WHITE = colorTokens.neutral.white;
const AVATAR_SIZE = 112;

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

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function HeaderShell({ children }: { children: ReactNode }) {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: colorTokens.navigation.gradient,
        pt: { xs: 4.5, md: 5.5 },
        px: 3,
      }}
    >
      <Box
        aria-hidden
        className="animate-orb-float motion-reduce:animate-none"
        sx={{
          position: 'absolute',
          top: -40,
          left: '8%',
          width: 240,
          height: 240,
          borderRadius: '999px',
          background: `radial-gradient(circle, ${alpha(colorTokens.brand.secondaryLight, 0.2)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        className="animate-orb-float motion-reduce:animate-none"
        style={{ animationDuration: '11s' }}
        sx={{
          position: 'absolute',
          top: 20,
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '999px',
          background: `radial-gradient(circle, ${alpha(colorTokens.brand.mint, 0.14)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          maxWidth: 1180,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          textAlign: 'center',
        }}
      >
        {children}
      </Box>

      <Box
        component="svg"
        aria-hidden
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="animate-wave-in motion-reduce:animate-none"
        sx={{
          position: 'relative',
          display: 'block',
          width: 'calc(100% + 48px)',
          height: { xs: 64, md: 110 },
          mx: -3,
          mt: 3.5,
          transformOrigin: 'bottom',
          color: colorTokens.surface.app,
        }}
      >
        <path fill="currentColor" d="M0,0 C420,150 1020,150 1440,0 L1440,140 L0,140 Z" />
      </Box>
    </Box>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <HeaderShell>
      <SkeletonBone dark sx={{ width: AVATAR_SIZE, height: AVATAR_SIZE }} />
      <SkeletonBone dark sx={{ width: 220, height: 30, mt: 0.5 }} />
      <SkeletonBone dark sx={{ width: 180, height: 16 }} />
    </HeaderShell>
  );
}

interface ProfileHeaderProps {
  user: UserProfile;
  /** Devolve `false` quando o envio falha, para o cabeçalho voltar à foto anterior. */
  onAvatarChange: (file: File) => Promise<boolean>;
}

export function ProfileHeader({ user, onAvatarChange }: ProfileHeaderProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl ?? null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [rawAvatarSrc, setRawAvatarSrc] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleCropConfirm = async (blob: Blob) => {
    const previous = avatarPreview;
    setAvatarPreview(URL.createObjectURL(blob));
    setUploading(true);

    const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: 'image/jpeg' });
    const saved = await onAvatarChange(file);
    setUploading(false);
    if (!saved) setAvatarPreview(previous);
  };

  return (
    <HeaderShell>
      <Box
        className="animate-card-in motion-reduce:animate-none"
        sx={{ position: 'relative', width: AVATAR_SIZE, height: AVATAR_SIZE }}
      >
        <Avatar
          alt={user.name}
          src={avatarPreview ?? undefined}
          sx={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            border: `4px solid ${alpha(WHITE, 0.3)}`,
            bgcolor: colorTokens.brand.primary,
            color: colorTokens.navigation.deep,
            fontSize: 40,
            fontWeight: 800,
          }}
        >
          {getInitials(user.name)}
        </Avatar>

        {uploading && (
          <Box
            role="status"
            aria-label="Enviando foto"
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '999px',
              bgcolor: alpha(colorTokens.shadow.overlay, 0.45),
            }}
          >
            <CircularProgress size={28} thickness={5} sx={{ color: WHITE }} />
          </Box>
        )}

        <ButtonBase
          onClick={handleOpenAvatarUpload}
          disabled={uploading}
          aria-label="Alterar foto"
          sx={{
            position: 'absolute',
            bottom: 2,
            right: -2,
            width: 36,
            height: 36,
            borderRadius: '999px',
            border: `2px solid ${WHITE}`,
            bgcolor: colorTokens.shadow.navy,
            color: WHITE,
            transition: 'transform .28s cubic-bezier(.34,1.2,.64,1), background .18s ease',
            '&:hover': { bgcolor: colorTokens.navigation.hover, transform: 'scale(1.08)' },
          }}
        >
          <PhotoCameraOutlinedIcon sx={{ fontSize: 17 }} />
        </ButtonBase>
      </Box>

      <Box
        component="h1"
        className="animate-fade-up motion-reduce:animate-none"
        style={{ animationDelay: '0.08s' }}
        sx={{
          m: 0,
          mt: 0.5,
          fontSize: { xs: 24, md: 28 },
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          color: WHITE,
          overflowWrap: 'anywhere',
        }}
      >
        {user.name}
      </Box>
      <Box
        component="span"
        className="animate-fade-up motion-reduce:animate-none"
        style={{ animationDelay: '0.14s' }}
        sx={{
          fontSize: 13.5,
          fontWeight: 500,
          color: alpha(WHITE, 0.7),
          overflowWrap: 'anywhere',
        }}
      >
        {user.email}
      </Box>

      <AvatarUploadDialog
        open={uploadOpen}
        value={null}
        error={avatarError}
        onClose={handleCloseAvatarUpload}
        onChange={handleAvatarSelect}
      />

      <AvatarCropperDialog
        open={cropOpen}
        imageSrc={rawAvatarSrc}
        onClose={() => setCropOpen(false)}
        onConfirm={(blob) => void handleCropConfirm(blob)}
      />
    </HeaderShell>
  );
}
