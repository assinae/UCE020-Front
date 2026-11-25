'use client';

import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

interface CertificatePdfPageProps {
  blob?: Blob;
  /** Avisa a capa quando o desenho falha, para ela cair no cartão simples. */
  onFailure?: () => void;
}

/** A4 deitado — o formato que o backend gera; vale até a 1ª página ser lida. */
const A4_LANDSCAPE = 842 / 595;

/** Acima de 2x o ganho de nitidez não compensa a memória do canvas. */
const MAX_PIXEL_RATIO = 2;

/**
 * Desenha a primeira página do PDF num canvas com o pdf.js.
 *
 * O leitor embutido do navegador (iframe) pinta a própria moldura cinza em
 * volta da folha e ignora parte dos parâmetros de enquadramento, além de nem
 * renderizar no Chrome do Android. Desenhando aqui, o certificado ocupa o
 * quadro inteiro, sem moldura estranha, igual no desktop e no celular.
 */
export function CertificatePdfPage({ blob, onFailure }: CertificatePdfPageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  const [doc, setDoc] = useState<PDFDocumentProxy>();
  const [aspect, setAspect] = useState(A4_LANDSCAPE);
  const [cssWidth, setCssWidth] = useState(0);

  // Largura real do quadro: o canvas é desenhado nessa medida (x DPR) para não
  // sair borrado. O observer já roda fora do render, então pode chamar setState.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new ResizeObserver(([entry]) => {
      setCssWidth(Math.round(entry.contentRect.width));
    });

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!blob) return;

    let cancelled = false;
    let loaded: PDFDocumentProxy | undefined;

    (async () => {
      // Import dinâmico: o pdf.js é ESM e só roda no navegador.
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString();

      const data = new Uint8Array(await blob.arrayBuffer());
      loaded = await pdfjs.getDocument({ data }).promise;

      if (cancelled) {
        await loaded.destroy();
        return;
      }

      const page = await loaded.getPage(1);
      const viewport = page.getViewport({ scale: 1 });

      setAspect(viewport.width / viewport.height);
      setDoc(loaded);
    })().catch(() => {
      if (!cancelled) onFailure?.();
    });

    return () => {
      cancelled = true;
      setDoc(undefined);
      void loaded?.destroy();
    };
  }, [blob, onFailure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!doc || !canvas || cssWidth === 0) return;

    let cancelled = false;

    (async () => {
      const page = await doc.getPage(1);
      if (cancelled) return;

      const base = page.getViewport({ scale: 1 });
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      const viewport = page.getViewport({ scale: (cssWidth / base.width) * ratio });

      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      // Um render novo enquanto o anterior corre quebra o pdf.js.
      renderTaskRef.current?.cancel();
      const task = page.render({ canvas, canvasContext: context, viewport });
      renderTaskRef.current = task;

      await task.promise;
    })().catch((error: unknown) => {
      // Cancelamento é o fluxo normal quando a largura muda no meio do desenho.
      if (error instanceof Error && error.name === 'RenderingCancelledException') return;
      if (!cancelled) onFailure?.();
    });

    return () => {
      cancelled = true;
    };
  }, [doc, cssWidth, onFailure]);

  return (
    <Box
      ref={hostRef}
      sx={{ width: '100%', aspectRatio: String(aspect), display: 'block', lineHeight: 0 }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </Box>
  );
}
