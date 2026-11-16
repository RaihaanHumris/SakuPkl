import { BarChart2, Home, Plus, ReceiptText, Wallet } from 'lucide-react';
import type { ActivePage } from '../types/finance';

interface BottomNavProps {
  activePage: ActivePage;
  onChangePage: (page: ActivePage) => void;
  onOpenAddModal: () => void;
}

export function BottomNav({
  activePage,
  onChangePage,
  onOpenAddModal,
}: BottomNavProps) {
  const navBtnClass = (isActive: boolean) =>
    `relative z-10 min-h-[50px] w-full flex flex-col items-center justify-center gap-0.5 rounded-xl cursor-pointer select-none transition-all duration-150 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
      isActive
        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/90 dark:bg-emerald-950/50'
        : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
    }`;

  const renderActiveBar = (isActive: boolean) =>
    isActive ? (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
      />
    ) : null;

  return (
    <nav
      aria-label="Navigasi Utama"
      className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-md z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] transition-colors"
    >
      <div className="grid grid-cols-5 items-center gap-1 h-14">
        <button
          type="button"
          onClick={() => onChangePage('beranda')}
          aria-current={activePage === 'beranda' ? 'page' : undefined}
          className={navBtnClass(activePage === 'beranda')}
        >
          {renderActiveBar(activePage === 'beranda')}
          <Home
            className="w-5 h-5 pointer-events-none"
            strokeWidth={activePage === 'beranda' ? 2.4 : 2}
          />
          <span
            className={`text-[11px] tracking-tight whitespace-nowrap pointer-events-none ${
              activePage === 'beranda' ? 'font-bold' : 'font-semibold'
            }`}
          >
            Beranda
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChangePage('riwayat')}
          aria-current={activePage === 'riwayat' ? 'page' : undefined}
          className={navBtnClass(activePage === 'riwayat')}
        >
          {renderActiveBar(activePage === 'riwayat')}
          <ReceiptText
            className="w-5 h-5 pointer-events-none"
            strokeWidth={activePage === 'riwayat' ? 2.4 : 2}
          />
          <span
            className={`text-[11px] tracking-tight whitespace-nowrap pointer-events-none ${
              activePage === 'riwayat' ? 'font-bold' : 'font-semibold'
            }`}
          >
            Riwayat
          </span>
        </button>

        {/* Center Ergonomic Thumb-Zone FAB (+) */}
        <div className="flex items-center justify-center pointer-events-none relative z-20">
          <button
            type="button"
            onClick={onOpenAddModal}
            aria-label="Tambah transaksi baru"
            className="pointer-events-auto cursor-pointer w-13 h-13 -mt-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center active:scale-95 transition-all duration-150 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            <Plus className="w-7 h-7 pointer-events-none" strokeWidth={2.5} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onChangePage('statistik')}
          aria-current={activePage === 'statistik' ? 'page' : undefined}
          className={navBtnClass(activePage === 'statistik')}
        >
          {renderActiveBar(activePage === 'statistik')}
          <BarChart2
            className="w-5 h-5 pointer-events-none"
            strokeWidth={activePage === 'statistik' ? 2.4 : 2}
          />
          <span
            className={`text-[11px] tracking-tight whitespace-nowrap pointer-events-none ${
              activePage === 'statistik' ? 'font-bold' : 'font-semibold'
            }`}
          >
            Statistik
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChangePage('anggaran')}
          aria-current={activePage === 'anggaran' ? 'page' : undefined}
          className={navBtnClass(activePage === 'anggaran')}
        >
          {renderActiveBar(activePage === 'anggaran')}
          <Wallet
            className="w-5 h-5 pointer-events-none"
            strokeWidth={activePage === 'anggaran' ? 2.4 : 2}
          />
          <span
            className={`text-[11px] tracking-tight whitespace-nowrap pointer-events-none ${
              activePage === 'anggaran' ? 'font-bold' : 'font-semibold'
            }`}
          >
            Anggaran
          </span>
        </button>
      </div>
    </nav>
  );
}
