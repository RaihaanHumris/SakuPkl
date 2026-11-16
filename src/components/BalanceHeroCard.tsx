import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { DailySafetyStatus, PeriodInfo } from '../types/finance';
import { formatRupiah } from '../utils/format';

interface BalanceHeroCardProps {
  remainingBalance: number;
  totalBudgetPool: number;
  remainingPercent: number;
  dailySafeLimit: number;
  todayExpense: number;
  dailyStatus: DailySafetyStatus;
  dailyStatusMessage: string;
  periodInfo: PeriodInfo;
}

export function BalanceHeroCard({
  remainingBalance,
  totalBudgetPool,
  remainingPercent,
  dailySafeLimit,
  todayExpense,
  dailyStatus,
  dailyStatusMessage,
  periodInfo,
}: BalanceHeroCardProps) {
  const isOverbudget = dailyStatus === 'overbudget';
  const isWarning = dailyStatus === 'warning';

  const cardBorderClass = isOverbudget
    ? 'border-rose-200 dark:border-rose-900/70 bg-white dark:bg-slate-900'
    : isWarning
      ? 'border-amber-200 dark:border-amber-900/70 bg-white dark:bg-slate-900'
      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900';

  const progressBarColor = isOverbudget
    ? 'bg-rose-500'
    : isWarning
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  const todayCardStyle = isOverbudget
    ? 'bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
    : isWarning
      ? 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100';

  const todayValueColor = isOverbudget
    ? 'text-rose-600 dark:text-rose-400'
    : isWarning
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-slate-900 dark:text-slate-100';

  return (
    <section
      aria-label="Ringkasan Saldo PKL"
      className={`rounded-2xl border p-5 shadow-xs transition-colors duration-200 ${cardBorderClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Sisa Saldo PKL
          </p>
          <p
            className={`mt-1 text-3xl font-extrabold tracking-tight tabular-nums ${
              remainingBalance < 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {formatRupiah(remainingBalance)}
          </p>
        </div>

        <span
          className={`text-xs font-semibold tabular-nums px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${
            isOverbudget
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
              : isWarning
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
          }`}
        >
          {remainingPercent}% tersisa
        </span>
      </div>

      {/* Progress Bar Sisa Anggaran */}
      <div className="mt-4">
        <div
          className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
          role="progressbar"
          aria-valuenow={remainingPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Persentase sisa anggaran PKL"
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${progressBarColor}`}
            style={{ width: `${remainingPercent}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Total anggaran aktif</span>
          <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
            {formatRupiah(totalBudgetPool)}
          </span>
        </div>
      </div>

      {/* 2 Sub-kartu berdampingan */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 p-3.5">
          <p className="text-xs font-medium text-emerald-800/80 dark:text-emerald-300/90">
            Batas Aman / Hari
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
            {formatRupiah(dailySafeLimit)}
          </p>
          <p className="mt-0.5 text-[11px] text-emerald-700/80 dark:text-emerald-400/80 tabular-nums">
            Untuk {periodInfo.remainingDays} hari tersisa
          </p>
        </div>

        <div className={`rounded-xl p-3.5 transition-colors duration-200 ${todayCardStyle}`}>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Terpakai Hari Ini
          </p>
          <p className={`mt-1 text-lg font-bold tabular-nums ${todayValueColor}`}>
            {formatRupiah(todayExpense)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            {dailySafeLimit > 0
              ? `${Math.round((todayExpense / dailySafeLimit) * 100)}% dari batas harian`
              : 'Batas harian Rp 0'}
          </p>
        </div>
      </div>

      {/* Indikator Status Harian */}
      <div
        className={`mt-3.5 flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium ${
          isOverbudget
            ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
            : isWarning || todayExpense > 50000
              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
              : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300'
        }`}
      >
        {isOverbudget ? (
          <AlertCircle
            className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5"
            aria-hidden="true"
          />
        ) : isWarning || todayExpense > 50000 ? (
          <AlertTriangle
            className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
            aria-hidden="true"
          />
        ) : (
          <ShieldCheck
            className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
            aria-hidden="true"
          />
        )}
        <span className="leading-relaxed">
          {todayExpense > 50000 && !isOverbudget
            ? `Peringatan: Pengeluaran hari ini sudah melebihi Rp 50.000 (${formatRupiah(todayExpense)}).`
            : dailyStatusMessage}
        </span>
      </div>
    </section>
  );
}
