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
          sx: {
            whiteSpace: 'normal',
            lineHeight: 1.4,
            minHeight: 56,
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            textOverflow: 'clip',
            '& .MuiSelect-select': {
              whiteSpace: 'normal',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
            },
          },
          MenuProps: {
            slotProps: {
              paper: {
                sx: {
                  mt: 1,
                  borderRadius: 3,
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  boxShadow: '0 18px 36px rgba(15, 23, 42, 0.14)',
                  overflow: 'hidden',
                },
              },
              list: {
                sx: {
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                },
              },
            },
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
        <MenuItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          sx={{
            whiteSpace: 'normal',
            lineHeight: 1.45,
            py: 1.25,
            px: 1.5,
            mb: 0.5,
            borderRadius: 2,
            border: '1px solid transparent',
            backgroundColor: 'transparent',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            '&:last-of-type': { mb: 0 },
            '&:hover': {
              backgroundColor: 'rgba(0, 137, 99, 0.04)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(0, 137, 99, 0.08)',
              borderColor: 'rgba(0, 137, 99, 0.18)',
              color: 'text.primary',
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'rgba(0, 137, 99, 0.12)',
            },
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

