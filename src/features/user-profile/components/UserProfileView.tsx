'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Toast } from '@/components/ui';
import { colorTokens } from '@/lib/colors';
import { useAuth } from '@/providers/auth-provider';
import { userProfileService } from '@/services/userProfileService';
import { ToastSeverity } from '@/types/toast';
import type { UserProfile } from '@/types/userProfile';
import { extractApiErrorMessage } from '@/utils/apiError';
import { AccountCard, AccountCardSkeleton } from './AccountCard';
import { ActivityCard, ActivityCardSkeleton } from './ActivityCard';
import { ProfileHeader, ProfileHeaderSkeleton } from './ProfileHeader';
import { ProfileTabs, profilePanelId, profileTabId, type ProfileTab } from './ProfileTabs';

const PROFILE_SUCCESS = {
  name: 'Nome atualizado com sucesso',
  email: 'E-mail atualizado com sucesso',
} as const;

interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
}

export function UserProfileView() {
  const queryClient = useQueryClient();
  const { user: authUser, updateUser } = useAuth();
  const userId = authUser?.id;
  const [tab, setTab] = useState<ProfileTab>('account');
  // A mensagem continua no estado ao fechar, para não sumir durante a saída do aviso.
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: ToastSeverity.Success,
  });
  const showToast = (message: string, severity = ToastSeverity.Success) =>
    setToast({ open: true, message, severity });

  const profileKey = ['user-profile', userId] as const;

  const profileQuery = useQuery({
    queryKey: profileKey,
    queryFn: () => userProfileService.getProfile().then((res) => res.data),
    enabled: !!userId,
  });

  // Carrega junto com o perfil para a aba Atividade abrir sem esqueleto.
  const activityQuery = useQuery({
    queryKey: ['user-activity', userId],
    queryFn: () => userProfileService.getActivity(),
    enabled: !!userId,
  });

  const setProfile = (profile: UserProfile) => {
    queryClient.setQueryData(profileKey, profile);
    updateUser({ name: profile.name, email: profile.email });
  };

  const updateProfile = useMutation({
    mutationFn: (changes: { name?: string; email?: string }) =>
      userProfileService.updateProfile(changes).then((res) => res.data),
    onSuccess: (profile, changes) => {
      setProfile(profile);
      showToast(changes.name ? PROFILE_SUCCESS.name : PROFILE_SUCCESS.email);
    },
  });

  const uploadAvatar = useMutation({
    mutationFn: (file: File) => userProfileService.uploadAvatar(file).then((res) => res.data),
    onSuccess: (profile) => {
      setProfile(profile);
      showToast('Foto atualizada com sucesso');
    },
    onError: (error) => {
      showToast(
        extractApiErrorMessage(error, 'Não foi possível enviar a foto.'),
        ToastSeverity.Error
      );
    },
  });

  const handleAvatarChange = (file: File) =>
    uploadAvatar.mutateAsync(file).then(
      () => true,
      () => false
    );

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    await userProfileService.changePassword({ currentPassword, newPassword });
    showToast('Senha alterada com sucesso');
  };

  const profile = profileQuery.data;

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: colorTokens.surface.app }}>
      {profile ? (
        <ProfileHeader user={profile} onAvatarChange={handleAvatarChange} />
      ) : (
        <ProfileHeaderSkeleton />
      )}

      <Box
        sx={{
          maxWidth: 740,
          mx: 'auto',
          px: 3,
          pt: 0.5,
          pb: 9,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        <ProfileTabs value={tab} onChange={setTab} />

        <Box key={tab} role="tabpanel" id={profilePanelId(tab)} aria-labelledby={profileTabId(tab)}>
          {tab === 'account' &&
            (profile ? (
              <AccountCard
                user={profile}
                onSaveProfile={(changes) =>
                  updateProfile.mutateAsync(changes).then(() => undefined)
                }
                onChangePassword={handleChangePassword}
              />
            ) : (
              <AccountCardSkeleton />
            ))}

          {tab === 'activity' &&
            (activityQuery.data ? (
              <ActivityCard activity={activityQuery.data} />
            ) : activityQuery.isError ? (
              <Box
                component="p"
                role="alert"
                className="animate-fade-up motion-reduce:animate-none"
                sx={{
                  m: 0,
                  py: 4,
                  textAlign: 'center',
                  fontSize: 13.5,
                  color: colorTokens.text.muted,
                }}
              >
                Não foi possível carregar sua atividade agora. Tente novamente mais tarde.
              </Box>
            ) : (
              <ActivityCardSkeleton />
            ))}
        </Box>
      </Box>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
      />
    </Box>
  );
}
