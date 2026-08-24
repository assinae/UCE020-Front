'use client';

import { Box, Typography, IconButton, Dialog, DialogContent, DialogActions, Slider } from '@mui/material';
import { useRef, useState, useCallback } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import { Button } from '@/components/ui/Button';

const CROP_SIZE = 260; // diâmetro do círculo de recorte exibido em tela (px)
const OUTPUT_SIZE = 480; // resolução final da imagem exportada (px)
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

interface Point {
  x: number;
  y: number;
}

interface AvatarCropperDialogProps {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onConfirm: (blob: Blob) => void;
}

export function AvatarCropperDialog({ open, imageSrc, onClose, onConfirm }: AvatarCropperDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{ dragging: boolean; start: Point; origin: Point }>({
    dragging: false,
    start: { x: 0, y: 0 },
    origin: { x: 0, y: 0 },
  });

  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  // Escala "cover": menor escala que garante que a imagem cubra todo o círculo
  const baseScale =
    imgLoaded && naturalSize.width && naturalSize.height
      ? Math.max(CROP_SIZE / naturalSize.width, CROP_SIZE / naturalSize.height)
      : 1;
  const currentScale = baseScale * zoom;

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

  const handleImageLoad = () => {
    if (!imgRef.current) return;
    setNaturalSize({
      width: imgRef.current.naturalWidth,
      height: imgRef.current.naturalHeight,
    });
    setOffset({ x: 0, y: 0 });
    setImgLoaded(true);
  };

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

  const resetAndClose = () => {
    setImgLoaded(false);
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
    onClose();
  };

  const handleConfirm = () => {
    if (!imgRef.current || !naturalSize.width) return;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      onConfirm(blob);
      resetAndClose();
    }, 'image/jpeg', 0.9);
  };

  return (
    <Dialog
      open={open}
      onClose={resetAndClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: '20px' } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5 }}>
        <Typography sx={{ fontWeight: 700, color: '#0D1E3B', fontSize: '1.05rem' }}>
          Ajustar foto
        </Typography>
        <IconButton size="small" onClick={resetAndClose} aria-label="Fechar">
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
          {imageSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={imageSrc}
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
        <Button variant="outlined" color="secondary" onClick={resetAndClose}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleConfirm} disabled={!imgLoaded}>
          Salvar foto
        </Button>
      </DialogActions>
    </Dialog>
  );
}