import { Box } from '@mui/material';
import { QUICK_ACTIONS, QuickActionCard } from '@/components/navigation';

// No mobile as ações rápidas vivem no menu da barra inferior, por isso a grade some abaixo de md.
export function QuickActions() {
  return (
    <Box
      component="section"
      aria-label="Ações rápidas"
      className="animate-fade-up motion-reduce:animate-none"
      style={{ animationDelay: '0.08s' }}
      sx={{
        display: { xs: 'none', md: 'grid' },
        gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))',
        gap: '18px',
      }}
    >
      {QUICK_ACTIONS.map((action) => (
        <QuickActionCard key={action.href} action={action} />
      ))}
    </Box>
  );
}
