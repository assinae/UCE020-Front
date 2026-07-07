import { Button } from '@/components/ui';
import { colorTokens } from '@/lib/colors';

interface ValidatePresencesButtonProps {
  onClick: () => void;
}

export function ValidatePresencesButton({ onClick }: ValidatePresencesButtonProps) {
  return (
    <Button
      variant="contained"
      fullWidth
      onClick={onClick}
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
