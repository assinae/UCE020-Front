'use client';

import React, { ElementType } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* Utilitário para fundir classes Tailwind sem conflitos */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends Omit<MuiButtonProps, 'color'> {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  component?: ElementType;
}

export const Button = ({
  children,
  variant = 'contained',
  color = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  
  const baseStyles = "normal-case font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]";

  return (
    <MuiButton
      disableElevation
      variant={variant}
      color={color}
      disabled={disabled || isLoading}
      className={cn(baseStyles, className)}
      // Renderiza o ícone de loading ou o ícone enviado via prop
      startIcon={
        isLoading ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          leftIcon
        )
      }
      endIcon={!isLoading && rightIcon}
      {...props}
    >
      <span className={isLoading ? 'opacity-70' : 'opacity-100'}>
        {children}
      </span>
    </MuiButton>
  );
};

export default Button;
