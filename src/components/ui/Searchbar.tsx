import { Paper, InputBase } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Search } from "@mui/icons-material";

interface SearchbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
}

export function Searchbar({ value, onChange, placeholder = "Pesquise o código do seu evento", sx }: SearchbarProps) {
  return (
    <Paper
      elevation={0}
      sx={[
        {
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2.25,
          py: 1.25,
          borderRadius: 50,
          bgcolor: "#FFF",
          mt: 1,
          border: "1px solid rgba(15, 29, 53, 0.06)",
          boxShadow: "0 4px 14px rgba(15, 29, 53, 0.06)",
          transition: "border-color .2s ease, box-shadow .2s ease",

          "&:focus-within": {
            borderColor: "#2EC4A0",
            boxShadow: "0 4px 16px rgba(46, 196, 160, 0.18)",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Search sx={{ color: "#2EC4A0", fontSize: 20 }} />
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        inputProps={{ "aria-label": placeholder }}
        sx={{
          fontSize: 14.5,
          fontWeight: 300,
          color: "#0F1D35",
          "& input::placeholder": {
            color: "#98A2B3",
            opacity: 1,
          },
        }}
      />
    </Paper>
  );
}

export default Searchbar;