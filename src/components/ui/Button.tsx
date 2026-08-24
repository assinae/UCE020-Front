'use client';

import React, { ElementType } from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
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
  const baseStyles =
    'normal-case font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]';

  return (
    <MuiButton
      variant={variant}
      color={color}
      disabled={disabled || isLoading}
      startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : leftIcon}
      endIcon={!isLoading ? rightIcon : undefined}
      className={cn(baseStyles, className)}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;