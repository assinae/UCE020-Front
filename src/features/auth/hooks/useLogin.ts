"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuth } from "@/providers/auth-provider";

export interface LoginFormData {
  email: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();
  const { loginGlobal } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(data: LoginFormData) {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      
      const token = response.data?.access_token || null;

      if (token && response.data?.user) {
        loginGlobal(token, response.data.user);
        
        router.push("/home");
      } else {
        setError("Resposta inválida do servidor.");
      }
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, loading, error };
}