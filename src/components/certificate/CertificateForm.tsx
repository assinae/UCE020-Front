import { Box, Typography, Card } from "@mui/material";
import TextInput from "@/components/ui/inputs/TextInput";
import type { EditCertificateFormData } from "@/types/certificate";

interface CertificateFormProps {
  formData: EditCertificateFormData;
  onFieldChange: (field: keyof EditCertificateFormData, value: string | number) => void;
  certificateImageUrl?: string;
}

export function CertificateForm({
  formData,
  onFieldChange,
  certificateImageUrl,
}: CertificateFormProps) {
  return (
    <Box>
      {/* Preview do Certificado */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          bgcolor: "#FAFAFA",
        }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16/10",
            bgcolor: "#F5F5F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            border: "1px solid #E0E0E0",
          }}
        >
          {certificateImageUrl ? (
            <Box
              component="img"
              src={certificateImageUrl}
              alt="Preview do certificado"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                px: 2,
              }}
            >
              Preview do certificado
            </Typography>
          )}
        </Box>
      </Card>

      {/* Formulário */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Campo Título */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "text.secondary",
              mb: 1,
            }}
          >
            Título
          </Typography>
          <TextInput
            value={formData.title}
            onChange={(value) => onFieldChange("title", value)}
            placeholder="Digite o título do certificado"
            fullWidth
          />
        </Box>

        {/* Campo Nome do Participante */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "text.secondary",
              mb: 1,
            }}
          >
            Nome do Participante
          </Typography>
          <TextInput
            value={formData.participantName}
            onChange={(value) => onFieldChange("participantName", value)}
            placeholder="Digite o nome do participante"
            fullWidth
          />
        </Box>

        {/* Campo Carga Horária */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "text.secondary",
              mb: 1,
            }}
          >
            Carga Horária
          </Typography>
          <TextInput
            value={formData.hours.toString()}
            onChange={(value) => onFieldChange("hours", value)}
            placeholder="Digite a carga horária em horas"
            type="number"
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
}
