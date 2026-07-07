'use client';

import { useState } from 'react';
import { authService } from '@/services/authService';
import { UserRegister } from '@/features/auth/types/userRegister';
import { useAuth } from '@/providers/auth-provider';

interface AxiosErrorResponse {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export type RegisterStep = 'form' | 'code' | 'success';

export function useRegister() {
  const [step, setStep] = useState<RegisterStep>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [formData, setFormData] = useState<UserRegister | null>(null);
  const { loginGlobal } = useAuth();

  async function submitForm(data: UserRegister) {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(data); 
      setFormData(data);
      setStep('code');
    } catch (err) {
      const axiosError = err as AxiosErrorResponse;
      setError(axiosError.response?.data?.error || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  async function submitCode() {
    if (!code.trim()) {
      setError('Digite o código recebido por e-mail.');
      return;
    }

    if (!formData || !formData.email) {
      setError('Sessão expirada. Por favor, preencha o formulário novamente.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.verifyRegisterCode({ 
        email: formData.email, 
        code 
      });

      const token = response.data?.access_token || null;

      if (token && response.data?.user) {
        loginGlobal(token, response.data.user);
      }
      
      setStep('success');
    } catch (err) {
      const axiosError = err as AxiosErrorResponse;
      setError(axiosError.response?.data?.error || 'Código inválido. Verifique seu e-mail.');
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setStep('form');
    setCode('');
    setFormData(null);
    setError(null);
  }

  return {
    step,
    isLoading,
    error,
    code,
    setCode,
    submitForm,
    submitCode,
    resetForm,
    formData,
  };
}