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
import {
  Visibility, VisibilityOff, ArrowBackIos,
  CheckCircle, RadioButtonUnchecked,
} from "@mui/icons-material";
import { useRegister } from "../hooks/useRegister";
import { UserRegister } from "../types/userRegister";

// ── Design tokens ────────────────────────────────────────
const navy   = "#13284D";
const green  = "#059669";
const teal   = "#6ED7B4";
const gray50 = "#F8FAFC";
const gray200= "#E2E8F0";
const gray400= "#94A3B8";
const gray600= "#5B6470";

// ── Requisitos de senha ──────────────────────────────────
const SECURITY_RULES = [
  { label: "Mínimo de 8 caracteres",           test: (v: string) => v.length >= 8 },
  { label: "Pelo menos uma letra maiúscula",   test: (v: string) => /[A-Z]/.test(v) },
  { label: "Pelo menos uma letra minúscula",   test: (v: string) => /[a-z]/.test(v) },
  { label: "Pelo menos um número",             test: (v: string) => /[0-9]/.test(v) },
  { label: "Pelo menos um caractere especial", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

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
      <Box sx={{
        position: "absolute", top: "-80px", right: "-80px",
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(110,215,180,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", bottom: "-60px", left: "-60px",
        width: 240, height: 240, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(5,150,105,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <Box sx={{ position: "relative", width: 160, height: 60, zIndex: 1 }}>
        {/*<Image src="/images/logo-assinae.png" alt="Assinaê" fill style={{ objectFit: "contain", objectPosition: "left" }} priority />
      */}
      </Box>

      {/* Copy */}
      <Box sx={{ zIndex: 1 }}>
        <Typography sx={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          mb: 2,
        }}>
          Crie sua conta gratuita
        </Typography>
        <Typography sx={{
          color: "#fff",
          fontWeight: 800,
          fontSize: "2.2rem",
          lineHeight: 1.15,
          letterSpacing: "-1px",
          mb: 2,
        }}>
          Organize eventos.{" "}
          <Box component="span" sx={{
            background: `linear-gradient(90deg, ${teal}, ${green})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Emita certificados.
          </Box>
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
          Tudo que você precisa para gerenciar eventos da UEFS em um só lugar.
        </Typography>
      </Box>

      <Typography sx={{ color: "rgba(255,255,255,0.25)", fontSize: 12, zIndex: 1 }}>
        © {new Date().getFullYear()} Assinaê · UEFS
      </Typography>
    </Box>
  );
}

// ── Campo reutilizável ───────────────────────────────────
function Field({
  label, value, onChange, type = "text",
  placeholder, error, helperText, endAdornment, onBlur,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  type?: string; placeholder?: string;
  error?: boolean; helperText?: string;
  endAdornment?: React.ReactNode;
  onBlur?: () => void;
}) {
  return (
    <Box>
      <Typography sx={labelSx}>{label}</Typography>
      <FormControl fullWidth size="small" error={error}>
        <OutlinedInput
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          endAdornment={endAdornment}
          sx={inputSx(error)}
        />
        {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  );
}

// ── Botão olho ───────────────────────────────────────────
function EyeBtn({ show, toggle }: { show: boolean; toggle: () => void }) {
  return (
    <InputAdornment position="end">
      <IconButton onClick={toggle} edge="end" size="small" sx={{ color: gray400, mr: 0.5 }}>
        {show ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
      </IconButton>
    </InputAdornment>
  );
}

// ── ETAPA 1: Formulário de cadastro ──────────────────────
function StepForm({ onSubmit, loading, error }: {
  onSubmit: (data: UserRegister) => void;
  loading: boolean;
  error: string | null;
}) {
  const router = useRouter();
  const [fields, setFields] = useState({ nome: "", email: "", senha: "", confirmaSenha: "" });
  const [showSenha, setShowSenha]       = useState(false);
  const [showConfirma, setShowConfirma] = useState(false);
  const [touched, setTouched]           = useState<Record<string, boolean>>({});

  const set  = (k: string) => (v: string) => setFields((f) => ({ ...f, [k]: v }));
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));
  const err  = (k: string) => touched[k] && fields[k as keyof typeof fields].trim() === "";

  const validateEmail = (e: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e);
  const senhasDiferem = touched.confirmaSenha && fields.confirmaSenha !== "" && fields.senha !== fields.confirmaSenha;
  const isSenhaValid  = SECURITY_RULES.every((r) => r.test(fields.senha));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(fields).map((k) => [k, true])));
    if (Object.values(fields).some((v) => v.trim() === "") || senhasDiferem || !validateEmail(fields.email) || !isSenhaValid) return;
    onSubmit({ name: fields.nome, email: fields.email, password: fields.senha });
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {error && <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>}

      <Field label="Nome completo" value={fields.nome} onChange={set("nome")}
             onBlur={blur("nome")} error={err("nome")} helperText="Nome obrigatório."
             placeholder="Seu nome completo" />

      <Field label="E-mail" value={fields.email} onChange={set("email")} type="email"
             onBlur={blur("email")}
             error={err("email") || (touched.email && !validateEmail(fields.email))}
             helperText={err("email") ? "E-mail obrigatório." : "E-mail inválido."}
             placeholder="seu@email.com" />

      <Box>
        <Field label="Senha" value={fields.senha} onChange={set("senha")}
               type={showSenha ? "text" : "password"}
               onBlur={blur("senha")} error={err("senha")} helperText="Senha obrigatória."
               endAdornment={<EyeBtn show={showSenha} toggle={() => setShowSenha((p) => !p)} />} />

        {/* Requisitos de senha */}
        {touched.senha && (
          <Box sx={{
            mt: 1.5,
            p: 2,
            bgcolor: gray50,
            border: `1px solid ${gray200}`,
            borderRadius: "12px",
          }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: navy, mb: 1, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Requisitos
            </Typography>
            {SECURITY_RULES.map((rule) => {
              const valid = rule.test(fields.senha);
              return (
                <Box key={rule.label} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  {valid
                    ? <CheckCircle sx={{ fontSize: 13, color: green, flexShrink: 0 }} />
                    : <RadioButtonUnchecked sx={{ fontSize: 13, color: gray400, flexShrink: 0 }} />
                  }
                  <Typography sx={{ fontSize: 12, color: valid ? navy : gray400, lineHeight: 1.4 }}>
                    {rule.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      <Field label="Confirme a senha" value={fields.confirmaSenha} onChange={set("confirmaSenha")}
             type={showConfirma ? "text" : "password"}
             onBlur={blur("confirmaSenha")}
             error={err("confirmaSenha") || !!senhasDiferem}
             helperText={senhasDiferem ? "As senhas não coincidem." : "Obrigatório."}
             endAdornment={<EyeBtn show={showConfirma} toggle={() => setShowConfirma((p) => !p)} />} />

      <Button
        type="submit"
        fullWidth
        isLoading={loading}
        sx={{
          mt: 0.5,
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
        Criar conta
      </Button>

      {/* Já tem conta */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ flex: 1, height: "1px", bgcolor: gray200 }} />
        <Typography sx={{ fontSize: 12, color: gray400, fontWeight: 500 }}>ou</Typography>
        <Box sx={{ flex: 1, height: "1px", bgcolor: gray200 }} />
      </Box>

      <Box
        onClick={() => router.push("/login")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 1.5,
          borderRadius: "14px",
          border: `1.5px solid ${gray200}`,
          cursor: "pointer",
          transition: "0.2s ease",
          "&:hover": { borderColor: teal, bgcolor: gray50 },
        }}
      >
        <Typography sx={{ fontSize: 14, color: navy, fontWeight: 600 }}>
          Já tem conta? <Box component="span" sx={{ color: green, fontWeight: 700 }}>Fazer login</Box>
        </Typography>
      </Box>
    </Box>
  );
}

// ── ETAPA 2: Código de confirmação ───────────────────────
function StepCode({ code, setCode, onSubmit, loading, error }: {
  code: string; setCode: (v: string) => void;
  onSubmit: () => void; loading: boolean; error: string | null;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {/* Ícone */}
      <Box sx={{
        width: 56, height: 56,
        borderRadius: "18px",
        bgcolor: "#E8FFF6",
        display: "flex", alignItems: "center", justifyContent: "center",
        mb: 1,
      }}>
        <CheckCircle sx={{ fontSize: 28, color: green }} />
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: "1.7rem", color: navy, letterSpacing: "-0.5px", lineHeight: 1.1, mb: 1 }}>
          Confirme seu e-mail
        </Typography>
        <Typography sx={{ color: gray600, fontSize: 14, lineHeight: 1.7 }}>
          Enviamos um código de confirmação para o seu e-mail. Digite-o abaixo para ativar sua conta.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>}

      <Box>
        <Typography sx={labelSx}>Código de confirmação</Typography>
        <FormControl fullWidth size="small">
          <OutlinedInput
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            sx={{
              ...inputSx(),
              "& input": { fontSize: 22, letterSpacing: "0.3em", textAlign: "center", fontWeight: 700, py: "14px" },
            }}
          />
        </FormControl>
      </Box>

      <Button
        fullWidth
        onClick={onSubmit}
        disabled={loading || code.trim() === ""}
        isLoading={loading}
        sx={{
          py: 1.6,
          borderRadius: "14px",
          bgcolor: navy,
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          boxShadow: `0 8px 24px rgba(19,40,77,0.2)`,
          transition: "0.2s ease",
          "&:hover": { bgcolor: green, boxShadow: `0 8px 24px rgba(5,150,105,0.3)` },
          "&.Mui-disabled": { bgcolor: gray200, color: gray400, boxShadow: "none" },
        }}
      >
        Confirmar código
      </Button>
    </Box>
  );
}

// ── ETAPA 3: Sucesso ─────────────────────────────────────
function StepSuccess({ onAccess }: { onAccess: () => void }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Ícone de sucesso */}
      <Box sx={{
        width: 64, height: 64,
        borderRadius: "20px",
        background: `linear-gradient(135deg, ${teal}, ${green})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 12px 28px rgba(5,150,105,0.3)`,
      }}>
        <CheckCircle sx={{ fontSize: 34, color: "#fff" }} />
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: "1.8rem", color: navy, letterSpacing: "-0.5px", lineHeight: 1.1, mb: 1 }}>
          Tudo pronto!
        </Typography>
        <Typography sx={{ color: gray600, fontSize: 14, lineHeight: 1.7 }}>
          Seu e-mail foi confirmado com sucesso. Agora você pode acessar a plataforma.
        </Typography>
      </Box>

      <Button
        fullWidth
        onClick={onAccess}
        sx={{
          py: 1.6,
          borderRadius: "14px",
          background: `linear-gradient(135deg, ${navy}, #1a3a6b)`,
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          boxShadow: `0 8px 24px rgba(19,40,77,0.2)`,
          transition: "0.2s ease",
          "&:hover": { background: `linear-gradient(135deg, ${green}, #047857)`, boxShadow: `0 8px 24px rgba(5,150,105,0.3)` },
        }}
      >
        Acessar minha conta
      </Button>
    </Box>
  );
}

// ── Componente principal ─────────────────────────────────
export function RegisterForm() {
  const router = useRouter();
  const { step, isLoading, error, code, setCode, submitForm, submitCode, resetForm } = useRegister();

  const headlines: Record<string, string> = {
    form:    "Criar conta",
    code:    "",       // StepCode tem seu próprio título
    success: "",       // StepSuccess tem seu próprio título
  };

  function handleBack() {
    if (step === "form") router.back();
    if (step === "code") resetForm();
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh", bgcolor: "#fff" }}>
      <LeftPanel />

      {/* ── Painel direito ── */}
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
        overflowY: "auto",
      }}>
        {/* Botão voltar */}
        {step !== "success" && (
          <Box sx={{ position: "absolute", top: { xs: 20, md: 32 }, left: { xs: 16, md: 32 } }}>
            <IconButton
              onClick={handleBack}
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
        )}

        {/* Logo mobile */}
        <Box sx={{
          display: { xs: "flex", md: "none" },
          position: "relative",
          width: 130,
          height: 52,
          mb: 4,
          flexShrink: 0,
        }}>
          <Image src="/images/logo-assinae.png" alt="Assinaê" fill style={{ objectFit: "contain" }} priority />
        </Box>

        {/* Form container */}
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          {/* Cabeçalho da etapa form */}
          {step === "form" && (
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: 800, textAlign: "center", fontSize: "1.9rem", color: navy, letterSpacing: "-0.5px", lineHeight: 1.1, mb: 1 }}>
                {headlines[step]}
              </Typography>
              <Typography sx={{ color: gray600, fontSize: 14, textAlign: "center" }}>
                Preencha os dados abaixo para começar.
              </Typography>
            </Box>
          )}

          {step === "form"    && <StepForm    onSubmit={submitForm} loading={isLoading} error={error} />}
          {step === "code"    && <StepCode    code={code} setCode={setCode} onSubmit={submitCode} loading={isLoading} error={error} />}
          {step === "success" && <StepSuccess onAccess={() => router.push("/home")} />}
        </Box>
      </Box>
    </Box>
  );
}