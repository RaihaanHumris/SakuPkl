import { Calendar, ChevronRight, Wallet } from 'lucide-react';
import type { ActivePage, PeriodInfo } from '../types/finance';

interface HeaderProps {
  userName: string;
  pklPlace: string;
  periodInfo: PeriodInfo;
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'PK';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function Header({
  userName,
  pklPlace,
  periodInfo,
  activePage,
  onNavigate,
}: HeaderProps) {
  const initials = getInitials(userName);

  return (
    <header className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/70 px-4 pt-2.5 pb-3">
      {/* Baris Nav Atas: Brand SakuPkl & Periode PKL */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate('beranda')}
          aria-current={activePage === 'beranda' ? 'page' : undefined}
          className="inline-flex items-center gap-1.5 text-left rounded-lg py-0.5 pr-1 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Wallet className="w-3 h-3" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="text-xs font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
            SakuPkl
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('anggaran')}
          aria-label="Lihat dan atur periode PKL"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-emerald-700 py-0.5 pl-1 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
        >
          <Calendar className="w-3 h-3 text-emerald-600 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">{periodInfo.badgeLabel}</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
        </button>
      </div>

      {/* Baris Profil Personal */}
      <button
        type="button"
        onClick={() => onNavigate('anggaran')}
        aria-label="Buka profil dan pengaturan anggaran"
        className="mt-2 w-full flex items-center gap-3 text-left rounded-xl p-1 -m-1 hover:bg-slate-100/80 active:bg-slate-200/50 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <div
          className="w-9 h-9 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs"
          aria-hidden="true"
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold tracking-tight text-slate-900 leading-snug">
            Halo, {userName} 👋
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            {pklPlace ? `PKL di ${pklPlace}` : 'Dompet harian anak PKL'}
          </p>
        </div>
      </button>
    </header>
  );
}
