"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Typography, Button, IconButton,
  InputAdornment, Alert,
  FormControl, OutlinedInput, FormHelperText,
} from "@mui/material";
import { ArrowBackIos, MailOutlined } from "@mui/icons-material";
import { useForgotPassword } from "../hooks/useForgotPassword";

// ── Estilos reutilizáveis (mesmos do RegisterForm) ───────
const labelSx = { fontSize: 12, fontWeight: 600, color: "#1a2744", mb: 0.5 };

const inputSx = (hasError = false) => ({
  borderRadius: 2,
  bgcolor: "#fff",
  fontSize: 13,
  "& fieldset": { borderColor: hasError ? "#d32f2f" : "#d0d5dd" },
  "&:hover fieldset": { borderColor: hasError ? "#d32f2f" : "#3dd6c8" },
  "&.Mui-focused fieldset": { borderColor: hasError ? "#d32f2f" : "#3dd6c8" },
});

const btnSx = (bg: string, hover: string) => ({
  mt: 1, py: 1.4, borderRadius: 50,
  bgcolor: bg, color: "#fff",
  fontWeight: 700, fontSize: 15,
  textTransform: "none",
  "&:hover": { bgcolor: hover },
  "&.Mui-disabled": { bgcolor: "#ccc", color: "#fff" },
});

// ── Logo central grande ──────────────────────────────────
function BigLogo() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
      <Box
        component="img"
        src="/images/logos/logo1.png"
        alt="Logo"
        sx={{ 
          height: 80, 
          width: "auto",
          objectFit: "contain" // Prevents the image from stretching weirdly
        }}
      />
    </Box>
  );
}

// ── ETAPA 1: Formulário de e-mail ────────────────────────
function StepForm({ email, setEmail, onSubmit, loading, error }: {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}) {
  const [touched, setTouched] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmpty    = touched && email.trim() === "";
  const isInvalid  = touched && email.trim() !== "" && !EMAIL_REGEX.test(email.trim());
  const hasError   = isEmpty || isInvalid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) return;
    onSubmit();
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <BigLogo />

      <Typography sx={{
        textAlign: "center", color: "#555", fontSize: 13,
        lineHeight: 1.6, mb: 3, px: 1,
      }}>
        Para redefinir sua senha, informe o e-mail cadastrado e
        lhe enviaremos um link com as instruções
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Typography sx={labelSx}>E-mail Cadastrado</Typography>
      <FormControl fullWidth size="small" error={hasError} sx={{ mb: 2 }}>
        <OutlinedInput
          type="email"
          placeholder="exemplo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          endAdornment={
            <InputAdornment position="end">
              <MailOutlined sx={{ fontSize: 18, color: "#aaa" }} />
            </InputAdornment>
          }
          sx={inputSx(hasError)}
        />
        {isEmpty   && <FormHelperText>Informe seu e-mail.</FormHelperText>}
        {isInvalid && <FormHelperText>Digite um e-mail válido.</FormHelperText>}
      </FormControl>

      <Button type="submit" fullWidth disabled={loading} sx={btnSx("#1a2744", "#111c33")}>
        Enviar
      </Button>
    </Box>
  );
}

// ── ETAPA 2: Confirmação de envio ────────────────────────
function StepSuccess({ email, onBack }: { email: string; onBack: () => void }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <BigLogo />

      <Typography sx={{ color: "#1a2744", fontWeight: 700, fontSize: 16, mb: 1 }}>
        E-mail enviado!
      </Typography>

      <Typography sx={{ color: "#555", fontSize: 13, lineHeight: 1.6, mb: 4, px: 1 }}>
        Enviamos as instruções de recuperação para{" "}
        <Box component="span" sx={{ color: "#3dd6c8", fontWeight: 600 }}>{email}</Box>.
        Verifique sua caixa de entrada.
      </Typography>

      <Button fullWidth onClick={onBack} sx={btnSx("#1a2744", "#111c33")}>
        Voltar ao Login
      </Button>
    </Box>
  );
}

// ── Componente principal ─────────────────────────────────
export function ForgotPasswordForm() {
  const router = useRouter();
  const { step, loading, error, email, setEmail, submitEmail, reset } = useForgotPassword();

  function handleBack() {
    if (step === "success") {
      reset();
    } else {
      router.back();
    }
  }

  return (
    <Box sx={{
      minHeight: "100dvh",
      bgcolor: { xs: "#fff", sm: "#e8eaf0" },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: { xs: "flex-start", sm: "center" },
      px: { xs: 0, sm: 2 },
      py: { xs: 0, sm: 4 },
    }}>
      {/* Card */}
      <Box sx={{
        mx: "auto",
        mt: { xs: 0, sm: 3 },
        mb: { xs: 0, sm: 4 },
        width: "100%",
        maxWidth: { xs: "100%", sm: 440 },
        minHeight: { xs: "100dvh", sm: "auto" },
        bgcolor: "#fff",
        borderRadius: { xs: 0, sm: 4 },
        px: { xs: 3, sm: 3 },
        py: { xs: 5, sm: 3 },
        boxShadow: { xs: "none", sm: "0 4px 24px rgba(0,0,0,0.08)" },
      }}>
        <IconButton onClick={handleBack} size="small" sx={{ mb: 1, ml: -1, color: "#1a2744" }}>
          <ArrowBackIos fontSize="small" />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#1a2744", whiteSpace: "nowrap" }}>
            Recuperar Senha
          </Typography>
          <Box sx={{ flex: 1, height: "1.5px", bgcolor: "#d0d5dd" }} />
        </Box>

        {step === "form" && (
          <StepForm
            email={email}
            setEmail={setEmail}
            onSubmit={submitEmail}
            loading={loading}
            error={error}
          />
        )}

        {step === "success" && (
          <StepSuccess email={email} onBack={() => router.push("/login")} />
        )}
      </Box>
    </Box>
  );
}