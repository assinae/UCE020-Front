'use client';

import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { ProfileHeader, ProfileForm } from '@/features/user-profile';
import type { UserProfile } from '@/types/userProfile';
import { userProfileService } from '@/services/userProfileService';
import { Toast } from '@/components/ui/Toast';
import { ToastSeverity } from '@/types/toast';
import { isAxiosError } from 'axios';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: ToastSeverity;
  }>({
    open: false,
    message: '',
    severity: ToastSeverity.Error,
  });

  useEffect(() => {
    userProfileService
      .getProfile()
      .then(({ data }) => setUser(data))
      .catch((err) => {
        console.error('Falha ao carregar perfil:', err);
        setToast({
          open: true,
          message: 'Não foi possível carregar o perfil',
          severity: ToastSeverity.Error,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveProfile = async (userData: UserProfile) => {
    const previousUser = user;

    setUser(userData);

    try {
      const { data } = await userProfileService.updateProfile({
        name: userData.name,
        email: userData.email,
      });
      setUser(data);
    } catch (err) {
      // Em caso de erro, reverte para os dados anteriores
      console.error('Falha ao salvar perfil:', err);
      setUser(previousUser);
    }
  };

  const handleAvatarChange = async (file: File) => {
    if (!user) return;

    try {
      const { data } = await userProfileService.uploadAvatar(file);
      // Atualiza a URL do avatar retornada pelo backend
      setUser((prev) => (prev ? { ...prev, avatarUrl: data.avatarUrl } : prev));
    } catch (err) {
      console.error('Falha ao enviar foto de perfil:', err);
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    await userProfileService.changePassword({ currentPassword, newPassword });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        />
      </Box>
    );
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

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}