'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, IconButton, Slider, Typography } from '@mui/material';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import jsQR from 'jsqr';
import { colorTokens } from '@/lib/colors';

interface QrCodeScannerProps {
  onResult?: (value: string) => void;
  scanKey?: number;
  paused?: boolean;
}

type ScannerStatus = 'loading' | 'ready' | 'error' | 'success';

/**
 * `hardware` é o zoom da própria câmera (Android), que aproxima de verdade e
 * mantém a nitidez. Onde ele não existe (iOS, webcams), o recorte digital
 * aproxima o centro do quadro — ajuda a enquadrar e a ler QR pequeno de longe,
 * porque o jsQR passa a analisar só a área recortada.
 */
type ZoomMode = 'hardware' | 'digital';

interface ZoomRange {
  min: number;
  max: number;
  step: number;
}

type ZoomCapabilities = MediaTrackCapabilities & { zoom?: ZoomRange };
type ZoomSettings = MediaTrackSettings & { zoom?: number };
type ZoomConstraints = MediaTrackConstraints & { advanced?: { zoom: number }[] };

const SCAN_INTERVAL_MS = 250;
const SUCCESS_FEEDBACK_MS = 1000;
const DUPLICATE_SCAN_WINDOW_MS = 2000;
const DIGITAL_ZOOM_RANGE: ZoomRange = { min: 1, max: 4, step: 0.1 };
const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: 'environment',
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};

function stopCamera(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function readZoomRange(track: MediaStreamTrack): ZoomRange | null {
  const capabilities = track.getCapabilities?.() as ZoomCapabilities | undefined;
  const zoom = capabilities?.zoom;

  // `max <= min` aparece em câmeras que anunciam o recurso mas não zoomam.
  if (!zoom || typeof zoom.max !== 'number' || zoom.max <= zoom.min) return null;

  return { min: zoom.min, max: zoom.max, step: zoom.step || 0.1 };
}

export function QrCodeScanner({
  onResult,
  scanKey = 0,
  paused = false,
}: QrCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<number | null>(null);
  const successTimerRef = useRef<number | null>(null);
  const lastScannedRef = useRef<{ value: string; timestamp: number } | null>(null);
  const onResultRef = useRef(onResult);
  const pausedRef = useRef(paused);
  // O laço de leitura é criado uma vez só; o recorte vem por ref para não
  // religar a câmera a cada passo do slider.
  const digitalZoomRef = useRef(1);

  const [status, setStatus] = useState<ScannerStatus>('loading');
  const [message, setMessage] = useState('Inicializando câmera...');
  const [zoomMode, setZoomMode] = useState<ZoomMode>('digital');
  const [zoomRange, setZoomRange] = useState<ZoomRange>(DIGITAL_ZOOM_RANGE);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    lastScannedRef.current = null;
  }, [scanKey]);

  const applyZoom = useCallback(
    (value: number) => {
      setZoom(value);

      if (zoomMode === 'digital') {
        digitalZoomRef.current = value;
        return;
      }

      const [track] = streamRef.current?.getVideoTracks() ?? [];
      // Alguns aparelhos recusam o valor exato; perder o zoom não pode derrubar
      // a leitura, então a falha fica só no console.
      void track
        ?.applyConstraints({ advanced: [{ zoom: value }] } as ZoomConstraints)
        .catch(() => undefined);
    },
    [zoomMode],
  );

  const stepZoom = useCallback(
    (direction: 1 | -1) => {
      const next = zoom + direction * zoomRange.step * 4;
      applyZoom(Math.min(zoomRange.max, Math.max(zoomRange.min, Number(next.toFixed(2)))));
    },
    [applyZoom, zoom, zoomRange],
  );

  useEffect(() => {
    let mounted = true;

    function clearTimers() {
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    }

    function scheduleNextScan() {
      scanTimerRef.current = window.setTimeout(scanFrame, SCAN_INTERVAL_MS);
    }

    function handleDetectedCode(value: string) {
      const now = Date.now();
      const lastScan = lastScannedRef.current;
      const isDuplicate =
        lastScan?.value === value && now - lastScan.timestamp < DUPLICATE_SCAN_WINDOW_MS;

      if (isDuplicate) return;

      lastScannedRef.current = { value, timestamp: now };
      setStatus('success');
      onResultRef.current?.(value);

      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
      successTimerRef.current = window.setTimeout(() => {
        if (mounted) setStatus('ready');
      }, SUCCESS_FEEDBACK_MS);
    }

    function scanFrame() {
      if (!mounted) return;

      if (pausedRef.current) {
        scheduleNextScan();
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !video.videoWidth) {
        scheduleNextScan();
        return;
      }

      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        scheduleNextScan();
        return;
      }

      // No zoom digital, lê só o pedaço central que está sendo mostrado — assim
      // o que o usuário enquadra é exatamente o que o leitor analisa.
      const factor = digitalZoomRef.current;
      const sourceWidth = video.videoWidth / factor;
      const sourceHeight = video.videoHeight / factor;
      const sourceX = (video.videoWidth - sourceWidth) / 2;
      const sourceY = (video.videoHeight - sourceHeight) / 2;

      canvas.width = Math.round(sourceWidth);
      canvas.height = Math.round(sourceHeight);
      context.drawImage(
        video,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code?.data) {
        handleDetectedCode(code.data);
      }

      scheduleNextScan();
    }

    async function initScanner() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('error');
        setMessage('Seu navegador não suporta câmera');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);

        if (!mounted || !videoRef.current) {
          stopCamera(stream);
          return;
        }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const [track] = stream.getVideoTracks();
        const hardwareRange = track ? readZoomRange(track) : null;

        if (hardwareRange) {
          const current = (track.getSettings() as ZoomSettings).zoom ?? hardwareRange.min;
          setZoomMode('hardware');
          setZoomRange(hardwareRange);
          setZoom(current);
        } else {
          setZoomMode('digital');
          setZoomRange(DIGITAL_ZOOM_RANGE);
          setZoom(1);
          digitalZoomRef.current = 1;
        }

        setStatus('ready');
        setMessage('Aponte a câmera para o QR Code');
        scanFrame();
      } catch {
        setStatus('error');
        setMessage('Permita o acesso à câmera e recarregue a página');
      }
    }

    void initScanner();

    return () => {
      mounted = false;
      clearTimers();
      stopCamera(streamRef.current);
      streamRef.current = null;
    };
  }, []);

  const isLoading = status === 'loading';
  const hasError = status === 'error';
  const isSuccess = status === 'success';
  const showCamera = !isLoading && !hasError;
  const isAtMin = zoom <= zoomRange.min + 0.001;
  const isAtMax = zoom >= zoomRange.max - 0.001;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 380,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: colorTokens.surface.background,
          border: `2px solid ${isSuccess ? colorTokens.status.success : colorTokens.neutral.border}`,
          position: 'relative',
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: showCamera ? 'block' : 'none',
            // No modo hardware quem aproxima é a câmera; aqui a imagem já chega ampliada.
            transform: zoomMode === 'digital' ? `scale(${zoom})` : undefined,
            transformOrigin: 'center',
          }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {showCamera && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: '70%',
                aspectRatio: '1',
                border: `2px solid ${isSuccess ? colorTokens.status.success : colorTokens.neutral.border}`,
                borderRadius: 2,
                opacity: isSuccess ? 0.9 : 0.3,
              }}
            />

            {isSuccess && (
              <CheckCircleRoundedIcon
                sx={{
                  position: 'absolute',
                  fontSize: 64,
                  color: colorTokens.status.success,
                }}
              />
            )}
          </Box>
        )}

        {showCamera && (
          <Box
            sx={{
              position: 'absolute',
              left: 12,
              right: 12,
              bottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1,
              py: 0.5,
              borderRadius: 99,
              bgcolor: 'rgba(13, 30, 59, 0.55)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <IconButton
              size="small"
              aria-label="Diminuir zoom"
              disabled={isAtMin}
              onClick={() => stepZoom(-1)}
              sx={{ color: colorTokens.neutral.white, '&.Mui-disabled': { opacity: 0.35 } }}
            >
              <ZoomOutRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <Slider
              size="small"
              aria-label="Zoom da câmera"
              value={zoom}
              min={zoomRange.min}
              max={zoomRange.max}
              step={zoomRange.step}
              onChange={(_, value) => applyZoom(Array.isArray(value) ? value[0] : value)}
              sx={{
                mx: 0.5,
                color: colorTokens.brand.primary,
                '& .MuiSlider-rail': { opacity: 0.4, bgcolor: colorTokens.neutral.white },
                // Alvo de toque maior que o traço fino do slider.
                '& .MuiSlider-thumb': { width: 16, height: 16 },
              }}
            />

            <IconButton
              size="small"
              aria-label="Aumentar zoom"
              disabled={isAtMax}
              onClick={() => stepZoom(1)}
              sx={{ color: colorTokens.neutral.white, '&.Mui-disabled': { opacity: 0.35 } }}
            >
              <ZoomInRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        )}

        {(isLoading || hasError) && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isLoading && <CircularProgress color="secondary" size={32} />}
            {hasError && (
              <QrCodeScannerRoundedIcon sx={{ fontSize: 48, color: colorTokens.neutral.gray500 }} />
            )}
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          fontSize: 14,
          color: isSuccess ? colorTokens.status.success : colorTokens.text.primary,
          textAlign: 'center',
          fontWeight: isSuccess ? 700 : 400,
        }}
      >
        {isSuccess ? 'QR Code detectado' : message}
      </Typography>
    </Box>
  );
}
