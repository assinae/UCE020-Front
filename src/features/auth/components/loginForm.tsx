"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Box, Typography, IconButton,
  InputAdornment, Alert,
  FormControl, OutlinedInput, FormHelperText,
} from "@mui/material";
import { Button } from "@/components/ui/Button";
import { Visibility, VisibilityOff, ArrowBackIos } from "@mui/icons-material";
import { useLogin } from "../hooks/useLogin";

// ── Design tokens ────────────────────────────────────────
const navy   = "#13284D";
const green  = "#059669";
const teal   = "#6ED7B4";
const gray50 = "#F8FAFC";
const gray200= "#E2E8F0";
const gray400= "#94A3B8";
const gray600= "#5B6470";

const inputSx = (hasError = false) => ({
  borderRadius: "14px",
  bgcolor: gray50,
  "& fieldset": { borderColor: hasError ? "#EF4444" : gray200, borderWidth: "1.5px" },
  "&:hover fieldset": { borderColor: hasError ? "#EF4444" : teal },
  "&.Mui-focused fieldset": { borderColor: hasError ? "#EF4444" : teal, borderWidth: "2px" },
  "& input": { fontSize: 14, py: "13px", px: "16px" },
  "& input::placeholder": { color: gray400, opacity: 1 },
});

const labelSx = {
  fontSize: 12,
  fontWeight: 700,
  color: navy,
  mb: 0.75,
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
};

// ── Painel esquerdo (só desktop) ─────────────────────────
function LeftPanel() {
  return (
    <Box sx={{
      display: { xs: "none", md: "flex" },
      flexDirection: "column",
      justifyContent: "space-between",
      width: "44%",
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${navy} 0%, #0D1E3B 100%)`,
      px: 7,
      py: 6,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Orbs decorativos */}
      <Box sx={{
        position: "absolute", top: "-80px", right: "-80px",
        width: 320, height: 320, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(110,215,180,0.12) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", bottom: "-60px", left: "-60px",
        width: 240, height: 240, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(5,150,105,0.10) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <Box sx={{ position: "relative", width: 160, height: 60, zIndex: 1 }}>
        {/*<Image src="/images/logo-assinae.png" alt="Assinaê" fill style={{ objectFit: "contain", objectPosition: "left" }} priority />
      */}
      </Box>

      {/* Copy central */}
      <Box sx={{ zIndex: 1 }}>
        <Typography sx={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          mb: 2,
        }}>
          Gestão de eventos universitários da UEFS
        </Typography>
        <Typography sx={{
          color: "#fff",
          fontWeight: 800,
          fontSize: "2.4rem",
          lineHeight: 1.15,
          letterSpacing: "-1px",
          mb: 2,
        }}>
          Da presença ao certificado em{" "}
          <Box component="span" sx={{
            background: `linear-gradient(90deg, ${teal}, ${green})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            segundos.
          </Box>
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
          Controle de presença via QR Code, carga horária automática e certificados sem burocracia.
        </Typography>
      </Box>

      {/* Rodapé */}
      <Typography sx={{ color: "rgba(255,255,255,0.25)", fontSize: 12, zIndex: 1 }}>
        © {new Date().getFullYear()} Assinaê · UEFS
      </Typography>
    </Box>
  );
}

// ── Componente principal ─────────────────────────────────
export function LoginForm() {
  const router = useRouter();
  const { handleLogin, loading, error } = useLogin();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched]   = useState({ email: false, password: false });

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailEmpty   = touched.email    && email.trim() === "";
  const emailInvalid = touched.email    && email.trim() !== "" && !EMAIL_REGEX.test(email.trim());
  const emailError   = emailEmpty || emailInvalid;
  const passwordError = touched.password && password.trim() === "";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!email.trim() || !EMAIL_REGEX.test(email.trim()) || !password.trim()) return;
    handleLogin({ email, password });
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh", bgcolor: "#fff" }}>
      <LeftPanel />

      {/* ── Painel direito (form) ── */}
      <Box sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 3, sm: 6, md: 8 },
        py: { xs: 5, md: 6 },
        bgcolor: "#fff",
        position: "relative",
      }}>
        {/* Botão voltar */}
        <Box sx={{ position: "absolute", top: { xs: 20, md: 32 }, left: { xs: 16, md: 32 } }}>
          <IconButton
            onClick={() => router.back()}
            size="small"
            sx={{
              color: gray600,
              backgroundColor: gray50,
              border: `1px solid ${gray200}`,
              "&:hover": { backgroundColor: gray200 },
            }}
          >
            <ArrowBackIos fontSize="small" sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>

        {/* Logo mobile */}
        <Box sx={{
          display: { xs: "flex", md: "none" },
          position: "relative",
          width: 130,
          height: 52,
          mb: 5,
        }}>
          <Image src="/images/logo-assinae.png" alt="Assinaê" fill style={{ objectFit: "contain" }} priority />
        </Box>

        {/* Form container */}
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          {/* Cabeçalho */}
          <Box sx={{ mb: 5 }}>
            <Typography sx={{ fontWeight: 800, textAlign: "center", fontSize: "1.9rem", color: navy, letterSpacing: "-0.5px", lineHeight: 1.1, mb: 1 }}>
              Seja Bem-vindo
            </Typography>
            <Typography sx={{ color: gray600, fontSize: 14, textAlign: "center" }}>
              Entre na sua conta para continuar.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>{error}</Alert>
          )}

          <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* E-mail */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={labelSx}>E-mail</Typography>
              <FormControl fullWidth size="small" error={emailError}>
                <OutlinedInput
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  sx={inputSx(emailError)}
                />
                {emailEmpty   && <FormHelperText>E-mail obrigatório.</FormHelperText>}
                {emailInvalid && <FormHelperText>E-mail inválido.</FormHelperText>}
              </FormControl>
            </Box>

            {/* Senha */}
            <Box sx={{ mb: 1 }}>
              <Typography sx={labelSx}>Senha</Typography>
              <FormControl fullWidth size="small" error={passwordError}>
                <OutlinedInput
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  sx={inputSx(passwordError)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass((p) => !p)} edge="end" size="small" sx={{ color: gray400, mr: 0.5 }}>
                        {showPass ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {passwordError && <FormHelperText>Senha obrigatória.</FormHelperText>}
              </FormControl>
            </Box>

            {/* Esqueceu senha */}
            <Box sx={{ textAlign: "right", mb: 3.5 }}>
              <Typography
                component="span"
                onClick={() => router.push("/forgot-password")}
                sx={{ fontSize: 13, color: navy, fontWeight: 600, cursor: "pointer", "&:hover": { color: green } }}
              >
                Esqueceu a senha?
              </Typography>
            </Box>

            {/* Botão */}
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              sx={{
                py: 1.6,
                borderRadius: "14px",
                bgcolor: navy,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.01em",
                boxShadow: `0 8px 24px rgba(19,40,77,0.2)`,
                transition: "0.2s ease",
                "&:hover": { bgcolor: green, boxShadow: `0 8px 24px rgba(5,150,105,0.3)` },
                "&.Mui-disabled": { bgcolor: gray200, color: gray400, boxShadow: "none" },
              }}
            >
              Entrar
            </Button>

            {/* Divider */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3.5 }}>
              <Box sx={{ flex: 1, height: "1px", bgcolor: gray200 }} />
              <Typography sx={{ fontSize: 12, color: gray400, fontWeight: 500 }}>ou</Typography>
              <Box sx={{ flex: 1, height: "1px", bgcolor: gray200 }} />
            </Box>

            {/* Criar conta */}
            <Box
              onClick={() => router.push("/register")}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                py: 1.5,
                borderRadius: "14px",
                border: `1.5px solid ${gray200}`,
                cursor: "pointer",
                transition: "0.2s ease",
                "&:hover": { borderColor: teal, bgcolor: gray50 },
              }}
            >
              <Typography sx={{ fontSize: 14, color: navy, fontWeight: 600 }}>
                Primeiro acesso? <Box component="span" sx={{ color: green, fontWeight: 700 }}>Criar conta</Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}