/* eslint-disable @next/next/no-img-element */
import type { EventCardProps } from "@/types/event";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

function formatDateRange(start: string, end: string): string {
  const fmt = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return `${fmt(start)} a ${fmt(end)}`;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pendente: { bg: "#F1F2F6", color: "#667085", label: "Pendente" },
  iniciada: { bg: "#E6F7F0", color: "#2EC4A0", label: "Iniciada" },
  andamento: { bg: "#E8EDFB", color: "#253B68", label: "Andamento" },
  finalizada: { bg: "#EAF7EE", color: "#35A384", label: "Finalizada" },
};

export function EventCard({ event, onClick }: EventCardProps) {
  const imageSrc = event.foto || "/images/certificadoVariacao2.png";
  const statusKey = (event.status || "").toLowerCase();
  const statusStyle = STATUS_STYLES[statusKey] || {
    bg: "#F1F2F6",
    color: "#667085",
    label: event.status,
  };

  return (
    <button
      type="button"
      onClick={() => onClick?.(event)}
      className="group w-full text-left flex items-center gap-4 bg-white rounded-[22px] px-5 py-4 border border-black/[0.03] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative w-[78px] h-[78px] flex-shrink-0 rounded-2xl overflow-hidden bg-[#f0faf7]">
        <img
          src={imageSrc}
          alt={event.nome}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-[#0F1D35] text-[15px] leading-snug group-hover:text-[#2EC4A0] transition-colors line-clamp-1">
            {event.nome}
          </h3>
          <span
            className="shrink-0 text-[11px] font-semibold px-2 py-[3px] rounded-full whitespace-nowrap"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
          >
            {statusStyle.label}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-1.5 text-[12.5px] text-gray-500">
            <CalendarMonthOutlinedIcon sx={{ fontSize: 15, color: "#9AA4B2" }} />
            {formatDateRange(event.dataInicio, event.dataFim)}
          </p>
          <p className="flex items-center gap-1.5 text-[12.5px] text-gray-500 min-w-0">
            <LocationOnOutlinedIcon sx={{ fontSize: 15, color: "#9AA4B2" }} />
            <span className="truncate">{event.localizacao || "A definir"}</span>
          </p>
          <p className="flex items-center gap-1.5 text-[12.5px] text-gray-500">
            <AccessTimeOutlinedIcon sx={{ fontSize: 15, color: "#9AA4B2" }} />
            {event.cargaHoraria}h
          </p>
        </div>
      </div>
    </button>
  );
}