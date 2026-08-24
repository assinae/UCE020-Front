'use client';

import { useState } from 'react';
import { PageLoader } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { AppPageContainer } from '@/components/layout/AppPageContainer';
import { getRemoveStaffMessage } from '@/features/participants/presence/utils/presenceMessages';
import { filterBySearch } from '../utils/filterBySearch';
import { ManagementListCard } from './ManagementListCard';
import { StaffListRow } from './StaffListRow';
import { EditUserRoleModal, USER_ROLES } from '../../../components/modals/manage-users-modal/EditUserRoleModal';
import { eventService, TipoParticipante } from '@/services/eventService';
import { Toast } from '@/components/ui/Toast';
import { ToastSeverity } from '@/types/toast';
import { useAuth } from '@/providers/auth-provider';
import type { ManagedUser, StaffRole } from '@/types/management';

interface ManageUsersViewProps {
  eventId: string;
}

const ROLE_MAP: Record<TipoParticipante, StaffRole> = {
  participante: 'Participante',
  monitor: 'Monitor',
  organizador: 'Organizador',
};

const ROLE_MAP_REVERSE: Record<string, TipoParticipante> = {
  Participante: 'participante',
  Monitor: 'monitor',
  Organizador: 'organizador',
};

export function ManageUsersView({ eventId }: ManageUsersViewProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const numericEventId = Number(eventId);
  const hasValidEventId = Number.isFinite(numericEventId);

  const [search, setSearch] = useState('');

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: ToastSeverity }>({
    open: false,
    message: '',
    severity: ToastSeverity.Success,
  });

  // Estado do modal de exclusão
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Estado do modal de edição de papel
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  const { data: event } = useQuery({
    queryKey: ['event', numericEventId],
    queryFn: () => eventService.findOne(numericEventId),
    enabled: hasValidEventId,
  });

  const isEventFinalized = event?.status?.toLowerCase() === 'finalizada';

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['event-members', numericEventId],
    queryFn: () => eventService.getEventMembers(numericEventId).then(members =>
      members.map((member) => ({
        id: String(member.usuarioId),
        name: member.nome,
        role: ROLE_MAP[member.tipo] || 'Participante',
      }))
    ),
    enabled: hasValidEventId,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // Mostra um erro caso falhe a query de membros
  if (isError && !toast.open) {
    setToast({
      open: true,
      message: 'Erro ao carregar membros do evento.',
      severity: ToastSeverity.Error,
    });
  }

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => eventService.removeEventMember(numericEventId, Number(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-members', numericEventId] });
      setToast({
        open: true,
        message: 'Membro removido com sucesso.',
        severity: ToastSeverity.Success,
      });
      closeDeleteModal();
    },
    onError: (error) => {
      console.error(error);
      setToast({
        open: true,
        message: 'Erro ao remover o membro.',
        severity: ToastSeverity.Error,
      });
      closeDeleteModal();
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: StaffRole }) => {
      const tipo = ROLE_MAP_REVERSE[newRole];
      return eventService.updateEventMember(numericEventId, Number(userId), tipo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-members', numericEventId] });
      setToast({
        open: true,
        message: 'Papel atualizado com sucesso.',
        severity: ToastSeverity.Success,
      });
      closeEditModal();
    },
    onError: (error) => {
      console.error(error);
      setToast({
        open: true,
        message: 'Erro ao atualizar papel do membro.',
        severity: ToastSeverity.Error,
      });
      closeEditModal();
    },
  });

  const filteredUsers = filterBySearch(users, search);

  // --- Exclusão ---
  function openDeleteModal(userId: string) {
    if (isEventFinalized) return;
    const user = users.find((item) => item.id === userId);
    if (!user) return;
    setSelectedUser(user);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  }

  function handleDeleteUser() {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.id);
  }

  // --- Edição de papel ---
  function openEditModal(userId: string) {
    if (isEventFinalized) return;
    const user = users.find((item) => item.id === userId);
    if (!user) return;
    setEditingUser(user);
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setEditingUser(null);
  }

  function handleSaveRole(newRole: StaffRole) {
    if (!editingUser) return;
    updateRoleMutation.mutate({ userId: editingUser.id, newRole });
  }

  const deleteMessages = selectedUser
    ? getRemoveStaffMessage(selectedUser.name, 'o usuário')
    : { message: '', emphasisEndText: '' };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <AppPageContainer maxWidth={800}>
      <ManagementListCard
        title="Gerenciar Membros do Evento"
        search={search}
        onSearchChange={setSearch}
        searchAriaLabel="Buscar usuário"
        onBack={() => router.push(`/event/${eventId}`)}
        isEmpty={filteredUsers.length === 0}
        emptyMessage="Nenhum usuário encontrado"
      >
        {filteredUsers.map((user) => {
          const isCurrentUser = String(currentUser?.id) === user.id;
          return (
            <StaffListRow
              key={user.id}
              name={user.name}
              role={user.role}
              onEdit={isCurrentUser || isEventFinalized ? undefined : () => openEditModal(user.id)}
              onDelete={isCurrentUser || isEventFinalized ? undefined : () => openDeleteModal(user.id)}
            />
          );
        })}
      </ManagementListCard>

      {/* Modal de edição de tipo aplicando a renderização condicional correta com a key */}
      {editModalOpen && editingUser && (
        <EditUserRoleModal
          key={editingUser.id}
          open={editModalOpen}
          userName={editingUser.name}
          currentRole={editingUser.role as StaffRole}
          roles={USER_ROLES}
          onClose={closeEditModal}
          onConfirm={handleSaveRole}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        message={deleteMessages.message}
        emphasisEndText={deleteMessages.emphasisEndText}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleDeleteUser}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </AppPageContainer>
  );
}