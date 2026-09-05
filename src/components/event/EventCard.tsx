/* eslint-disable @next/next/no-img-element */
import type { EventCardProps } from "@/types/event";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { formatBahiaDate } from "@/utils/date";

function formatDateRange(start: string, end: string): string {
  const fmt = (date: string) => formatBahiaDate(date);

  return `${fmt(start)} a ${fmt(end)}`;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pendente: { bg: "#F1F2F6", color: "#667085", label: "Pendente" },
  iniciada: { bg: "#E6F7F0", color: "#2EC4A0", label: "Iniciada" },
  andamento: { bg: "#E8EDFB", color: "#253B68", label: "Andamento" },
  finalizada: { bg: "#EAF7EE", color: "#35A384", label: "Finalizada" },
};

export function EventCard({ event, onClick }: EventCardProps) {
  const initial = (event.nome || "?").trim().charAt(0).toUpperCase();
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
      className="group h-full w-full max-w-full overflow-hidden text-left flex items-center gap-3 sm:gap-4 bg-white rounded-2xl sm:rounded-[22px] p-3.5 sm:px-5 sm:py-4 border border-black/[0.03] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative w-16 h-16 sm:w-[78px] sm:h-[78px] shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-[#f0faf7]">
        {event.foto ? (
          <img
            src={event.foto}
            alt={event.nome}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#E6F7F0] text-[#2EC4A0] font-bold text-2xl sm:text-3xl select-none">
            {initial}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1 mb-1.5">
          <h3 className="min-w-0 flex-1 basis-[8rem] font-bold text-[#0F1D35] text-[14px] sm:text-[15px] leading-snug group-hover:text-[#2EC4A0] transition-colors break-words line-clamp-2">
            {event.nome}
          </h3>
          <span
            className="shrink-0 text-[10.5px] sm:text-[11px] font-semibold px-2 py-[3px] rounded-full whitespace-nowrap"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
          >
            {statusStyle.label}
          </span>
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <p className="flex items-center gap-1.5 text-[11.5px] sm:text-[12.5px] text-gray-500 min-w-0">
            <CalendarMonthOutlinedIcon sx={{ fontSize: 15, color: "#9AA4B2", flexShrink: 0 }} />
            <span className="truncate">{formatDateRange(event.dataInicio, event.dataFim)}</span>
          </p>
          <p className="flex items-center gap-1.5 text-[11.5px] sm:text-[12.5px] text-gray-500 min-w-0">
            <LocationOnOutlinedIcon sx={{ fontSize: 15, color: "#9AA4B2", flexShrink: 0 }} />
            <span className="truncate">{event.localizacao || "A definir"}</span>
          </p>
          <p className="flex items-center gap-1.5 text-[11.5px] sm:text-[12.5px] text-gray-500 min-w-0">
            <AccessTimeOutlinedIcon sx={{ fontSize: 15, color: "#9AA4B2", flexShrink: 0 }} />
            <span className="truncate">{event.cargaHoraria}h</span>
          </p>
        </div>
      </div>
    </button>
  );
}
