import { api } from './api';
import { UserProfile, UserProfileResponse, UpdateProfilePayload } from '../types/userProfile';

// Formato bruto retornado pelo backend. O campo do nome pode vir como
// `name` (inglês) ou `nome` (português), e o usuário pode estar no nível
// `data` ou aninhado em `data.user`, dependendo do endpoint.
type BackendUserProfile = {
  id: number;
  name?: string;
  nome?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
};

type BackendUserProfileResponse = {
  data: BackendUserProfile | { user: BackendUserProfile };
  statusCode: number;
};

function extractUser(data: BackendUserProfileResponse['data']): BackendUserProfile {
  return 'user' in data ? data.user : data;
}

function toUserProfile(raw: BackendUserProfile): UserProfile {
  return {
    id: raw.id,
    name: raw.name ?? raw.nome ?? '',
    email: raw.email,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    avatarUrl: raw.avatarUrl,
  };
}

class UserProfileService {
  /**
   * Retorna o perfil do usuário autenticado
   */
  async getProfile(): Promise<UserProfileResponse> {
    const { data } = await api.get<BackendUserProfileResponse>('/user/me');
    return {
      data: toUserProfile(extractUser(data.data)),
      statusCode: data.statusCode,
    };
  }

  /**
   * Atualiza nome e/ou email do usuário autenticado
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfileResponse> {
    const { data } = await api.patch<BackendUserProfileResponse>('/user/me', payload);
    return {
      data: toUserProfile(extractUser(data.data)),
      statusCode: data.statusCode,
    };
  }

  async uploadAvatar(file: File): Promise<{ data: { avatarUrl: string }; statusCode: number }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await api.post<{ data: { avatarUrl: string }; statusCode: number }>(
      '/user/me/avatar',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return data;
  }

  async changePassword(payload: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.patch('/user/me/password', {
      senhaAtual: payload.currentPassword,
      novaSenha: payload.newPassword,
    });
  }
}

export const userProfileService = new UserProfileService();