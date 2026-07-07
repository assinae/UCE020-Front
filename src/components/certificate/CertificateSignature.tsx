'use client';

import { useState, useRef, useCallback } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { ZoomIn, ZoomOut, Delete, OpenWith } from '@mui/icons-material';
import ImageUpload from '@/components/ui/inputs/ImageUpload';

interface SignaturePosition {
  x: number;
  y: number;
}

interface CertificateSignatureProps {
  certificateImageUrl?: string;
  onSignatureChange?: (signatureDataUrl: string | null, position: SignaturePosition) => void;
}

export function CertificateSignature({
  certificateImageUrl,
  onSignatureChange,
}: CertificateSignatureProps) {
  const [signatureFile, setSignatureFile] = useState<string | null>(null);
  const [signatureSize, setSignatureSize] = useState(120);
  const [position, setPosition] = useState<SignaturePosition>({ x: 50, y: 70 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleSignatureUpload = useCallback(
    (value: string | null) => {
      setSignatureFile(value);
      if (value) {
        setPosition({ x: 50, y: 70 });
        onSignatureChange?.(value, { x: 50, y: 70 });
      } else {
        setSignatureSize(120);
        setPosition({ x: 50, y: 70 });
        onSignatureChange?.(null, { x: 50, y: 70 });
      }
    },
    [onSignatureChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || !signatureFile) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const sigWidth = signatureSize;
    const sigHeight = signatureSize * 0.4;
    const sigLeft = (position.x / 100) * rect.width - sigWidth / 2;
    const sigTop = (position.y / 100) * rect.height - sigHeight / 2;

    setDragOffset({
      x: e.clientX - (rect.left + sigLeft + sigWidth / 2),
      y: e.clientY - (rect.top + sigTop + sigHeight / 2),
    });
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = ((e.clientX - dragOffset.x - rect.left) / rect.width) * 100;
      const newY = ((e.clientY - dragOffset.y - rect.top) / rect.height) * 100;
      const clampedX = Math.max(5, Math.min(95, newX));
      const clampedY = Math.max(5, Math.min(95, newY));
      const newPos = { x: clampedX, y: clampedY };
      setPosition(newPos);
      onSignatureChange?.(signatureFile, newPos);
    },
    [isDragging, dragOffset, signatureFile, onSignatureChange]
  );

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current || !signatureFile) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const sigWidth = signatureSize;
    const sigHeight = signatureSize * 0.4;
    const sigLeft = (position.x / 100) * rect.width - sigWidth / 2;
    const sigTop = (position.y / 100) * rect.height - sigHeight / 2;

    setDragOffset({
      x: touch.clientX - (rect.left + sigLeft + sigWidth / 2),
      y: touch.clientY - (rect.top + sigTop + sigHeight / 2),
    });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const newX = ((touch.clientX - dragOffset.x - rect.left) / rect.width) * 100;
    const newY = ((touch.clientY - dragOffset.y - rect.top) / rect.height) * 100;
    const clampedX = Math.max(5, Math.min(95, newX));
    const clampedY = Math.max(5, Math.min(95, newY));
    const newPos = { x: clampedX, y: clampedY };
    setPosition(newPos);
    onSignatureChange?.(signatureFile, newPos);
  };

  return (
    <Box>
      <Box
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          bgcolor: '#F5F5F5',
          border: '1px solid #E0E0E0',
          cursor: isDragging ? 'grabbing' : 'default',
          userSelect: 'none',
        }}
      >
        {certificateImageUrl ? (
          <Box
            component="img"
            src={certificateImageUrl}
            alt="Preview do certificado"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Preview do certificado
            </Typography>
          </Box>
        )}

        {signatureFile && (
          <Box
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            sx={{
              position: 'absolute',
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
              cursor: isDragging ? 'grabbing' : 'grab',
              width: signatureSize,
              zIndex: 10,
              '&:hover .sig-handle': { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={signatureFile}
              alt="Assinatura"
              sx={{
                width: '100%',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                pointerEvents: 'none',
              }}
            />
            <Box
              className="sig-handle"
              sx={{
                position: 'absolute',
                inset: -4,
                border: '2px dashed rgba(46, 196, 160, 0.8)',
                borderRadius: 1,
                opacity: 0,
                transition: 'opacity 0.2s',
                pointerEvents: 'none',
              }}
            />
            <Box
              className="sig-handle"
              sx={{
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: '#2EC4A0',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
                pointerEvents: 'none',
              }}
            >
              <OpenWith sx={{ fontSize: 12, color: '#fff' }} />
            </Box>
          </Box>
        )}

        {signatureFile && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'rgba(15, 29, 53, 0.75)',
              color: '#fff',
              px: 1.5,
              py: 0.5,
              borderRadius: 10,
              fontSize: '0.7rem',
              fontFamily: "'Poppins', sans-serif",
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(4px)',
              pointerEvents: 'none',
            }}
          >
            Arraste a assinatura para posicioná-la
          </Box>
        )}
      </Box>

      {signatureFile && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 1.5,
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Tamanho da assinatura
          </Typography>
          <Tooltip title="Diminuir">
            <span>
              <IconButton
                size="small"
                onClick={() => setSignatureSize((s) => Math.max(40, s - 10))}
                disabled={signatureSize <= 40}
              >
                <ZoomOut fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Typography
            variant="caption"
            sx={{ minWidth: 32, textAlign: 'center', fontFamily: "'Poppins', sans-serif" }}
          >
            {signatureSize}px
          </Typography>
          <Tooltip title="Aumentar">
            <span>
              <IconButton
                size="small"
                onClick={() => setSignatureSize((s) => Math.min(300, s + 10))}
                disabled={signatureSize >= 300}
              >
                <ZoomIn fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Remover assinatura">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleSignatureUpload(null)}
              sx={{ ml: 1 }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <ImageUpload
          value={signatureFile}
          onChange={handleSignatureUpload}
          label="Imagem da Assinatura"
        />
      </Box>
    </Box>
  );
}
