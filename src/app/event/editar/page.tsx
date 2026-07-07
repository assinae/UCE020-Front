import { redirect } from 'next/navigation';

export default function EditarEventoPage() {
  // The edit page requires an event ID. Use /event/editar/[id] instead.
  redirect('/home');
}