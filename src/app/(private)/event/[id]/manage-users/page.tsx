import { ManageUsersView } from '@/features/management';

export default async function ManageUsersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManageUsersView eventId={id} />;
}
