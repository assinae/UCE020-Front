"use client";

import { useState } from "react";
import { authService } from "@/services/authService";
export type ForgotStep = "form" | "success";

export function useForgotPassword() {
  const [step, setStep]       = useState<ForgotStep>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [email, setEmail]     = useState("");

  async function submitEmail() {
    if (!email.trim()) {
      setError("Informe o e-mail cadastrado.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword({ email });
      setStep("success");
    } catch {
      setError("Não foi possível enviar o e-mail. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("form");
    setEmail("");
    setError(null);
  }

  return { step, loading, error, email, setEmail, submitEmail, reset };
}