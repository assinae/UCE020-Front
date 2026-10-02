import { Button } from '@/components/ui';
import { colorTokens } from '@/lib/colors';

interface ValidatePresencesButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function ValidatePresencesButton({ onClick, disabled = false }: ValidatePresencesButtonProps) {
  return (
    <Button
      variant="contained"
      fullWidth
      onClick={onClick}
      disabled={disabled}
      sx={{
        bgcolor: colorTokens.navigation.default,
        color: colorTokens.text.inverse,
        fontWeight: 600,
        fontSize: 14,
        '&:hover': { bgcolor: colorTokens.navigation.hover },
      }}
    >
      Validar presenças
    </Button>
  );
}
