'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import jsQR from 'jsqr';
import { colorTokens } from '@/lib/colors';

interface QrCodeScannerProps {
  onResult?: (value: string) => void;
  scanKey?: number;
  paused?: boolean;
}

type ScannerStatus = 'loading' | 'ready' | 'error' | 'success';

const SCAN_INTERVAL_MS = 250;
const SUCCESS_FEEDBACK_MS = 1000;
const DUPLICATE_SCAN_WINDOW_MS = 2000;
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

  const [status, setStatus] = useState<ScannerStatus>('loading');
  const [message, setMessage] = useState('Inicializando câmera...');

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    lastScannedRef.current = null;
  }, [scanKey]);

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

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

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
            display: isLoading || hasError ? 'none' : 'block',
          }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {!isLoading && !hasError && (
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
