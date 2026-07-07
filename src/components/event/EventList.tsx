"use client";

import { Box, FormControl, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Event } from '@/types/event';
import { EventCard } from '@/components/event/EventCard';
import { Searchbar } from '@/components/ui/Searchbar';
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const statusOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'iniciada', label: 'Iniciada' },
  { value: 'andamento', label: 'Andamento' },
  { value: 'finalizada', label: 'Finalizada' },
];

interface EventListProps {
  events: Event[];
  title?: string;
  home?: boolean;
  noEventsMessage?: string;
  onEventClick?: (event: Event) => void;
}

export function EventList({
  events,
  title = 'EVENTOS INSCRITOS',
  noEventsMessage = 'Nenhum evento encontrado.',
  home = true,
  onEventClick,

}: EventListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedStatus = statusFilter.toLowerCase();

    return events.filter((event) =>
      event.nome.toLowerCase().includes(normalizedSearch)
      && (normalizedStatus === 'todos' || event.status.toLowerCase() === normalizedStatus)
    );
  }, [events, searchTerm, statusFilter]);
  const handleEventClick = (event: Event) => {
    if (onEventClick) {
      onEventClick(event);
      return;
    }

    router.push(`/event/${event.id}`);
  };

  if(home) {
     return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 3 }}>
          <Box sx={{ width: 4, height: 16, borderRadius: 4, bgcolor: '#2EC4A0' }} />
          <Typography
            sx={{
              fontSize: 14,
              color: '#0F1D35',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            {title}
          </Typography>
        </Box>

        {events.length === 0 ? (
          <Typography sx={{ fontSize: 14, color: 'text.secondary', py: 4, textAlign: 'center' }}>
            {noEventsMessage}
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 2,
              width: '100%',
              px: { xs: 1.5, md: 0 },
            }}
          >
            {events.map((event) => (
              <Box key={event.id}>
                <EventCard event={event} onClick={handleEventClick} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );

  } else {
     return (
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: { xs: 2.25, md: 3 },
            mb: 3.5,
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => router.back()}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": { bgcolor: "background.default" },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box sx={{ width: 4, height: 22, borderRadius: 4, bgcolor: '#2EC4A0' }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                {title}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) 180px' },
              gap: { xs: 1.25, sm: 1.5 },
              width: { xs: '100%', md: 520 },
            }}
          >
            <Box sx={{ minWidth: 0, width: '100%' }}>
              <Searchbar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Pesquisar evento"
                sx={{
                  mt: 0,
                  minHeight: 48,
                  boxShadow: '0 1px 2px rgba(15, 29, 53, 0.08)',
                  '& .MuiInputBase-input': {
                    color: '#0F1D35',
                    fontWeight: 500,
                    '&::placeholder': {
                      color: '#667085',
                      opacity: 1,
                    },
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#2EC4A0',
                  },
                }}
              />
            </Box>

            <FormControl sx={{ width: '100%' }}>
              <Select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                displayEmpty
                size="small"
                sx={{
                  bgcolor: '#FFF',
                  borderRadius: 50,
                  minHeight: 48,
                  color: '#0F1D35',
                  fontWeight: 600,
                  boxShadow: '0 1px 2px rgba(15, 29, 53, 0.08)',
                  '&:hover': {
                    bgcolor: '#F8FAFC',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiSelect-select': {
                    py: 1.25,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                  },
                  '& .MuiSelect-icon': {
                    color: '#2EC4A0',
                  },
                }}
                MenuProps={{
                  slotProps: {
                    paper: {
                      sx: {
                        bgcolor: '#F9FAFB',
                        color: '#F9FAFB',
                        borderRadius: 2,
                        mt: 1,
                        boxShadow: '0 14px 34px rgba(15, 29, 53, 0.22)',
                        overflow: 'hidden',
                        '& .MuiMenuItem-root': {
                          fontSize: 15,
                          fontWeight: 500,
                          minHeight: 42,
                          px: 1.5,
                          color: '#101828',
                        },
                        '& .MuiMenuItem-root:hover': {
                          bgcolor: '#FFFFFF',
                        },
                        '& .Mui-selected': {
                          bgcolor: '#344054',
                          color: '#FFFFFF',
                        },
                        '& .Mui-selected:hover': {
                          bgcolor: '#3D4A5C',
                        },
                      },
                    },
                  },
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box
                      component="span"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: 2,
                      }}
                    >
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {events.length === 0 ? (
          <Typography sx={{ fontSize: 14, color: 'text.secondary', py: 4, textAlign: 'center' }}>
            {noEventsMessage}
          </Typography>
        ) : filteredEvents.length === 0 ? (
          <Typography sx={{ fontSize: 14, color: 'text.secondary', py: 4, textAlign: 'center' }}>
            Nenhum evento encontrado para esse filtro.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 2,
              width: '100%',
              px: { xs: 1.5, md: 0 },
            }}
          >
            {filteredEvents.map((event) => (
              <Box key={event.id}>
                <EventCard event={event} onClick={handleEventClick} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  }
 
}