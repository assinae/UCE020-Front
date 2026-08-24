'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import {
  certificateService,
  CertificateVerificationError,
} from '@/services/certificate.service';
import { formatBahiaDateTime } from '@/utils/date';

// ── Design tokens (mesma identidade do login) ──────────────
const navy = '#13284D';
const navyDark = '#0D1E3B';
const green = '#059669';
const teal = '#6ED7B4';
const red = '#B22C29';
const gray50 = '#F8FAFC';
const gray200 = '#E2E8F0';
const gray500 = '#64748B';
const gray700 = '#334155';

interface CertificateVerifyViewProps {
  codigo: string;
}

function formatDateTime(value?: string | null) {
  if (!value) return null;
  return formatBahiaDateTime(value);
}

// ── Linha de detalhe (ícone + rótulo + valor) ──────────────
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: '10px',
          bgcolor: gray50,
          border: `1px solid ${gray200}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: green,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: gray500,
          }}
        >
          {label}
        </Typography>
        <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: navyDark, wordBreak: 'break-word' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export function CertificateVerifyView({ codigo }: CertificateVerifyViewProps) {
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['certificate-verify', codigo],
    queryFn: () => certificateService.verifyCertificate(codigo),
    enabled: Boolean(codigo),
    retry: false,
  });

  const isInvalid = isError && error instanceof CertificateVerificationError;
  const invalidMessage = isInvalid
    ? (error as CertificateVerificationError).message
    : 'Não foi possível conectar ao serviço de verificação. Tente novamente em instantes.';

  async function handleCopyHash() {
    if (!data?.data.hash) return;
    try {
      await navigator.clipboard.writeText(data.data.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard indisponível — ignora */
    }
  }

  const cert = data?.data;
  const assinadoEm = formatDateTime(cert?.assinadoEm);

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: `radial-gradient(1200px 600px at 50% -10%, rgba(110,215,180,0.12) 0%, transparent 60%), linear-gradient(180deg, ${navyDark} 0%, ${navy} 100%)`,
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      {/* Logo */}
      <Box sx={{ position: 'relative', width: 150, height: 48, mb: { xs: 3, sm: 4 } }}>
        <Image
          src="/images/logo-assinae.png"
          alt="Assinaê"
          fill
          style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          priority
        />
      </Box>

      {/* Card principal */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 460,
          bgcolor: '#fff',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(5, 15, 35, 0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Faixa de status */}
        <Box
          sx={{
            px: { xs: 3, sm: 4 },
            py: { xs: 3.5, sm: 4 },
            textAlign: 'center',
            background: isLoading
              ? gray50
              : cert
                ? `linear-gradient(180deg, rgba(5,150,105,0.10) 0%, rgba(255,255,255,0) 100%)`
                : `linear-gradient(180deg, rgba(178,44,41,0.08) 0%, rgba(255,255,255,0) 100%)`,
            borderBottom: `1px solid ${gray200}`,
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={40} sx={{ color: teal }} />
              <Typography sx={{ mt: 2, fontWeight: 700, color: navyDark, fontSize: 17 }}>
                Verificando certificado…
              </Typography>
              <Typography sx={{ mt: 0.5, color: gray500, fontSize: 13 }}>
                Consultando a autenticidade do código.
              </Typography>
            </>
          ) : cert ? (
            <>
              <Box
                sx={{
                  width: 76,
                  height: 76,
                  mx: 'auto',
                  borderRadius: '50%',
                  bgcolor: 'rgba(5,150,105,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VerifiedRoundedIcon sx={{ fontSize: 46, color: green }} />
              </Box>
              <Typography sx={{ mt: 2, fontWeight: 800, color: navyDark, fontSize: 20, letterSpacing: '-0.02em' }}>
                Certificado autêntico
              </Typography>
              <Typography sx={{ mt: 0.75, color: gray700, fontSize: 13.5, maxWidth: 320, mx: 'auto' }}>
                {data?.message}
              </Typography>
            </>
          ) : (
            <>
              <Box
                sx={{
                  width: 76,
                  height: 76,
                  mx: 'auto',
                  borderRadius: '50%',
                  bgcolor: 'rgba(178,44,41,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GppMaybeRoundedIcon sx={{ fontSize: 46, color: red }} />
              </Box>
              <Typography sx={{ mt: 2, fontWeight: 800, color: navyDark, fontSize: 20, letterSpacing: '-0.02em' }}>
                Certificado não confirmado
              </Typography>
              <Typography sx={{ mt: 0.75, color: gray700, fontSize: 13.5, maxWidth: 320, mx: 'auto' }}>
                {invalidMessage}
              </Typography>
            </>
          )}
        </Box>

        {/* Corpo */}
        <Box sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 3.5 } }}>
          {/* Código verificado (sempre visível) */}
          <Box sx={{ mb: cert ? 3 : 0 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: gray500,
                mb: 0.5,
              }}
            >
              Código de verificação
            </Typography>
            <Typography
              sx={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 16,
                fontWeight: 700,
                color: navyDark,
                letterSpacing: '0.04em',
              }}
            >
              {codigo}
            </Typography>
          </Box>

          {cert && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DetailRow
                icon={<PersonOutlineRoundedIcon sx={{ fontSize: 20 }} />}
                label="Titular"
                value={cert.titular.trim()}
              />
              <DetailRow
                icon={<EventOutlinedIcon sx={{ fontSize: 20 }} />}
                label="Referente a"
                value={cert.referente}
              />
              <DetailRow
                icon={<CategoryOutlinedIcon sx={{ fontSize: 20 }} />}
                label="Tipo"
                value={cert.tipo.charAt(0).toUpperCase() + cert.tipo.slice(1)}
              />
              <DetailRow
                icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />}
                label="Emitido em"
                value={formatDateTime(cert.emitidoEm) ?? '—'}
              />
              {assinadoEm && (
                <DetailRow
                  icon={<DrawOutlinedIcon sx={{ fontSize: 20 }} />}
                  label="Assinado digitalmente"
                  value={`${assinadoEm} · por ${cert.assinadoPor.trim()}`}
                />
              )}

              <Divider sx={{ my: 0.5, borderColor: gray200 }} />

              {/* Hash */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: gray500,
                    }}
                  >
                    Hash do documento
                  </Typography>
                  <Tooltip title={copied ? 'Copiado!' : 'Copiar hash'} placement="left">
                    <IconButton
                      onClick={handleCopyHash}
                      size="small"
                      sx={{ color: copied ? green : gray500, p: 0.5 }}
                    >
                      {copied ? (
                        <CheckRoundedIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    bgcolor: gray50,
                    border: `1px solid ${gray200}`,
                    borderRadius: '10px',
                    px: 1.5,
                    py: 1.25,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: 12,
                      color: gray700,
                      wordBreak: 'break-all',
                      lineHeight: 1.6,
                    }}
                  >
                    {cert.hash}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Rodapé */}
      <Typography sx={{ mt: 4, color: 'rgba(255,255,255,0.5)', fontSize: 12.5, textAlign: 'center' }}>
        Verificação de autenticidade · Assinaê · UEFS
      </Typography>
    </Box>
  );
}
