'use client';

import { Box, Avatar, Typography, IconButton, Dialog, DialogContent, DialogActions, Slider } from '@mui/material';
import { useRef, useState, useEffect, useCallback } from 'react';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import { Button } from '@/components/ui/Button';
import type { UserProfile } from '@/types/userProfile';

const MAX_AVATAR_SIZE_MB = 3;
const MAX_AVATAR_SIZE_BYTES = MAX_AVATAR_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const CROP_SIZE = 260; // diâmetro do círculo de recorte exibido em tela (px)
const OUTPUT_SIZE = 480; // resolução final da imagem exportada (px)
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

interface ProfileHeaderProps {
  user: UserProfile;
  onAvatarChange?: (file: File) => void;
}

interface Point {
  x: number;
  y: number;
}

export function ProfileHeader({ user, onAvatarChange }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{ dragging: boolean; start: Point; origin: Point }>({
    dragging: false,
    start: { x: 0, y: 0 },
    origin: { x: 0, y: 0 },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Editor de posicionamento da foto ──────────────────────
  const [cropOpen, setCropOpen] = useState(false);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    return () => {
      if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
    };
  }, [rawImageUrl]);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleAvatarClick = () => fileInputRef.current?.click();

  // Escala "cover": menor escala que garante que a imagem cubra todo o círculo
  const baseScale =
    imgLoaded && naturalSize.width && naturalSize.height
      ? Math.max(CROP_SIZE / naturalSize.width, CROP_SIZE / naturalSize.height)
      : 1;
  const currentScale = baseScale * zoom;

  // Impede que a imagem se desloque para além das bordas do círculo
  const clampOffset = useCallback(
    (next: Point, scale: number): Point => {
      const scaledW = naturalSize.width * scale;
      const scaledH = naturalSize.height * scale;
      const maxX = Math.max(0, (scaledW - CROP_SIZE) / 2);
      const maxY = Math.max(0, (scaledH - CROP_SIZE) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, next.x)),
        y: Math.min(maxY, Math.max(-maxY, next.y)),
      };
    },
    [naturalSize]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Formato inválido. Use JPG, PNG ou WEBP.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setError(`A imagem deve ter no máximo ${MAX_AVATAR_SIZE_MB}MB.`);
      e.target.value = '';
      return;
    }

    setError(null);
    if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
    setImgLoaded(false);
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
    setRawImageUrl(URL.createObjectURL(file));
    setCropOpen(true);
    e.target.value = '';
  };

  const handleImageLoad = () => {
    if (!imgRef.current) return;
    setNaturalSize({
      width: imgRef.current.naturalWidth,
      height: imgRef.current.naturalHeight,
    });
    setOffset({ x: 0, y: 0 });
    setImgLoaded(true);
  };

  // ── Arraste (mouse e toque) para reposicionar a imagem ──────
  const getPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    if ('touches' in e) {
      const t = e.touches[0] ?? e.changedTouches[0];
      return { x: t.clientX, y: t.clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragState.current = { dragging: true, start: getPoint(e), origin: offset };
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragState.current.dragging) return;
    const point = getPoint(e);
    const dx = point.x - dragState.current.start.x;
    const dy = point.y - dragState.current.start.y;
    setOffset(
      clampOffset(
        { x: dragState.current.origin.x + dx, y: dragState.current.origin.y + dy },
        currentScale
      )
    );
  };

  const handleDragEnd = () => {
    dragState.current.dragging = false;
  };

  const handleZoomChange = (_: Event, value: number | number[]) => {
    const nextZoom = Array.isArray(value) ? value[0] : value;
    setZoom(nextZoom);
    setOffset((prev) => clampOffset(prev, baseScale * nextZoom));
  };

  const handleCancelCrop = () => {
    setCropOpen(false);
    if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
    setRawImageUrl(null);
  };

  const handleConfirmCrop = () => {
    if (!imgRef.current || !naturalSize.width) return;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Converte da escala de tela (CROP_SIZE) para a resolução final (OUTPUT_SIZE)
    const factor = OUTPUT_SIZE / CROP_SIZE;
    const drawScale = currentScale * factor;
    const drawW = naturalSize.width * drawScale;
    const drawH = naturalSize.height * drawScale;
    const drawX = OUTPUT_SIZE / 2 - drawW / 2 + offset.x * factor;
    const drawY = OUTPUT_SIZE / 2 - drawH / 2 + offset.y * factor;

    ctx.save();
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgRef.current, drawX, drawY, drawW, drawH);
    ctx.restore();

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `avatar-${Date.now()}.png`, { type: 'image/png' });

      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(blob));
      onAvatarChange?.(file);

      setCropOpen(false);
      if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
      setRawImageUrl(null);
    }, 'image/png');
  };

  return (
    <Box
      sx={{
        background: '#0F1D35',
        position: 'relative',
        pb: 4,
        pt: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            alt={user.name}
            src={preview || user.avatarUrl || undefined}
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
            {!preview && !user.avatarUrl ? initials : null}
          </Avatar>

          <IconButton
            onClick={handleAvatarClick}
            aria-label="Alterar foto de perfil"
            sx={{
              position: 'absolute',
              bottom: 16,
              right: -4,
              width: 32,
              height: 32,
              bgcolor: '#101828',
              border: '2px solid #0F1D35',
              '&:hover': { bgcolor: '#1A2744' },
            }}
          >
            <CameraAltRoundedIcon sx={{ color: '#fff', fontSize: 16 }} />
          </IconButton>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            hidden
            onChange={handleFileChange}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: '1.5rem' }}
        >
          {user.name}
        </Typography>

        {error && (
          <Typography
            variant="caption"
            sx={{ color: '#FF8A8A', mt: 1, textAlign: 'center', maxWidth: 260 }}
          >
            {error}
          </Typography>
        )}
      </Box>

      {/* ── Modal de ajuste da foto de perfil ── */}
      <Dialog
        open={cropOpen}
        onClose={handleCancelCrop}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '20px' } } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5 }}>
          <Typography sx={{ fontWeight: 700, color: '#0D1E3B', fontSize: '1.05rem' }}>
            Ajustar foto
          </Typography>
          <IconButton size="small" onClick={handleCancelCrop} aria-label="Fechar">
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(15, 29, 53, 0.6)', mb: 2, textAlign: 'center' }}>
            Arraste a imagem para posicioná-la e use o controle abaixo para dar zoom.
          </Typography>

          <Box
            sx={{
              width: CROP_SIZE,
              height: CROP_SIZE,
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              bgcolor: '#0F1D35',
              cursor: 'grab',
              touchAction: 'none',
              boxShadow: '0 0 0 4px rgba(15, 29, 53, 0.06)',
              '&:active': { cursor: 'grabbing' },
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {rawImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={rawImageUrl}
                alt="Pré-visualização para ajuste da foto"
                onLoad={handleImageLoad}
                draggable={false}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: naturalSize.width * currentScale || undefined,
                  height: naturalSize.height * currentScale || undefined,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  opacity: imgLoaded ? 1 : 0,
                  transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>

          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1.5, px: 0.5, mt: 3 }}>
            <ZoomOutRoundedIcon sx={{ fontSize: 18, color: 'rgba(15, 29, 53, 0.4)' }} />
            <Slider
              value={zoom}
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              onChange={handleZoomChange}
              aria-label="Zoom da foto"
              disabled={!imgLoaded}
              sx={{ color: '#101828' }}
            />
            <ZoomInRoundedIcon sx={{ fontSize: 18, color: 'rgba(15, 29, 53, 0.4)' }} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancelCrop}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirmCrop} disabled={!imgLoaded}>
            Salvar foto
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}