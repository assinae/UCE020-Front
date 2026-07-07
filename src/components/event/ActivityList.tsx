"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { FormatListBulleted, ChevronRight } from "@mui/icons-material";
import type { Activity } from "@/types/activity";

interface ActivityListProps {
  activities: Activity[];
  onSelectActivity?: (activity: Activity) => void;
}

export function ActivityList({
  activities,
  onSelectActivity,
}: ActivityListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleSelect(activity: Activity) {
    setSelectedId(activity.id);
    onSelectActivity?.(activity);
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* Título */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <FormatListBulleted sx={{ fontSize: 18, color: "#1a2744" }} />
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#0f172a",
          }}
        >
          Atividades do Evento
        </Typography>
      </Box>

      {/* Lista ou estado vazio */}
      {activities.length === 0 ? (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#ef4444",
              lineHeight: 1.6,
            }}
          >
            Sem atividades
            <br />
            cadastradas no momento.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ backgroundColor: "#f4f6f9", borderRadius: "14px", p: 1.5 }}>
          <List disablePadding>
            {activities.map((activity) => (
              <ListItem key={activity.id} disablePadding>
                <ListItemButton
                  onClick={() => handleSelect(activity)}
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: "#ffffff",
                    border:
                      selectedId === activity.id
                        ? "1.5px solid #7c3aed"
                        : "1px solid rgba(0,0,0,0.08)",
                    mb: 1,
                    px: 2,
                    py: 1.5,
                    transition: "all 0.15s",
                    "&:hover": {
                      backgroundColor: "#f4f6f9",
                      transform: "translateY(-1px)",
                    },
                    "&:active": { transform: "translateY(0)" },
                  }}
                >
                  <ListItemText
                    primary={activity.name}
                    slotProps={{
                      primary: {
                        sx: {
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          color: "#0f172a",
                        },
                      },
                    }}
                  />
                  <ChevronRight sx={{ color: "#64748b", fontSize: 20 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default ActivityList;