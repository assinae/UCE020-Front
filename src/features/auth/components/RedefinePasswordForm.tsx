"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  FormHelperText,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import { Button } from "@/components/ui/Button";
import { Visibility, VisibilityOff, ArrowBackIos, CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { useRedefinePassword, validate, SECURITY_RULES } from "../hooks/useRedefinePassword";

export function RedefinePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleRedefine, loading, error, success } = useRedefinePassword();

  const [novaSenha, setNovaSenha]       = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [showNova, setShowNova]         = useState(false);
  const [showRepetir, setShowRepetir]   = useState(false);

  const [touched, setTouched] = useState({
    novaSenha: false,
    repetirSenha: false,
  });

  const errors = touched.novaSenha || touched.repetirSenha
    ? validate({ novaSenha, repetirSenha })
    : {};

  const novaSenhaError    = touched.novaSenha    && !!errors.novaSenha;
  const repetirSenhaError = touched.repetirSenha && !!errors.repetirSenha;
  const showSecurityTips = novaSenhaError;

  function onSubmit(e: React.FormEvent) {
    const token = searchParams.get("token") || "";
    e.preventDefault();
    setTouched({ novaSenha: true, repetirSenha: true });
    const validationErrors = validate({ novaSenha, repetirSenha });
    if (Object.keys(validationErrors).length > 0) return;
    handleRedefine({ novaSenha, repetirSenha }, token);
  }

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: { xs: "#fff", sm: "#e8eaf0" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: { xs: "flex-start", sm: "center" },
        px: { xs: 0, sm: 2 },
        py: { xs: 0, sm: 4 },
      }}
    >
      {/* ── Card ── */}
      <Box
        sx={{
          mx: "auto",
          mt: { xs: 0, sm: 3 },
          mb: { xs: 0, sm: 4 },
          width: "100%",
          maxWidth: { xs: "100%", sm: 420 },
          minHeight: { xs: "100dvh", sm: "auto" },
          bgcolor: "#fff",
          borderRadius: { xs: 0, sm: 4 },
          px: { xs: 3, sm: 3 },
          py: { xs: 5, sm: 4 },
          boxShadow: { xs: "none", sm: "0 4px 24px rgba(0,0,0,0.08)" },
        }}
      >
        <IconButton
          onClick={() => router.back()}
          size="small"
          sx={{ mb: 1, ml: -1, color: "#1a2744" }}
        >
          <ArrowBackIos fontSize="small" />
        </IconButton>

        {/* Título */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#1a2744", whiteSpace: "nowrap" }}>
            Recuperar Senha
          </Typography>
          <Box sx={{ flex: 1, height: "1.5px", bgcolor: "#d0d5dd" }} />
        </Box>

        {/* Erro global da API */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Sucesso */}
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            Senha redefinida com sucesso! Redirecionando…
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit} noValidate>

          {/* ── Nova senha ── */}
          <Typography sx={labelSx}>Digite sua nova senha</Typography>
          <FormControl fullWidth size="small" error={novaSenhaError}>
            <OutlinedInput
              type={showNova ? "text" : "password"}
              placeholder="••••••••"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, novaSenha: true }))}
              sx={inputSx(novaSenhaError)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNova((p) => !p)}
                    edge="end"
                    size="small"
                    sx={{ color: "#aaa" }}
                  >
                    {showNova ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {novaSenhaError && (
              <FormHelperText>{errors.novaSenha}</FormHelperText>
            )}
          </FormControl>

          {/* ── Dicas de segurança ── */}
          {showSecurityTips && (
            <Box
              sx={{
                mt: 1.5, mb: 1,
                p: 1.5,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1a2744", mb: 0.75 }}>
                Dicas de segurança:
              </Typography>
              {SECURITY_RULES.map((rule) => {
                const valid = rule.test(novaSenha);
                return (
                  <Box key={rule.label} sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, mb: 0.5 }}>
                    {valid
                      ? <CheckCircle sx={{ fontSize: 14, color: "#3dd6c8", mt: "1px", flexShrink: 0 }} />
                      : <RadioButtonUnchecked sx={{ fontSize: 14, color: "#cbd5e1", mt: "1px", flexShrink: 0 }} />
                    }
                    <Typography sx={{ fontSize: 12, color: valid ? "#1a2744" : "#94a3b8", lineHeight: 1.4 }}>
                      {rule.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* ── Repetir senha ── */}
          <Typography sx={{ ...labelSx, mt: 2.5 }}>Repita sua nova senha</Typography>
          <FormControl fullWidth size="small" error={repetirSenhaError}>
            <OutlinedInput
              type={showRepetir ? "text" : "password"}
              placeholder="••••••••"
              value={repetirSenha}
              onChange={(e) => setRepetirSenha(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, repetirSenha: true }))}
              sx={inputSx(repetirSenhaError)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowRepetir((p) => !p)}
                    edge="end"
                    size="small"
                    sx={{ color: "#aaa" }}
                  >
                    {showRepetir ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {repetirSenhaError && (
              <FormHelperText>{errors.repetirSenha}</FormHelperText>
            )}
          </FormControl>

          {/* ── Alterar ── */}
          <Button
            type="submit"
            fullWidth
            isLoading={loading}
            disabled={loading || success}
            sx={{
              mt: 3,
              py: 1.4,
              borderRadius: 50,
              bgcolor: "#1a2744",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              textTransform: "none",
              "&:hover": { bgcolor: "#243460" },
              "&.Mui-disabled": { bgcolor: "#a0aec0", color: "#fff" },
            }}
          >
            Alterar Senha
          </Button>

        </Box>
      </Box>
    </Box>
  );
}

// ── Estilos reutilizáveis ─────────────────────────────────
const labelSx = {
  fontSize: 13,
  fontWeight: 600,
  color: "#1a2744",
  mb: 0.5,
};

const inputSx = (hasError: boolean) => ({
  borderRadius: 2,
  bgcolor: "#fff",
  "& fieldset": { borderColor: hasError ? "#d32f2f" : "#d0d5dd" },
  "&:hover fieldset": { borderColor: hasError ? "#d32f2f" : "#3dd6c8" },
  "&.Mui-focused fieldset": { borderColor: hasError ? "#d32f2f" : "#3dd6c8" },
  "& input": { fontSize: 14 },
});