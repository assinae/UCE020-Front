'use client';

import { useMemo, useState } from 'react';
import { PageLoader } from '@/components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import {
  ListPageHeader,
  ListPageLayout,
  ListToolbar,
  PaginatedTable,
} from '@/components/data-list';
import { getRemoveStaffMessage } from '@/features/participants/presence/utils/presenceMessages';
import { filterBySearch } from '../utils/filterBySearch';
import { sortByName, type SortDirection } from '@/utils/sortByName';
import { MemberTableRow } from './MemberTableRow';
import {
  EditUserRoleModal,
  USER_ROLES,
} from '../../../components/modals/manage-users-modal/EditUserRoleModal';
import { eventService, TipoParticipante } from '@/services/eventService';
import { Toast } from '@/components/ui/Toast';
import { ToastSeverity } from '@/types/toast';
import { useAuth } from '@/providers/auth-provider';
import { formatBahiaDate } from '@/utils/date';
import type { ManagedUser, StaffRole } from '@/types/management';

interface ManageUsersViewProps {
  eventId: string;
}

const ROLE_MAP: Record<TipoParticipante, StaffRole> = {
  participante: 'Participante',
  monitor: 'Monitor',
  organizador: 'Organizador',
};

type RoleFilter = 'all' | StaffRole;

const FILTER_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'Participante', label: 'Participantes' },
  { value: 'Monitor', label: 'Monitores' },
  { value: 'Organizador', label: 'Organizadores' },
];

const GRID_COLUMNS = { xs: 'minmax(0, 1fr) 44px', md: '1fr 158px 60px' };
const GRID_COLUMNS_READ_ONLY = { xs: 'minmax(0, 1fr)', md: '1fr 158px' };

function shortDate(value: string): string {
  return formatBahiaDate(value).slice(0, 5);
}

const ROLE_MAP_REVERSE: Record<string, TipoParticipante> = {
  Participante: 'participante',
  Monitor: 'monitor',
  Organizador: 'organizador',
};

export function ManageUsersView({ eventId }: ManageUsersViewProps) {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const numericEventId = Number(eventId);
  const hasValidEventId = Number.isFinite(numericEventId);

  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [page, setPage] = useState(1);

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

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['event-members', numericEventId],
    queryFn: () =>
      eventService.getEventMembers(numericEventId).then((members) =>
        members.map((member) => ({
          id: String(member.usuarioId),
          name: member.nome,
          email: member.email,
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

  const filteredUsers = useMemo(
    () =>
      sortByName(
        filterBySearch(users, search).filter(
          (user) => roleFilter === 'all' || user.role === roleFilter
        ),
        sortDirection
      ),
    [users, search, roleFilter, sortDirection]
  );

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

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeRoleFilter(value: RoleFilter) {
    setRoleFilter(value);
    setPage(1);
  }

  const countOf = (role: StaffRole) => users.filter((user) => user.role === role).length;
  const showActions = !isEventFinalized;
  const gridColumns = showActions ? GRID_COLUMNS : GRID_COLUMNS_READ_ONLY;

  return (
    <>
      <ListPageLayout>
        <ListPageHeader
          title="Membros do evento"
          subtitle={event?.nome ?? ''}
          pill={
            event
              ? {
                  icon: <CalendarMonthRoundedIcon />,
                  label: `${shortDate(event.dataInicio)} a ${shortDate(event.dataFim)}`,
                }
              : null
          }
          stats={[
            { value: users.length, label: users.length === 1 ? 'membro' : 'membros' },
            { value: countOf('Monitor'), label: 'monitores', highlighted: true },
            { value: countOf('Organizador'), label: 'organizadores' },
          ]}
          backHref={`/event/${eventId}`}
        />

        <ListToolbar
          search={search}
          onSearchChange={changeSearch}
          searchPlaceholder="Buscar membro"
          sortDirection={sortDirection}
          onSortChange={setSortDirection}
          filter={{
            label: 'Mostrar',
            value: roleFilter,
            options: FILTER_OPTIONS,
            onChange: changeRoleFilter,
          }}
        />

        {isLoading ? (
          <PageLoader minHeight="40dvh" />
        ) : (
          <PaginatedTable
            items={filteredUsers}
            getKey={(user) => user.id}
            columns={[
              { label: 'Membro' },
              { label: 'Papel' },
              ...(showActions ? [{ label: 'Ações', alignRight: true }] : []),
            ]}
            gridColumns={gridColumns}
            page={page}
            onPageChange={setPage}
            paginationLabel="Paginação dos membros"
            emptyTitle="Nenhum membro encontrado"
            emptyDescription="Ajuste a busca ou o filtro para ver outros nomes."
            renderRow={(user) => (
              <MemberTableRow
                member={user}
                gridColumns={gridColumns}
                showActions={showActions}
                canManage={String(currentUser?.id) !== user.id}
                onEditRole={openEditModal}
                onRemove={openDeleteModal}
              />
            )}
          />
        )}
      </ListPageLayout>

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
    </>
  );
}
