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
    `min-h-[48px] w-full flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
      isActive
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
    }`;

  return (
    <nav
      aria-label="Navigasi Utama"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 pb-[env(safe-area-inset-bottom)] transition-colors"
    >
      <div className="grid grid-cols-5 items-center h-16">
        <button
          type="button"
          onClick={() => onChangePage('beranda')}
          aria-current={activePage === 'beranda' ? 'page' : undefined}
          className={navBtnClass(activePage === 'beranda')}
        >
          <Home className="w-5 h-5" strokeWidth={activePage === 'beranda' ? 2.4 : 2} />
          <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
            Beranda
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChangePage('riwayat')}
          aria-current={activePage === 'riwayat' ? 'page' : undefined}
          className={navBtnClass(activePage === 'riwayat')}
        >
          <ReceiptText
            className="w-5 h-5"
            strokeWidth={activePage === 'riwayat' ? 2.4 : 2}
          />
          <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
            Riwayat
          </span>
        </button>

        {/* Center Ergonomic Thumb-Zone FAB (+) */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenAddModal}
            aria-label="Tambah transaksi baru"
            className="w-13 h-13 -mt-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center active:scale-95 transition-all duration-150 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            <Plus className="w-7 h-7" strokeWidth={2.5} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onChangePage('statistik')}
          aria-current={activePage === 'statistik' ? 'page' : undefined}
          className={navBtnClass(activePage === 'statistik')}
        >
          <BarChart2
            className="w-5 h-5"
            strokeWidth={activePage === 'statistik' ? 2.4 : 2}
          />
          <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
            Statistik
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChangePage('anggaran')}
          aria-current={activePage === 'anggaran' ? 'page' : undefined}
          className={navBtnClass(activePage === 'anggaran')}
        >
          <Wallet
            className="w-5 h-5"
            strokeWidth={activePage === 'anggaran' ? 2.4 : 2}
          />
          <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
            Anggaran
          </span>
        </button>
      </div>
    </nav>
  );
}
