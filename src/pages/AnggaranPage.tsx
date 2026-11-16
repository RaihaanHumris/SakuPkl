import {
  Building2,
  Download,
  Eraser,
  RotateCcw,
  Save,
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

interface AnggaranPageProps {
  budget: BudgetSettings;
  periodInfo: PeriodInfo;
  transactionCount: number;
  onSaveBudget: (nextBudget: BudgetSettings) => void;
  onStartFromZero: (customBudget?: Partial<BudgetSettings>) => void;
  onResetToDemo: () => void;
  onExportCsv: () => void;
}

export function AnggaranPage({
  budget,
  periodInfo,
  transactionCount,
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
        <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
          Anggaran & Data
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Sesuaikan profil, uang saku, periode PKL, atau mulai dari nol
        </p>
      </div>

      {/* Form Profil & Anggaran PKL */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-4"
      >
        <div>
          <h2 className="text-sm font-bold text-slate-900">Profil & Uang Saku PKL</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur total anggaran dan durasi PKL agar batas harianmu akurat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="cfg-name"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
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
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="cfg-place"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
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
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Total Uang Saku PKL */}
        <div>
          <label
            htmlFor="cfg-allowance"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
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
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-lg font-extrabold text-slate-900 tabular-nums focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
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
              className="block text-xs font-semibold text-slate-700 mb-1.5"
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
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 tabular-nums focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="cfg-start"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Tanggal Mulai
            </label>
            <input
              id="cfg-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 tabular-nums focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              {days} hari
            </button>
          ))}
        </div>

        {/* Preview Target & Tanggal Selesai */}
        <div className="rounded-xl bg-emerald-50/70 px-3.5 py-3 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-emerald-800 font-medium">Target batas awal/hari</span>
            <span className="font-bold text-emerald-700 tabular-nums">
              {formatRupiah(estimatedDaily)}/hari
            </span>
          </div>
          <div className="flex items-center justify-between text-emerald-800/80">
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
        className="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-3"
      >
        <div>
          <h2 className="text-sm font-bold text-slate-900">Kelola Data & Reset</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Saat ini tersimpan {transactionCount} transaksi di perangkat ini.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportCsv}
          disabled={transactionCount === 0}
          className="w-full min-h-[44px] px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-xs font-semibold text-slate-800 flex items-center justify-center gap-2 transition-colors touch-manipulation"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Unduh Backup CSV</span>
        </button>

        <div className="grid grid-cols-1 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleConfirmStartFromZero}
            className="w-full min-h-[44px] px-4 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-50 text-xs font-semibold text-rose-700 flex items-center justify-center gap-2 transition-colors touch-manipulation"
          >
            <Eraser className="w-4 h-4" />
            <span>Mulai dari Nol (Kosongkan Transaksi)</span>
          </button>

          <button
            type="button"
            onClick={handleConfirmResetDemo}
            className="w-full min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Muat Data Contoh (Demo PKL)</span>
          </button>
        </div>
      </section>
    </div>
  );
}
