import EventForm from '@/features/event/components/EventForm';

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarEventoPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  return <EventForm mode="edit" eventId={Number(id)} />;
}
