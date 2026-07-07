'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { AppPageContainer } from '@/components/layout/AppPageContainer';
import { MOCK_GUESTS } from '@/mocks/guests';
import { getRemoveStaffMessage } from '@/features/participants/presence/utils/presenceMessages';
import { filterBySearch } from '../utils/filterBySearch';
import { ManagementListCard } from './ManagementListCard';
import { StaffListRow } from './StaffListRow';
import { EditUserRoleModal, GUEST_ROLES } from '../../../components/modals/manage-users-modal/EditUserRoleModal';
import type { ManagedGuest, GuestRole } from '@/types/management';

export function ManageGuestsView() {
  const [guests, setGuests] = useState<ManagedGuest[]>(MOCK_GUESTS);
  const [search, setSearch] = useState('');

  // Estado do modal de exclusão
  const [selectedGuest, setSelectedGuest] = useState<ManagedGuest | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Estado do modal de edição de papel
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<ManagedGuest | null>(null);

  const filteredGuests = filterBySearch(guests, search);

  // --- Exclusão ---
  function openDeleteModal(guestId: string) {
    const guest = guests.find((item) => item.id === guestId);
    if (!guest) return;
    setSelectedGuest(guest);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setSelectedGuest(null);
  }

  async function handleDeleteGuest() {
    if (!selectedGuest) return;
    setGuests((current) => current.filter((item) => item.id !== selectedGuest.id));
    closeDeleteModal();
  }

  // --- Edição de papel ---
  function openEditModal(guestId: string) {
    const guest = guests.find((item) => item.id === guestId);
    if (!guest) return;
    setEditingGuest(guest);
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setEditingGuest(null);
  }

  function handleSaveRole(newRole: GuestRole) {
    if (!editingGuest) return;
    setGuests((current) =>
      current.map((item) =>
        item.id === editingGuest.id ? { ...item, role: newRole } : item,
      ),
    );
    closeEditModal();
  }

  const deleteMessages = selectedGuest
    ? getRemoveStaffMessage(selectedGuest.name, 'o convidado')
    : { message: '', emphasisEndText: '' };

  return (
    <AppPageContainer
      sx={{
        bgcolor: { xs: 'background.default', sm: '#e8eaf0' },
        display: { sm: 'flex' },
        flexDirection: { sm: 'column' },
        alignItems: { sm: 'center' },
        justifyContent: { sm: 'center' },
        py: { sm: 4 },
      }}
    >
      <Box
        sx={{
          minHeight: { xs: '100dvh', sm: 'auto' },
          bgcolor: 'background.paper',
          borderRadius: { xs: 0, sm: 4 },
          mx: { xs: -2, sm: 0 },
          px: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 4 },
          boxShadow: { xs: 'none', sm: '0 4px 24px rgba(0,0,0,0.08)' },
        }}
      >
        <ManagementListCard
          title="Gerenciar Convidados"
          search={search}
          onSearchChange={setSearch}
          searchAriaLabel="Buscar convidado"
          isEmpty={filteredGuests.length === 0}
          emptyMessage="Nenhum convidado encontrado"
        >
          {filteredGuests.map((guest) => (
            <StaffListRow
              key={guest.id}
              name={guest.name}
              role={guest.role}
              onEdit={() => openEditModal(guest.id)}
              onDelete={() => openDeleteModal(guest.id)}
            />
          ))}
        </ManagementListCard>
      </Box>

      {/* Modal de edição de papel */}
      <EditUserRoleModal
        key={editingGuest?.id} // <-- Reseta o estado interno do modal para o convidado atual
        open={editModalOpen}
        userName={editingGuest?.name ?? ''}
        currentRole={editingGuest?.role as GuestRole ?? 'Palestrante'}
        roles={GUEST_ROLES}
        onClose={closeEditModal}
        onConfirm={handleSaveRole}
      />

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        message={deleteMessages.message}
        emphasisEndText={deleteMessages.emphasisEndText}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleDeleteGuest}
      />
    </AppPageContainer>
  );
}