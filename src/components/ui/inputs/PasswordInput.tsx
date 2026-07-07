"use client";

import { useState } from "react";
import type { PasswordInputProps } from "@/types/inputs";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function PasswordInput({
  value,
  onChange,
  variant = "outlined",
  fullWidth = true,
  size = "small",
  showVisibilityToggle = true,
  slotProps,
  id,
  label,
  helperText,
  error,
  disabled,
  required,
  autoComplete = "current-password",
  name,
  sx,
  ...props
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputId = id ?? name ?? "password-input";

  return (
    <TextField
      {...props}
      id={inputId}
      name={name}
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      variant={variant}
      color="secondary"
      type={isPasswordVisible ? "text" : "password"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      fullWidth={fullWidth}
      size={size}
      sx={[
        {
          "& input::-ms-reveal, & input::-ms-clear": {
            display: "none",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      slotProps={{
        ...slotProps,
        ...(showVisibilityToggle
          ? {
              input: {
                ...slotProps?.input,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => setIsPasswordVisible((current) => !current)}
                      edge="end"
                      size="small"
                    >
                      {isPasswordVisible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }
          : {}),
      }}
    />
  );
}

