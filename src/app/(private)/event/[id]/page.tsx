import { EventDetailView } from '@/features/event/components/EventDetailView';

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;

  return <EventDetailView eventId={id} />;
}
