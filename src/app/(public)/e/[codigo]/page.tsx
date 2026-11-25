import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { EventLandingView } from '@/features/event-landing';
import {
  OG_IMAGE_SIZE,
  fetchPublicEventSummary,
  safeDecode,
} from '@/features/event-landing/utils/publicEventMetadata';

type PageProps = { params: Promise<{ codigo: string }> };

function firstHeaderValue(value: string | null): string | null {
  return value?.split(',')[0]?.trim() || null;
}

function parseUrl(value: string | undefined): URL | null {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

async function getSiteUrl(): Promise<URL> {
  const configured = parseUrl(process.env.NEXT_PUBLIC_APP_URL);
  if (configured) return configured;

  const requestHeaders = await headers();
  const host =
    firstHeaderValue(requestHeaders.get('x-forwarded-host')) ??
    firstHeaderValue(requestHeaders.get('host')) ??
    'localhost:3000';
  const protocol =
    firstHeaderValue(requestHeaders.get('x-forwarded-proto')) ??
    (host.startsWith('localhost') ? 'http' : 'https');

  return parseUrl(`${protocol}://${host}`) ?? new URL('http://localhost:3000');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { codigo } = await params;
  const decoded = safeDecode(codigo);
  const [event, siteUrl] = await Promise.all([fetchPublicEventSummary(decoded), getSiteUrl()]);

  const pagePath = `/e/${encodeURIComponent(decoded)}`;
  const title = event?.nome ?? 'Evento · Assinaê';
  const description = event?.nome
    ? event.descricao?.replace(/\s+/g, ' ').trim().slice(0, 160) ||
      `Programação e inscrições de ${event.nome}.`
    : 'Programação e inscrições de eventos no Assinaê.';
  const image = event?.foto
    ? { url: event.foto, alt: `Capa do evento ${title}` }
    : { url: `${pagePath}/og`, ...OG_IMAGE_SIZE, alt: title, type: 'image/png' };

  return {
    metadataBase: siteUrl,
    title,
    description,
    alternates: { canonical: pagePath },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Assinaê',
      url: pagePath,
      title,
      description,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}

export default async function EventLandingPage({ params }: PageProps) {
  const { codigo } = await params;
  return <EventLandingView codigo={safeDecode(codigo)} />;
}
