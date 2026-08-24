import { Box, Typography } from '@mui/material';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { formatActivityDate } from '@/utils/format';
import type { ScheduleDetailsProps } from '@/types/scheduleCard';
import { LabelChip } from '@/components';

const labelSx = {
  fontSize: { xs: 13, sm: 12.5 },
  fontWeight: 500,
  color: 'text.primary',
  lineHeight: 1.3,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const iconWrapSx = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  flexShrink: 0,
  borderRadius: '9px',
  bgcolor: 'rgba(0, 137, 99, 0.10)',
};

const iconSx = {
  fontSize: 17,
  color: 'secondary.main',
};

const detailRowSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.25,
  minWidth: 0,
};

export default function ScheduleDetails({
  startDate,
  endDate,
  location,
  hours,
  participantsCount,
  status,
  fullWidth = false,
}: ScheduleDetailsProps) {
  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : { xs: '100%', sm: '50%' },
        aspectRatio: fullWidth ? 'auto' : { xs: 'auto', sm: '1/1' },
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          minWidth: 0,
          px: { xs: 0, sm: 1 },
          gap: { xs: 1.75, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: { xs: 'grid', sm: 'flex' },
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'none' },
            flexDirection: { sm: 'column' },
            gap: { xs: 1.25, sm: 1.5 },
            mt: { xs: 0, sm: 0.5 },
          }}
        >
          <Box sx={{ ...detailRowSx, gridColumn: { xs: '1 / -1', sm: 'auto' } }}>
            <Box sx={iconWrapSx}>
              <CalendarTodayRoundedIcon sx={iconSx} />
            </Box>
            <Typography sx={labelSx}>{formatActivityDate(startDate, endDate)}</Typography>
          </Box>

          <Box sx={{ ...detailRowSx, gridColumn: { xs: '1 / -1', sm: 'auto' } }}>
            <Box sx={iconWrapSx}>
              <PlaceOutlinedIcon sx={iconSx} />
            </Box>
            <Typography sx={labelSx}>{location}</Typography>
          </Box>

          <Box sx={detailRowSx}>
            <Box sx={iconWrapSx}>
              <AccessTimeOutlinedIcon sx={iconSx} />
            </Box>
            <Typography sx={labelSx}>
              <Box component="span" sx={{ fontWeight: 700 }}>
                {hours}
              </Box>{' '}
              horas
            </Typography>
          </Box>

          <Box sx={detailRowSx}>
            <Box sx={iconWrapSx}>
              <PersonOutlineOutlinedIcon sx={iconSx} />
            </Box>
            <Typography sx={labelSx}>
              <Box component="span" sx={{ fontWeight: 700 }}>
                {participantsCount}
              </Box>{' '}
              {Number(participantsCount) === 1 ? 'inscrito' : 'inscritos'}
            </Typography>
          </Box>
        </Box>

        <LabelChip status={status} />
      </Box>
    </Box>
  );
}
