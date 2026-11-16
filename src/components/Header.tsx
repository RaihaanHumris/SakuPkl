import { Calendar, ChevronRight, Moon, Sun, Wallet } from 'lucide-react';
import type { ActivePage, PeriodInfo } from '../types/finance';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  periodInfo: PeriodInfo;
  activePage: ActivePage;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (page: ActivePage) => void;
}

export function Header({
  periodInfo,
  activePage,
  isDark,
  onToggleTheme,
  onNavigate,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 px-3.5 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-1.5">
        <button
          type="button"
          onClick={() => onNavigate('beranda')}
          aria-current={activePage === 'beranda' ? 'page' : undefined}
          className="inline-flex items-center gap-1.5 text-left rounded-xl py-1 pr-1 shrink-0 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Wallet className="w-3.5 h-3.5" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            SakuPkl
          </span>
        </button>

        <div className="flex items-center gap-1.5 min-w-0 shrink-0">
          <PWAInstallButton variant="compact" />

          <button
            type="button"
            onClick={() => onNavigate('anggaran')}
            aria-label="Lihat dan atur periode PKL"
            className="min-h-[40px] px-2 sm:px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-[0.97] transition-all flex items-center gap-1 shrink-0 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Calendar
              className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap">{periodInfo.badgeLabel}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
            aria-pressed={isDark}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all shrink-0 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {isDark ? (
              <Sun className="w-4 h-4" strokeWidth={2.2} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
