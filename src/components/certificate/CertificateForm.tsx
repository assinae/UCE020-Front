import { Box, Typography, Card, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TextInput from "@/components/ui/inputs/TextInput";
import type { EditCertificateFormData } from "@/types/certificate";
import { CERTIFICATE_TEXT_LIMITS } from '@/lib/certificateTextLimits';

function FieldLabelWithHelp({ label, helpText }: { label: string; helpText: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
        {label} <Box component="span" sx={{ color: 'error.main' }} aria-hidden="true">*</Box>
      </Typography>
      <Tooltip title={helpText} arrow placement="top">
        <IconButton size="small" sx={{ p: 0.25, color: 'text.secondary' }}>
          <InfoOutlinedIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

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
          <FieldLabelWithHelp
            label="Título"
            helpText="Título exibido no certificado"
          />
          <TextInput
            value={formData.title}
            onChange={(value) => onFieldChange("title", value)}
            slotProps={{ htmlInput: { maxLength: CERTIFICATE_TEXT_LIMITS.titulo } }}
            aria-required="true"
            error={!formData.title.trim()}
            helperText={!formData.title.trim() ? "Título é obrigatório." : undefined}
            placeholder="Digite o título do certificado"
            fullWidth
          />
        </Box>

        {/* Campo Nome do Participante */}
        <Box>
          <FieldLabelWithHelp
            label="Nome do Participante"
            helpText="Nome exibido no certificado"
          />
          <TextInput
            value={formData.participantName}
            onChange={(value) => onFieldChange("participantName", value)}
            slotProps={{ htmlInput: { maxLength: CERTIFICATE_TEXT_LIMITS.nomeParticipante } }}
            aria-required="true"
            error={!formData.participantName.trim()}
            helperText={!formData.participantName.trim() ? "Nome do participante é obrigatório." : undefined}
            placeholder="Digite o nome do participante"
            fullWidth
          />
        </Box>

        {/* Campo Carga Horária */}
        <Box>
          <FieldLabelWithHelp
            label="Carga Horária"
            helpText="Carga horária exibida no certificado"
          />
          <TextInput
            value={formData.hours.toString()}
            onChange={(value) => onFieldChange("hours", value)}
            placeholder="Digite a carga horária em horas"
            type="number"
            aria-required="true"
            error={formData.hours <= 0}
            helperText={formData.hours <= 0 ? "Informe uma carga horária maior que zero." : undefined}
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
}
