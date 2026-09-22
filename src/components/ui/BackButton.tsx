'use client';

import { IconButton, type IconButtonProps } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useRouter } from 'next/navigation';
import { useNavigationHistory } from '@/providers/navigation-history-provider';

interface BackButtonProps extends Omit<IconButtonProps, 'onClick' | 'aria-label'> {
  fallbackHref: string;
  iconVariant?: 'rounded' | 'compact';
}

export function BackButton({ fallbackHref, iconVariant = 'rounded', ...props }: BackButtonProps) {
  const router = useRouter();
  const { canGoBack } = useNavigationHistory();

  function handleClick() {
    if (canGoBack) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <IconButton onClick={handleClick} aria-label="Voltar" {...props}>
      {iconVariant === 'compact' ? (
        <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
      ) : (
        <ArrowBackRoundedIcon />
      )}
    </IconButton>
  );
}
