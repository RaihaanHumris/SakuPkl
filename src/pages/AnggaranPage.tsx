import {
  Building2,
  Download,
  Eraser,
  Moon,
  RotateCcw,
  Save,
  Sun,
  User,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { ALLOWANCE_PRESETS, DURATION_PRESETS } from '../data/seedData';
import type { BudgetSettings, PeriodInfo } from '../types/finance';
import {
  formatCompactRupiah,
  formatReadableDate,
  formatRupiah,
  formatThousandsInput,
  getLocalDateString,
  parseThousandsInput,
} from '../utils/format';
import { confirmDialog } from '../utils/notify';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface AnggaranPageProps {
  budget: BudgetSettings;
  periodInfo: PeriodInfo;
  transactionCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onSaveBudget: (nextBudget: BudgetSettings) => void;
  onStartFromZero: (customBudget?: Partial<BudgetSettings>) => void;
  onResetToDemo: () => void;
  onExportCsv: () => void;
}

export function AnggaranPage({
  budget,
  periodInfo,
  transactionCount,
  isDark,
  onToggleTheme,
  onSaveBudget,
  onStartFromZero,
  onResetToDemo,
  onExportCsv,
}: AnggaranPageProps) {
  const [userName, setUserName] = useState(budget.userName);
  const [pklPlace, setPklPlace] = useState(budget.pklPlace);
  const [allowanceInput, setAllowanceInput] = useState(
    budget.totalAllowance.toLocaleString('id-ID')
  );
  const [durationInput, setDurationInput] = useState(String(budget.durationDays));
  const [startDate, setStartDate] = useState(budget.startDate);

  useEffect(() => {
    setUserName(budget.userName);
    setPklPlace(budget.pklPlace);
    setAllowanceInput(budget.totalAllowance.toLocaleString('id-ID'));
    setDurationInput(String(budget.durationDays));
    setStartDate(budget.startDate);
  }, [budget]);

  const parsedAllowance = parseThousandsInput(allowanceInput);
  const parsedDuration = Math.max(1, parseInt(durationInput, 10) || 1);
  const estimatedDaily = Math.floor(parsedAllowance / parsedDuration);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSaveBudget({
      userName: userName.trim() || 'Muhammad Raihaan Humris',
      pklPlace: pklPlace.trim(),
      totalAllowance: parsedAllowance,
      durationDays: parsedDuration,
      startDate: startDate || getLocalDateString(),
    });
  };

  const handleConfirmStartFromZero = async () => {
    const confirmed = await confirmDialog({
      title: 'Mulai dari Nol?',
      text: 'Semua catatan transaksi akan dikosongkan dan periode PKL dimulai dari hari ke-1 hari ini.',
      confirmText: 'Ya, Mulai dari Nol',
      icon: 'warning',
      danger: true,
    });

    if (confirmed) {
      onStartFromZero({
        userName: userName.trim() || 'Muhammad Raihaan Humris',
        pklPlace: pklPlace.trim(),
        totalAllowance: parsedAllowance,
        durationDays: parsedDuration,
        startDate: getLocalDateString(),
      });
    }
  };

  const handleConfirmResetDemo = async () => {
    const confirmed = await confirmDialog({
      title: 'Muat Data Contoh PKL?',
      text: 'Transaksi saat ini akan diganti dengan data contoh PKL (hari ke-12 dari 30).',
      confirmText: 'Ya, Muat Demo',
      icon: 'question',
      danger: false,
    });

    if (confirmed) {
      onResetToDemo();
    }
  };

  return (
    <div className="space-y-4">
      <div className="px-0.5 pt-1">
        <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Anggaran & Data
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Sesuaikan profil, uang saku, tema aplikasi, atau mulai dari nol
        </p>
      </div>

      <PWAInstallButton variant="card" />

      {/* Pengaturan Tema (Dark Mode Toggle) */}
      <section
        aria-label="Tampilan Aplikasi"
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 flex items-center justify-center shrink-0">
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Mode Tampilan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {isDark ? 'Mode Gelap aktif' : 'Mode Terang aktif'}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          onClick={onToggleTheme}
          className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 touch-manipulation ${
            isDark ? 'bg-emerald-600' : 'bg-slate-200'
          }`}
        >
          <span className="sr-only">Aktifkan mode gelap</span>
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition duration-200 ${
              isDark ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </section>

      {/* Form Profil & Anggaran PKL */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 space-y-4"
      >
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Profil & Uang Saku PKL
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Atur total anggaran dan durasi PKL agar batas harianmu akurat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="cfg-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Nama Lengkap / Panggilan
            </label>
            <div className="relative">
              <User
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="cfg-name"
                type="text"
                maxLength={50}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Muhammad Raihaan Humris"
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="cfg-place"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Tempat PKL (Opsional)
            </label>
            <div className="relative">
              <Building2
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="cfg-place"
                type="text"
                maxLength={32}
                value={pklPlace}
                onChange={(e) => setPklPlace(e.target.value)}
                placeholder="PT Maju Jaya"
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Total Uang Saku PKL */}
        <div>
          <label
            htmlFor="cfg-allowance"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Total Uang Saku PKL
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
              Rp
            </span>
            <input
              id="cfg-allowance"
              type="text"
              inputMode="numeric"
              value={allowanceInput}
              onChange={(e) => setAllowanceInput(formatThousandsInput(e.target.value))}
              placeholder="1.500.000"
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-extrabold text-slate-900 dark:text-slate-100 tabular-nums focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {ALLOWANCE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAllowanceInput(preset.toLocaleString('id-ID'))}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 transition-all touch-manipulation ${
                  parsedAllowance === preset
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                }`}
              >
                Rp {formatCompactRupiah(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Durasi & Tanggal Mulai */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="cfg-duration"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Durasi PKL (Hari)
            </label>
            <input
              id="cfg-duration"
              type="number"
              inputMode="numeric"
              min={1}
              max={365}
              value={durationInput}
              onChange={(e) => setDurationInput(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="cfg-start"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Tanggal Mulai
            </label>
            <input
              id="cfg-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Preset Durasi */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {DURATION_PRESETS.map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setDurationInput(String(days))}
              className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 transition-all touch-manipulation ${
                parsedDuration === days
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700'
              }`}
            >
              {days} hari
            </button>
          ))}
        </div>

        {/* Preview Target & Tanggal Selesai */}
        <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 px-3.5 py-3 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-emerald-800 dark:text-emerald-300 font-medium">
              Target batas awal/hari
            </span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {formatRupiah(estimatedDaily)}/hari
            </span>
          </div>
          <div className="flex items-center justify-between text-emerald-800/80 dark:text-emerald-300/80">
            <span>Estimasi selesai PKL</span>
            <span className="font-semibold tabular-nums">
              {formatReadableDate(periodInfo.endDate)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-bold text-white inline-flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Pengaturan</span>
        </button>
      </form>

      {/* Kelola Data & Mulai Dari Nol */}
      <section
        aria-label="Kelola Data Keuangan"
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 space-y-3"
      >
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Kelola Data & Reset
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Saat ini tersimpan {transactionCount} transaksi di perangkat ini.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportCsv}
          disabled={transactionCount === 0}
          className="w-full min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors touch-manipulation"
        >
          <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span>Unduh Backup CSV</span>
        </button>

        <div className="grid grid-cols-1 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleConfirmStartFromZero}
            className="w-full min-h-[44px] px-4 rounded-xl border border-rose-200 dark:border-rose-900/70 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center justify-center gap-2 transition-colors touch-manipulation"
          >
            <Eraser className="w-4 h-4" />
            <span>Mulai dari Nol (Kosongkan Transaksi)</span>
          </button>

          <button
            type="button"
            onClick={handleConfirmResetDemo}
            className="w-full min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Muat Data Contoh (Demo PKL)</span>
          </button>
        </div>
      </section>
    </div>
  );
}
