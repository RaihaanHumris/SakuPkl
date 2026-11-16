import { AlertCircle, AlertTriangle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { DailySafetyStatus, PeriodInfo } from '../types/finance';
import { formatRupiah } from '../utils/format';

const HIDE_BALANCE_STORAGE_KEY = 'sakupkl_hide_balance_v1';

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
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HIDE_BALANCE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(HIDE_BALANCE_STORAGE_KEY, String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const isOverbudget = dailyStatus === 'overbudget';
  const isWarning = dailyStatus === 'warning';

  const cardBorderClass = isOverbudget
    ? 'border-rose-200/90 dark:border-rose-900/70 bg-gradient-to-b from-rose-50/80 via-white to-white dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900'
    : isWarning
      ? 'border-amber-200/90 dark:border-amber-900/70 bg-gradient-to-b from-amber-50/80 via-white to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900'
      : 'border-emerald-200/70 dark:border-emerald-900/60 bg-gradient-to-b from-emerald-50/75 via-white to-white dark:from-emerald-950/35 dark:via-slate-900 dark:to-slate-900';

  const topAccentClass = isOverbudget
    ? 'bg-gradient-to-r from-rose-500 via-rose-400 to-red-500'
    : isWarning
      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400'
      : 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500';

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
      className={`rounded-2xl border overflow-hidden shadow-sm transition-colors duration-200 ${cardBorderClass}`}
    >
      <div className={`h-1.5 w-full ${topAccentClass}`} aria-hidden="true" />
      <div className="p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Sisa Saldo PKL</span>
            <span aria-hidden="true">·</span>
            <span
              className={`font-semibold tabular-nums ${
                isOverbudget
                  ? 'text-rose-600 dark:text-rose-400'
                  : isWarning
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {remainingPercent}% tersedia
            </span>
          </div>
          <p
            className={`mt-1.5 font-display text-[32px] font-bold tracking-tight tabular-nums leading-none ${
              remainingBalance < 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {isBalanceHidden ? 'Rp •••••••' : formatRupiah(remainingBalance)}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleBalanceVisibility}
          aria-label={isBalanceHidden ? 'Tampilkan nominal saldo' : 'Sembunyikan nominal saldo'}
          aria-pressed={isBalanceHidden}
          className="min-h-[44px] min-w-[44px] -mt-2 -mr-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 active:scale-95 transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {isBalanceHidden ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
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

      {/* Sisa Jatah Hari Ini */}
      {(() => {
        const diff = dailySafeLimit - todayExpense;
        const isOver = diff < 0;
        return (
          <div
            className={`mt-3 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 border ${
              isOver
                ? 'bg-rose-50/70 dark:bg-rose-950/35 border-rose-200/80 dark:border-rose-900/60'
                : 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-900/50'
            }`}
          >
            <span
              className={`text-xs font-semibold ${
                isOver
                  ? 'text-rose-700 dark:text-rose-300'
                  : 'text-emerald-800 dark:text-emerald-300'
              }`}
            >
              {isOver ? 'Lewat jatah hari ini' : 'Sisa jatah hari ini'}
            </span>
            <span
              className={`text-sm font-extrabold tabular-nums ${
                isOver
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {isOver
                ? `- ${formatRupiah(Math.abs(diff))}`
                : formatRupiah(diff)}
            </span>
          </div>
        );
      })()}

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
      </div>
    </section>
  );
}
