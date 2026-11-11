import type { SvgIconComponent } from '@mui/icons-material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';

export type QuickActionTone = 'mint' | 'navy' | 'forest' | 'light';

export interface QuickAction {
  label: string;
  href: string;
  tone: QuickActionTone;
  icon: SvgIconComponent;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Criar novo evento', href: '/event/register', tone: 'mint', icon: AddRoundedIcon },
  {
    label: 'Meus certificados',
    href: '/certificate/list',
    tone: 'navy',
    icon: WorkspacePremiumOutlinedIcon,
  },
  { label: 'Meus eventos', href: '/event/list', tone: 'forest', icon: CalendarMonthOutlinedIcon },
  {
    label: 'Monitoria de eventos',
    href: '/monitoring/list',
    tone: 'light',
    icon: AssignmentTurnedInOutlinedIcon,
  },
];
