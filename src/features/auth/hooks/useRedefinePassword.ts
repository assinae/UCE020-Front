"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export interface RedefinePasswordFormData {
  novaSenha: string;
  repetirSenha: string;
}

export interface RedefinePasswordErrors {
  novaSenha?: string;
  repetirSenha?: string;
}

export const SECURITY_RULES = [
  {
    // Mínimo de 8 caracteres
    test: (v: string) => v.length >= 8,
    label: "Mínimo de 8 caracteres",
  },
  {
    // Pelo menos uma letra maiúscula
    test: (v: string) => /[A-Z]/.test(v),
    label: "Pelo menos uma letra maiúscula",
  },
  {
    // Pelo menos uma letra minúscula
    test: (v: string) => /[a-z]/.test(v),
    label: "Pelo menos uma letra minúscula",
  },
  {
    // Pelo menos um número
    test: (v: string) => /[0-9]/.test(v),
    label: "Pelo menos um número",
  },
  {
    // Pelo menos um caractere especial
    test: (v: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(v),
    label: "Pelo menos um caractere especial",
  },
];

export function validate(
  data: RedefinePasswordFormData
): RedefinePasswordErrors {
  const errors: RedefinePasswordErrors = {};

  if (!data.novaSenha.trim()) {
    errors.novaSenha = "A senha é obrigatória.";
  } else if (data.novaSenha.length < 8) {
    errors.novaSenha = "A senha deve ter pelo menos 8 caracteres.";
  } else if (
    !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(data.novaSenha)
  ) {
    errors.novaSenha = "Inclua pelo menos um caractere especial (!,@,#…).";
  }

  if (!data.repetirSenha.trim()) {
    errors.repetirSenha = "Confirme sua senha.";
  } else if (data.novaSenha !== data.repetirSenha) {
    errors.repetirSenha = "As senhas não coincidem.";
  }

  return errors;
}

export function useRedefinePassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleRedefine(data: RedefinePasswordFormData, token: string) {
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(token, data.novaSenha);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Não foi possível redefinir a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return { handleRedefine, loading, error, success };
}