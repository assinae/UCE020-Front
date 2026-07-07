"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import { CertificateCard } from "@/components/certificate";
import { Searchbar } from "@/components/ui/Searchbar";
import { MOCK_CERTIFICATES } from "@/mocks/certificates";

const periodOptions = [
  { value: "todos", label: "Todos" },
  { value: "mes", label: "Este mês" },
  { value: "ano", label: "Este ano" },
  { value: "anteriores", label: "Anos anteriores" },
];

export default function CertificatesPage() {
  const router = useRouter();
  const [certificates] = useState(MOCK_CERTIFICATES);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("todos");

  const filteredCertificates = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const now = new Date();

    return certificates.filter((certificate) => {
      const issuedDate = new Date(certificate.issuedDate);
      const matchesSearch = certificate.title.toLowerCase().includes(normalizedSearch);
      const matchesPeriod =
        periodFilter === "todos" ||
        (periodFilter === "mes" &&
          issuedDate.getMonth() === now.getMonth() &&
          issuedDate.getFullYear() === now.getFullYear()) ||
        (periodFilter === "ano" && issuedDate.getFullYear() === now.getFullYear()) ||
        (periodFilter === "anteriores" && issuedDate.getFullYear() < now.getFullYear());

      return matchesSearch && matchesPeriod;
    });
  }, [certificates, searchTerm, periodFilter]);

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <Container sx={{ py: { xs: 3, md: 4 } }}>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box sx={{ width: 4, height: 22, borderRadius: 4, bgcolor: "#2EC4A0" }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                Certificados
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) 180px" },
              gap: { xs: 1.25, sm: 1.5 },
              width: { xs: "100%", md: 520 },
            }}
          >
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Searchbar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Pesquisar certificado"
                sx={{
                  mt: 0,
                  minHeight: 48,
                  boxShadow: "0 1px 2px rgba(15, 29, 53, 0.08)",
                  "& .MuiInputBase-input": {
                    color: "#0F1D35",
                    fontWeight: 500,
                    "&::placeholder": {
                      color: "#667085",
                      opacity: 1,
                    },
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#2EC4A0",
                  },
                }}
              />
            </Box>

            <FormControl sx={{ width: "100%" }}>
              <Select
                value={periodFilter}
                onChange={(event) => setPeriodFilter(event.target.value)}
                displayEmpty
                size="small"
                sx={{
                  bgcolor: "#FFF",
                  borderRadius: 50,
                  minHeight: 48,
                  color: "#0F1D35",
                  fontWeight: 600,
                  boxShadow: "0 1px 2px rgba(15, 29, 53, 0.08)",
                  "&:hover": {
                    bgcolor: "#F8FAFC",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-select": {
                    py: 1.25,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiSelect-icon": {
                    color: "#2EC4A0",
                  },
                }}
                MenuProps={{
                  slotProps: {
                    paper: {
                      sx: {
                        bgcolor: "#F9FAFB",
                        color: "#F9FAFB",
                        borderRadius: 2,
                        mt: 1,
                        boxShadow: "0 14px 34px rgba(15, 29, 53, 0.22)",
                        overflow: "hidden",
                        "& .MuiMenuItem-root": {
                          fontSize: 15,
                          fontWeight: 500,
                          minHeight: 42,
                          px: 1.5,
                          color: "#101828",
                        },
                        "& .MuiMenuItem-root:hover": {
                          bgcolor: "#FFFFFF",
                        },
                        "& .Mui-selected": {
                          bgcolor: "#344054",
                          color: "#FFFFFF",
                        },
                        "& .Mui-selected:hover": {
                          bgcolor: "#3D4A5C",
                        },
                      },
                    },
                  },
                }}
              >
                {periodOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box
                      component="span"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
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

        {certificates.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            Você ainda não tem certificados criados
          </Typography>
        ) : filteredCertificates.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            Nenhum certificado encontrado para esse filtro.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
              width: "100%",
              px: { xs: 1.5, md: 0 },
            }}
          >
            {filteredCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                id={cert.id}
                title={cert.title}
                issuedDate={cert.issuedDate}
                location={cert.location}
                hours={cert.hours}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
