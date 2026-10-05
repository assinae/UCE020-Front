'use client';

import { Box, ButtonBase, CircularProgress, alpha } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { CloseButton, ModalContainer } from '@/components/modals';
import { colorTokens } from '@/lib/colors';
import type { Event } from '@/types/event';
import { formatBahiaDate } from '@/utils/date';

const WHITE = colorTokens.neutral.white;
const MINT = colorTokens.brand.primary;

const STATUS: Record<string, { label: string; live: boolean }> = {
  pendente: { label: 'Pendente', live: false },
  iniciada: { label: 'Iniciada', live: true },
  andamento: { label: 'Em andamento', live: true },
  finalizada: { label: 'Finalizada', live: false },
};

function formatPeriod(start: string, end: string): string {
  const startLabel = formatBahiaDate(start);
  const endLabel = formatBahiaDate(end);
  if (startLabel === endLabel) return endLabel;
  return `${startLabel.slice(0, 5)} a ${endLabel}`;
}

const REVEAL_STEP_S = 0.05;

// O painel já entra com movimento; o conteúdo só revela em sequência curta.
function reveal(step: number) {
  return {
    className: 'animate-fade-up motion-reduce:animate-none',
    style: { animationDelay: `${0.12 + step * REVEAL_STEP_S}s`, animationDuration: '0.4s' },
  };
}

function plural(value: number, singular: string, pluralLabel: string): string {
  return `${value} ${value === 1 ? singular : pluralLabel}`;
}

interface EventFoundModalProps {
  event: Event;
  open: boolean;
  subscribing: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onSubscribe: () => void;
}

export function EventFoundModal({
  event,
  open,
  subscribing,
  onClose,
  onViewDetails,
  onSubscribe,
}: EventFoundModalProps) {
  const statusKey = (event.status ?? '').trim().toLowerCase();
  const status = STATUS[statusKey] ?? { label: event.status, live: false };
  // O back recusa inscrição em evento finalizado; o botão já avisa em vez de falhar.
  const isFinalized = statusKey === 'finalizada';
  const subscribers = event.totalInscritos ?? 0;

  const info = [
    { label: 'Data', value: formatPeriod(event.dataInicio, event.dataFim) },
    { label: 'Local', value: event.localizacao },
    { label: 'Carga horária', value: plural(event.cargaHoraria, 'hora', 'horas') },
    { label: 'Inscritos', value: plural(subscribers, 'inscrito', 'inscritos'), muted: true },
  ].filter((item) => item.value);

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-container': { alignItems: { xs: 'flex-end', md: 'center' } },
        '& .MuiBackdrop-root': {
          bgcolor: alpha(colorTokens.shadow.overlay, 0.5),
          backdropFilter: 'blur(2px)',
        },
      }}
      paperClassName="max-mui:animate-sheet-in mui:animate-card-in motion-reduce:animate-none"
      paperSx={{
        position: 'relative',
        // O MUI foca o próprio painel ao abrir; sem isso o navegador desenha o
        // anel de foco em volta do modal inteiro quando a busca vem do teclado.
        outline: 'none',
        m: { xs: 0, md: 2.5 },
        maxWidth: { xs: '100%', md: 520 },
        maxHeight: '92vh',
        overflow: 'hidden auto',
        borderRadius: { xs: '28px 28px 0 0', md: '30px' },
        background: colorTokens.navigation.sheetGradient,
        boxShadow: `0 24px 60px ${alpha(colorTokens.shadow.overlay, 0.44)}`,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -80,
          right: -60,
          width: 190,
          height: 190,
          borderRadius: '999px',
          bgcolor: alpha(colorTokens.brand.mint, 0.13),
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          p: '22px 24px 24px',
          pb: { xs: 'calc(24px + env(safe-area-inset-bottom))', md: 3 },
        }}
      >
        <Box
          {...reveal(0)}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: MINT,
            }}
          >
            <SearchRoundedIcon sx={{ fontSize: 14 }} />
            Encontrado · {event.codigo}
          </Box>
          <CloseButton
            onClick={onClose}
            position="relative"
            top={-5}
            right={-5}
            sx={{
              width: 32,
              height: 32,
              color: alpha(WHITE, 0.72),
              '&:hover': { bgcolor: alpha(WHITE, 0.14), color: WHITE },
            }}
          />
        </Box>

        <Box
          component="h2"
          {...reveal(1)}
          sx={{
            m: '12px 0 0',
            fontSize: 22,
            lineHeight: 1.2,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: WHITE,
            textWrap: 'pretty',
          }}
        >
          {event.nome}
        </Box>

        {event.descricao && (
          <Box
            component="p"
            {...reveal(2)}
            sx={{
              m: '8px 0 0',
              fontSize: 13.5,
              lineHeight: 1.6,
              color: alpha(WHITE, 0.78),
              textWrap: 'pretty',
              whiteSpace: 'pre-line',
            }}
          >
            {event.descricao}
          </Box>
        )}

        <Box
          component="span"
          {...reveal(3)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            mt: 1.75,
            fontSize: 12.5,
            fontWeight: 700,
            color: status.live ? MINT : alpha(WHITE, 0.72),
          }}
        >
          <Box sx={{ width: 7, height: 7, borderRadius: '999px', bgcolor: 'currentColor' }} />
          {status.label}
        </Box>

        <Box component="dl" sx={{ m: 0, mt: '18px' }}>
          {info.map((item, index) => (
            <Box
              key={item.label}
              {...reveal(4 + index)}
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 1.75,
                mt: index === 0 ? 0 : '11px',
                pt: index === 0 ? '14px' : '11px',
                borderTop: `1px solid ${alpha(WHITE, 0.14)}`,
              }}
            >
              <Box
                component="dt"
                sx={{ fontSize: 12.5, fontWeight: 700, color: alpha(WHITE, 0.6) }}
              >
                {item.label}
              </Box>
              <Box
                component="dd"
                sx={{
                  m: 0,
                  minWidth: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: 'right',
                  textWrap: 'pretty',
                  color: item.muted ? alpha(WHITE, 0.68) : WHITE,
                }}
              >
                {item.value}
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          {...reveal(4 + info.length)}
          sx={{
            display: 'flex',
            flexWrap: { xs: 'wrap-reverse', md: 'nowrap' },
            gap: 1.25,
            mt: '22px',
          }}
        >
          <ButtonBase
            onClick={onViewDetails}
            sx={{
              flex: { xs: '1 1 100%', md: 1 },
              py: 1.75,
              px: 2.25,
              border: `1.5px solid ${alpha(WHITE, 0.24)}`,
              borderRadius: '999px',
              color: WHITE,
              fontSize: 14,
              fontWeight: 700,
              transition: 'background .18s ease, border-color .18s ease',
              '&:hover': { bgcolor: alpha(WHITE, 0.1), borderColor: alpha(WHITE, 0.4) },
            }}
          >
            Ver detalhes
          </ButtonBase>
          <ButtonBase
            onClick={onSubscribe}
            disabled={subscribing || isFinalized}
            aria-busy={subscribing}
            sx={{
              flex: { xs: '1 1 100%', md: 1 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: 1.75,
              px: 2.25,
              borderRadius: '999px',
              bgcolor: MINT,
              color: colorTokens.navigation.default,
              fontSize: 14,
              fontWeight: 800,
              transition: 'background .18s ease, opacity .18s ease',
              '&:hover': { bgcolor: colorTokens.brand.primaryDark },
              '&.Mui-disabled': { opacity: isFinalized ? 0.5 : 0.85 },
            }}
          >
            {subscribing && <CircularProgress size={16} thickness={5} sx={{ color: 'inherit' }} />}
            {isFinalized
              ? 'Inscrições encerradas'
              : subscribing
                ? 'Inscrevendo...'
                : 'Inscrever-se'}
          </ButtonBase>
        </Box>
      </Box>
    </ModalContainer>
  );
}
