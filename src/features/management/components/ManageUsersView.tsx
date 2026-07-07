'use client';

import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, IconButton } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useRouter } from 'next/navigation';
import { colorTokens } from '@/lib/colors';
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
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const numericEventId = Number(eventId);
    let isMounted = true;

    if (!Number.isFinite(numericEventId)) {
      Promise.resolve().then(() => {
        if (isMounted) setIsLoading(false);
      });
      return;
    }

    eventService
      .getEventMembers(numericEventId)
      .then((members) => {
        const mappedUsers: ManagedUser[] = members.map((member) => ({
          id: String(member.usuarioId),
          name: member.nome,
          role: ROLE_MAP[member.tipo] || 'Participante',
        }));
        setUsers(mappedUsers);
      })
      .catch((error) => {
        console.error(error);
        setToast({
          open: true,
          message: 'Erro ao carregar membros do evento.',
          severity: ToastSeverity.Error,
        });
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const filteredUsers = filterBySearch(users, search);

  // --- Exclusão ---
  function openDeleteModal(userId: string) {
    const user = users.find((item) => item.id === userId);
    if (!user) return;
    setSelectedUser(user);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  }

  async function handleDeleteUser() {
    if (!selectedUser) return;
    try {
      await eventService.removeEventMember(Number(eventId), Number(selectedUser.id));
      setUsers((current) => current.filter((item) => item.id !== selectedUser.id));
      setToast({
        open: true,
        message: 'Membro removido com sucesso.',
        severity: ToastSeverity.Success,
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: 'Erro ao remover o membro.',
        severity: ToastSeverity.Error,
      });
    } finally {
      closeDeleteModal();
    }
  }

  // --- Edição de papel ---
  function openEditModal(userId: string) {
    const user = users.find((item) => item.id === userId);
    if (!user) return;
    setEditingUser(user);
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setEditingUser(null);
  }

  async function handleSaveRole(newRole: StaffRole) {
    if (!editingUser) return;
    try {
      const tipo = ROLE_MAP_REVERSE[newRole];
      await eventService.updateEventMember(Number(eventId), Number(editingUser.id), tipo);
      setUsers((current) =>
        current.map((item) =>
          item.id === editingUser.id ? { ...item, role: newRole } : item,
        ),
      );
      setToast({
        open: true,
        message: 'Papel atualizado com sucesso.',
        severity: ToastSeverity.Success,
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: 'Erro ao atualizar papel do membro.',
        severity: ToastSeverity.Error,
      });
    } finally {
      closeEditModal();
    }
  }

  const deleteMessages = selectedUser
    ? getRemoveStaffMessage(selectedUser.name, 'o usuário')
    : { message: '', emphasisEndText: '' };

  if (isLoading) {
    return (
      <AppPageContainer
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </AppPageContainer>
    );
  }

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
          width: '100%',
          maxWidth: 800,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => router.push(`/event/${eventId}`)}
            aria-label="Voltar"
            sx={{
              color: colorTokens.text.primary,
              bgcolor: '#F8FAFC',
              border: '1px solid rgba(15, 29, 53, 0.06)',
              '&:hover': { bgcolor: '#EEF2F6' },
            }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
        </Box>
        <ManagementListCard
          title="Gerenciar Membros do Evento"
          search={search}
          onSearchChange={setSearch}
          searchAriaLabel="Buscar usuário"
          isEmpty={filteredUsers.length === 0}
          emptyMessage="Nenhum usuário encontrado"
        >
          {filteredUsers.map((user) => (
            <StaffListRow
              key={user.id}
              name={user.name}
              role={user.role}
              onEdit={() => openEditModal(user.id)}
              onDelete={() => openDeleteModal(user.id)}
            />
          ))}
        </ManagementListCard>
      </Box>

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