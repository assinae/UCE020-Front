"use client";

import type { ChangeEventHandler } from "react";
import type { SelectInputProps } from "@/types/inputs";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  label,
  fullWidth = true,
  size = "small",
  variant = "outlined",
  error = false,
  slotProps,
  ...props
}: SelectInputProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    onChange(String(event.target.value));
  };

  return (
    <TextField
      {...props}
      select
      color="secondary"
      label={label}
      variant={variant}
      value={value}
      onChange={handleChange}
      fullWidth={fullWidth}
      size={size}
      error={error}
      slotProps={{
        ...slotProps,
        inputLabel: { ...slotProps?.inputLabel, shrink: true },
        select: {
          ...slotProps?.select,
          displayEmpty: Boolean(placeholder),
          renderValue: (selected) => {
            if (selected === '' && placeholder) return placeholder;
            const found = options.find((o) => o.value === String(selected));
            return found ? found.label : String(selected);
          },
        },
      }}
    >
      {placeholder ? (
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
      ) : null}
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

