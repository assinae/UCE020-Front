'use client';

import { Box, Typography, IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { LabelChip } from '@/components/modals/label-chip';
import { colorTokens } from '@/lib/colors';
import { managementIconButtonSx, managementListNameSx, managementListRowSx } from './listRowStyles';

interface StaffListRowProps {
  name: string;
  role: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function StaffListRow({ name, role, onEdit, onDelete }: StaffListRowProps) {
  return (
    <Box sx={managementListRowSx}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={managementListNameSx}>{name}</Typography>
      </Box>

      <LabelChip status={role} />
      
      <IconButton onClick={onEdit} aria-label={`Editar ${name}`} sx={managementIconButtonSx}>
        <EditOutlinedIcon sx={{ fontSize: 20, color: colorTokens.navigation.default }} />
      </IconButton>

      <IconButton onClick={onDelete} aria-label={`Remover ${name}`} sx={managementIconButtonSx}>
        <DeleteOutlineOutlinedIcon sx={{ fontSize: 20, color: colorTokens.navigation.default }} />
      </IconButton>
    </Box>
  );
}
