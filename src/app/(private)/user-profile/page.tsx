'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLoader } from '@/components/ui';

import { ProfileHeader, ProfileForm } from '@/features/user-profile';
import type { UserProfile } from '@/types/userProfile';
import { userProfileService } from '@/services/userProfileService';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userProfileService.getProfile().then((res) => res.data),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (userData: { name: string; email: string }) =>
      userProfileService.updateProfile(userData),
    onSuccess: (res) => {
      queryClient.setQueryData(['user-profile'], res.data);
    },
    onError: (err) => {
      console.error('Falha ao salvar perfil:', err);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => userProfileService.uploadAvatar(file),
    onSuccess: (res) => {
      queryClient.setQueryData(['user-profile'], (old: UserProfile | undefined) =>
        old ? { ...old, avatarUrl: res.data.avatarUrl } : old
      );
    },
    onError: (err) => {
      console.error('Falha ao enviar foto de perfil:', err);
    },
  });

  const handleSaveProfile = async (userData: UserProfile) => {
    // Atualização otimista via onMutate poderia ser adicionada aqui,
    // mas delegamos a mutation normal para simplificar mantendo comportamento:
    await updateProfileMutation.mutateAsync({
      name: userData.name,
      email: userData.email,
    });
  };

  const handleAvatarChange = async (file: File) => {
    await uploadAvatarMutation.mutateAsync(file);
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    // Deixamos o erro propagar para que o ProfileForm exiba a mensagem
    await userProfileService.changePassword({ currentPassword, newPassword });
  };

  if (isLoading || !user) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <ProfileHeader user={user} onAvatarChange={handleAvatarChange} />

      <Box sx={{ maxWidth: 600, mx: 'auto', px: 3, pt: 4, pb: 4 }}>
        <ProfileForm
          user={user}
          onSave={handleSaveProfile}
          isEditing={isEditing}
          onEditChange={setIsEditing}
          onChangePassword={handleChangePassword}
        />
      </Box>
    </Box>
  );
}