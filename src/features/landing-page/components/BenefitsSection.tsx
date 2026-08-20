'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import { Box, Typography, Container, IconButton } from '@mui/material';

import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { colorTokens } from '@/lib/colors';

const cards = [
  {
    icon: AccessTimeRoundedIcon,
    title: 'Economize Tempo',
    description:
      'Valide presença e emita certificados em poucos cliques.',
    color: '#6ED7B4',
  },
  {
    icon: SchoolRoundedIcon,
    title: 'Eventos Universitários',
    description:
      'Criado especialmente para instituições e projetos acadêmicos.',
    color: '#43A68D',
  },
  {
    icon: CheckCircleRoundedIcon,
    title: 'Fácil e Intuitivo',
    description:
      'Interface simples para organizadores e participantes.',
    color: '#6ED7B4',
  },
  {
    icon: QrCode2RoundedIcon,
    title: 'Check-in com QR Code',
    description:
      'Confirme presença rapidamente utilizando QR Code.',
    color: '#43A68D',
  },
  {
    icon: WorkspacePremiumRoundedIcon,
    title: 'Certificados Automáticos',
    description:
      'Geração automática de certificados ao final do evento.',
    color: '#6ED7B4',
  },
];

/** Velocidade do movimento automático, em pixels por segundo. */
const VELOCIDADE_PX_POR_SEGUNDO = 24;

/** Quanto tempo o carrossel fica parado depois de um clique na seta. */
const PAUSA_APOS_SETA_MS = 1500;

function CardBeneficio({
  card,
  decorativo,
}: {
  card: (typeof cards)[number];
  /** Cópia usada só para o laço do carrossel — leitor de tela deve ignorar. */
  decorativo?: boolean;
}) {
  const Icon = card.icon;

  return (
    <Box
      aria-hidden={decorativo || undefined}
      sx={{
        position: 'relative',

        minWidth: {
          xs: '240px',
          sm: '280px',
          md: '320px',
        },

        maxWidth: {
          xs: '240px',
          sm: '280px',
          md: '320px',
        },

        flexShrink: 0,

        borderRadius: '32px',

        overflow: 'hidden',

        background: `
          linear-gradient(
            135deg,
            ${card.color} 0%,
            ${card.color === '#35A384' ? '#1F7A61' : '#54C7A1'} 100%
          )
        `,

        p: {
          xs: 3,
          md: 4,
        },

        display: 'flex',

        flexDirection: 'column',

        justifyContent: 'space-between',

        border: '1px solid rgba(255,255,255,0.18)',

        cursor: 'default',

        userSelect: 'none',

        '&::before': {
          content: '""',

          position: 'absolute',

          top: -60,

          right: -60,

          width: 160,

          height: 160,

          borderRadius: '50%',

          background: 'rgba(255,255,255,0.12)',
        },
      }}
    >
      <Box
        sx={{
          width: {
            xs: 62,
            md: 72,
          },

          height: {
            xs: 62,
            md: 72,
          },

          borderRadius: '20px',

          background: 'rgba(255,255,255,0.18)',

          display: 'flex',

          alignItems: 'center',

          justifyContent: 'center',

          backdropFilter: 'blur(10px)',

          mb: 4,
        }}
      >
        <Icon
          sx={{
            fontSize: {
              xs: 34,
              md: 42,
            },

            color: colorTokens.neutral.white,
          }}
        />
      </Box>

      <Box>
        <Typography
          sx={{
            color: colorTokens.neutral.white,

            fontWeight: 800,

            lineHeight: 1.2,

            mb: 1.5,

            fontSize: {
              xs: '1.25rem',
              md: '1.6rem',
            },
          }}
        >
          {card.title}
        </Typography>

        <Typography
          sx={{
            color: 'rgba(255,255,255,0.88)',

            lineHeight: 1.7,

            fontSize: {
              xs: '0.92rem',
              md: '1rem',
            },
          }}
        >
          {card.description}
        </Typography>
      </Box>
    </Box>
  );
}

export function BenefitsSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pausa o movimento automático sem re-renderizar: fica em ref porque é lido
  // dentro do requestAnimationFrame a cada quadro.
  const pausadoRef = useRef(false);
  const retomarRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Posição do carrossel acumulada em ponto flutuante.
   *
   * Não dá para acumular lendo `el.scrollLeft`: o navegador arredonda esse
   * valor para pixel inteiro, e como o avanço é de fração de pixel por quadro
   * (~0,4px a 60fps), a leitura voltaria sempre zero e o movimento nunca sairia
   * do lugar. Guardamos a posição real aqui e só escrevemos no DOM.
   */
  const posicaoRef = useRef(0);

  /**
   * Distância exata de uma volta: do início da primeira cópia até o início da
   * segunda. Medir os filhos em vez de usar `scrollWidth / 2` porque este
   * último inclui o padding do container e o gap entre as cópias, o que
   * deslocaria o laço alguns pixels a cada volta.
   */
  const distanciaLaco = (el: HTMLDivElement) => {
    const primeiroDaCopia = el.children[cards.length] as HTMLElement | undefined;
    const primeiro = el.children[0] as HTMLElement | undefined;

    if (!primeiroDaCopia || !primeiro) return el.scrollWidth / 2;

    return primeiroDaCopia.offsetLeft - primeiro.offsetLeft;
  };

  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  /**
   * Movimento automático contínuo.
   *
   * Anda fração de pixel por quadro em vez de pular de card em card — é o que
   * dá a sensação de fluidez. A lista de cards é renderizada duas vezes e, ao
   * passar da metade da largura, o scroll volta esse mesmo tanto: como o
   * conteúdo nesse ponto é idêntico, o laço fica imperceptível.
   */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respeita quem pediu menos animação no sistema operacional.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let quadro = 0;
    let anterior = performance.now();

    const passo = (agora: number) => {
      const deltaSegundos = (agora - anterior) / 1000;
      anterior = agora;

      if (pausadoRef.current) {
        // Parado: acompanha o que o usuário fez com as setas ou o arraste, para
        // não dar um salto ao retomar.
        posicaoRef.current = el.scrollLeft;
      } else {
        const volta = distanciaLaco(el);

        posicaoRef.current += VELOCIDADE_PX_POR_SEGUNDO * deltaSegundos;

        if (volta > 0) {
          posicaoRef.current %= volta;
        }

        el.scrollLeft = posicaoRef.current;
      }

      quadro = requestAnimationFrame(passo);
    };

    quadro = requestAnimationFrame(passo);

    return () => {
      cancelAnimationFrame(quadro);
      if (retomarRef.current) clearTimeout(retomarRef.current);
    };
  }, []);

  const pausar = () => {
    if (retomarRef.current) {
      clearTimeout(retomarRef.current);
      retomarRef.current = null;
    }
    pausadoRef.current = true;
  };

  const retomar = () => {
    pausadoRef.current = false;
  };

  const deslizar = useCallback((direcao: -1 | 1) => {
    const el = containerRef.current;
    if (!el) return;

    // Passo de uma seta: a largura de um card mais o espaçamento entre eles.
    const primeiro = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(window.getComputedStyle(el).columnGap) || 0;
    const passo = primeiro ? primeiro.offsetWidth + gap : 320;

    // No começo da lista o scroll não consegue ir para trás (fica preso no
    // zero). Como o conteúdo é duplicado, saltar uma metade para frente cai no
    // mesmo ponto visual e libera espaço para rolar à esquerda.
    if (direcao === -1 && el.scrollLeft < passo) {
      el.scrollLeft += distanciaLaco(el);
    }

    el.scrollBy({ left: direcao * passo, behavior: 'smooth' });

    // Sem esta pausa o movimento automático brigaria com a rolagem suave que
    // acabou de começar, e o clique pareceria não ter efeito.
    pausar();
    retomarRef.current = setTimeout(retomar, PAUSA_APOS_SETA_MS);
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDownRef.current = true;

    const el = containerRef.current;

    if (!el) return;

    el.style.cursor = 'grabbing';

    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return;

    const el = containerRef.current;

    if (!el) return;

    const x = e.pageX - el.offsetLeft;

    const walk = x - startXRef.current;

    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const endDrag = () => {
    isDownRef.current = false;

    const el = containerRef.current;

    if (el) {
      el.style.cursor = 'grab';
    }
  };

  const setaSx = {
    position: 'absolute',

    top: '50%',

    transform: 'translateY(-50%)',

    zIndex: 2,

    backgroundColor: colorTokens.neutral.white,

    color: colorTokens.text.primary,

    border: `1px solid ${colorTokens.neutral.border}`,

    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',

    width: {
      xs: 38,
      md: 46,
    },

    height: {
      xs: 38,
      md: 46,
    },

    '&:hover': {
      backgroundColor: colorTokens.neutral.white,
    },
  } as const;

  return (
    <Box
      sx={{
        width: '100%',

        py: {
          xs: 8,
          md: 12,
        },

        overflow: 'hidden',

        backgroundColor: colorTokens.neutral.white,

        position: 'relative',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            textAlign: 'center',

            mb: {
              xs: 5,
              md: 8,
            },
          }}
        >
          <Typography
            sx={{
              display: 'inline-flex',

              alignItems: 'center',

              justifyContent: 'center',

              px: 2.5,

              py: 0.8,

              borderRadius: '999px',

              backgroundColor: '#E8FFF6',

              color: '#1C8C6C',

              fontWeight: 700,

              fontSize: '0.85rem',

              mb: 2,
            }}
          >
            Plataforma para eventos universitários da UEFS
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: '2rem',
                md: '3.5rem',
              },

              fontWeight: 800,

              lineHeight: 1.1,

              color: '#13284D',

              mb: 2,
            }}
          >
            Tudo que você precisa
            <br />
            em um só lugar
          </Typography>

          <Typography
            sx={{
              color: '#5B6470',

              maxWidth: '760px',

              mx: 'auto',

              lineHeight: 1.7,

              fontSize: {
                xs: '1rem',
                md: '1.1rem',
              },
            }}
          >
            Controle de presença, emissão automática de certificados e gestão de carga horária em uma única plataforma.
          </Typography>
        </Box>

        <Box
          sx={{ position: 'relative' }}
          onMouseEnter={pausar}
          onMouseLeave={retomar}
        >
          <IconButton
            aria-label="Ver benefícios anteriores"
            onClick={() => deslizar(-1)}
            sx={{ ...setaSx, left: { xs: -6, md: -18 } }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>

          <IconButton
            aria-label="Ver próximos benefícios"
            onClick={() => deslizar(1)}
            sx={{ ...setaSx, right: { xs: -6, md: -18 } }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>

          <Box
            ref={containerRef}
            onMouseDown={(e) => {
              pausar();
              onMouseDown(e);
            }}
            onMouseMove={onMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            sx={{
              display: 'flex',

              gap: {
                xs: 2,
                md: 3,
              },

              overflowX: 'auto',

              pb: 2,

              px: {
                xs: 1,
                md: 0,
              },

              cursor: 'grab',

              userSelect: 'none',

              msOverflowStyle: 'none',

              scrollbarWidth: 'none',

              WebkitOverflowScrolling: 'touch',

              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {/* A lista aparece duas vezes para o laço do movimento automático
                não ter emenda visível. A segunda cópia é decorativa. */}
            {cards.map((card) => (
              <CardBeneficio key={card.title} card={card} />
            ))}

            {cards.map((card) => (
              <CardBeneficio key={`clone-${card.title}`} card={card} decorativo />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
