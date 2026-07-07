'use client';

import { Box, Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { formatDate } from "@/utils/format";
import type {ActivityDetailProps} from "@/types/activity"

export default function ActivityDetail({ title, date, location }: ActivityDetailProps) {

    const displayActivityDate = (() => {
        if (!date) return "Data não informada";

        try {
            return formatDate(date);
        } catch {
            return "Data indisponível";
        }
    })();

  return (
    <Box
        sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-start',
            mb: 2,
        }}
    >
        <Box
            sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            }}
        >
            <CalendarTodayOutlinedIcon sx={{ fontSize: 30, color: 'text.secondary' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 12, color: 'text.primary', mb: 0.5 }}>
                {title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                {displayActivityDate}
            </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                {location}
            </Typography>
            </Box>
        </Box>
    </Box>
  );
}
