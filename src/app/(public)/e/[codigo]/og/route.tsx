import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { formatEventPeriod } from '@/features/event-landing/utils/eventLandingFormat';
import {
  OG_IMAGE_SIZE,
  fetchPublicEventSummary,
  safeDecode,
} from '@/features/event-landing/utils/publicEventMetadata';

const PUBLIC_DIR = join(process.cwd(), 'public');

async function loadFonts() {
  const [regular, bold] = await Promise.all([
    readFile(join(PUBLIC_DIR, 'fonts', 'Poppins-Regular.ttf')),
    readFile(join(PUBLIC_DIR, 'fonts', 'Poppins-Bold.ttf')),
  ]);
  return [
    { name: 'Poppins', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Poppins', data: bold, weight: 700 as const, style: 'normal' as const },
  ];
}

async function readPublicAsDataUrl(path: string, mime: string) {
  const file = await readFile(join(PUBLIC_DIR, path));
  return `data:${mime};base64,${file.toString('base64')}`;
}

export async function GET(_request: Request, { params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const event = await fetchPublicEventSummary(safeDecode(codigo));

  const [logo, certificate, fonts] = await Promise.all([
    readPublicAsDataUrl('logo_white.svg', 'image/svg+xml').catch(() => null),
    readPublicAsDataUrl('images/certificadoVariacao2.png', 'image/png').catch(() => null),
    loadFonts().catch(() => undefined),
  ]);

  const title = event?.nome ?? 'Evento no Assinaê';
  const period =
    event?.dataInicio && event?.dataFim ? formatEventPeriod(event.dataInicio, event.dataFim) : null;
  const details = [period, event?.localizacao].filter(Boolean).join(' · ');

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: 'linear-gradient(135deg, #0D1E3B 0%, #13284D 60%, #0F3D30 100%)',
        color: '#FFFFFF',
        fontFamily: 'Poppins',
        padding: '64px 72px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -60,
          top: 40,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background: 'radial-gradient(circle, rgba(5,150,105,0.35) 0%, rgba(5,150,105,0) 68%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 640,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {logo ? (
            <div
              style={{
                width: 56,
                height: 56,
                backgroundImage: `url(${logo})`,
                backgroundSize: '56px 56px',
              }}
            />
          ) : null}
          <span style={{ fontSize: 30, fontWeight: 700 }}>Assinaê</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              padding: '8px 20px',
              borderRadius: 9999,
              background: 'rgba(110,215,180,0.16)',
              border: '1px solid rgba(110,215,180,0.4)',
              color: '#6ED7B4',
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Evento
          </span>
          <span
            style={{
              display: 'block',
              fontSize: title.length > 40 ? 52 : 64,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-1.5px',
              lineClamp: 3,
            }}
          >
            {title}
          </span>
          {details ? <span style={{ fontSize: 28, color: '#C7D2E0' }}>{details}</span> : null}
        </div>

        <span style={{ fontSize: 24, color: '#6ED7B4', fontWeight: 700 }}>
          Programação e inscrições no Assinaê
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {certificate ? (
          <div
            style={{
              width: 400,
              height: 333,
              backgroundImage: `url(${certificate})`,
              backgroundSize: '400px 333px',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ) : null}
      </div>
    </div>,
    {
      ...OG_IMAGE_SIZE,
      fonts,
      headers: {
        'Cache-Control': event
          ? 'public, max-age=3600, s-maxage=86400'
          : 'public, max-age=60, s-maxage=60',
      },
    }
  );
}
