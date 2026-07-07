import { api } from './api';
import { GenericResponse, LoginResponse, RegisterResponse, GetMeResponse } from '../features/auth/types/response';
import { LoginFormData } from '@/features/auth/hooks/useLogin';

class AuthService {
  /**
   * Triggers the password recovery email request
   * @param email User's email address
   */
  async forgotPassword(payload: { email: string }): Promise<GenericResponse> {
    const { data } = await api.post<GenericResponse>('/auth/forgot-password', payload);
    return data;
  }

  /**
   * Submits the new password using the crypto token sent via email
   * @param token The hash token extracted from the email URL
   * @param password The new password chosen by the user
   */
  async resetPassword(token: string, newPassword: string): Promise<GenericResponse> {
    const { data } = await api.post<GenericResponse>('/auth/reset-password', {
      token,
      newPassword,
    });
    return data;
  }

  /**
   * Authenticates the user credentials
   */
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  }

  /**
   * Registers a new user
   * @param userData The user data for registration
   */
  async register(userData: Record<string, string>): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>('/auth/register', userData);
    return data;
  }

  /**
   * Envia o código de 6 dígitos junto com o e-mail para validar a conta
   */
  async verifyRegisterCode(payload: { email: string; code: string }): Promise<LoginResponse> {
    // 💡 Certifique-se de que a rota bate com o @Post('verify-code') do seu controller no NestJS
    const { data } = await api.post<LoginResponse>('/auth/verify-code', payload);
    return data;
  }

  async getMe(): Promise<GetMeResponse> {
    const { data } = await api.get<GetMeResponse>('/auth/me');
    return data;
  }
}

export const authService = new AuthService();
