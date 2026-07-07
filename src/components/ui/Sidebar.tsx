"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  /** Ícone opcional — passe um SVG ou elemento React */
  icon?: React.ReactNode;
}

interface User {
  name: string;
}

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  user: User;
  onLogout: () => void;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar({ open, onClose, navLinks, user, onLogout }: SidebarProps) {
  const pathname = usePathname();

  // Impede scroll no body enquanto aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Fecha ao pressionar Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/50
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Painel */}
      <aside
        aria-label="Menu lateral"
        aria-hidden={!open}
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-[#101828] flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Cabeçalho do painel */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          {/* Logo dentro do sidebar */}
          <Link href="/" onClick={onClose} aria-label="Ir para a página inicial">
            <Image
              src={"/logo.svg"}
              alt="Logo"
              width={32}
              height={32}
            />
          </Link>

          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Links de navegação */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-[14px] font-medium transition-colors
                  ${isActive
                    ? "bg-[#2EC4A0]/20 text-[#2EC4A0]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {link.icon && (
                  <span className="w-5 h-5 flex-shrink-0" aria-hidden="true">
                    {link.icon}
                  </span>
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé: info do usuário + sair */}
        <div className="border-t border-white/10 px-4 py-4">
          <Link
            href="/user-profile"
            onClick={onClose}
            className="flex items-center gap-3 mb-3 rounded-lg p-2 hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-[#2EC4A0] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2EC4A0" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <span className="text-white text-[13px] font-medium truncate">
              {user.name}
            </span>
          </Link>

          <button
            onClick={() => { onClose(); onLogout(); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;