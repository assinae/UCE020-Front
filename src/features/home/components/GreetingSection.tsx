import { Typography, Box } from "@mui/material";

interface GreetingSectionProps {
  userName: string;
}

export function GreetingSection({ userName }: GreetingSectionProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 2,
      }}
    >
      

      <Box>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: "#667085",
            letterSpacing: "0.02em",
            mb: 0.25,
          }}
        >
          Olá, {userName}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#0F1D35",
            lineHeight: 1.25,
            fontSize: { xs: 20, sm: 23 },
          }}
        >
          O que vamos fazer{" "}
          <Box component="span" sx={{ color: "#2EC4A0" }}>
            hoje?
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}