"use client";

import type { TextInputProps } from "@/types/inputs";
import TextField from "@mui/material/TextField";

export default function TextInput({
  value,
  onChange,
  variant = "outlined",
  error = false,
  fullWidth = true,
  size = "small",
  ...props
}: TextInputProps) {
  return (
    <TextField
      {...props}
      variant={variant}
      color="secondary"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      fullWidth={fullWidth}
      size={size}
      error={error}
    />
  );
}

