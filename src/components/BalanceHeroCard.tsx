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
    ? 'border-rose-200 bg-white'
    : isWarning
      ? 'border-amber-200 bg-white'
      : 'border-slate-200/80 bg-white';

  const progressBarColor = isOverbudget
    ? 'bg-rose-500'
    : isWarning
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  const todayCardStyle = isOverbudget
    ? 'bg-rose-50/80 text-rose-700'
    : isWarning
      ? 'bg-amber-50/80 text-amber-700'
      : 'bg-slate-50 text-slate-900';

  const todayValueColor = isOverbudget
    ? 'text-rose-600'
    : isWarning
      ? 'text-amber-600'
      : 'text-slate-900';

  return (
    <section
      aria-label="Ringkasan Saldo PKL"
      className={`rounded-2xl border p-5 shadow-xs transition-colors duration-200 ${cardBorderClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-slate-500">Sisa Saldo PKL</p>
          <p
            className={`mt-1 text-3xl font-extrabold tracking-tight tabular-nums ${
              remainingBalance < 0 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {formatRupiah(remainingBalance)}
          </p>
        </div>

        <span
          className={`text-xs font-semibold tabular-nums px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${
            isOverbudget
              ? 'bg-rose-50 text-rose-700'
              : isWarning
                ? 'bg-amber-50 text-amber-700'
                : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {remainingPercent}% tersisa
        </span>
      </div>

      {/* Progress Bar Sisa Anggaran */}
      <div className="mt-4">
        <div
          className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"
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
        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
          <span>Total anggaran aktif</span>
          <span className="font-medium text-slate-700 tabular-nums">
            {formatRupiah(totalBudgetPool)}
          </span>
        </div>
      </div>

      {/* 2 Sub-kartu berdampingan */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50/70 p-3.5">
          <p className="text-xs font-medium text-emerald-800/80">Batas Aman / Hari</p>
          <p className="mt-1 text-lg font-bold text-emerald-700 tabular-nums">
            {formatRupiah(dailySafeLimit)}
          </p>
          <p className="mt-0.5 text-[11px] text-emerald-700/80 tabular-nums">
            Untuk {periodInfo.remainingDays} hari tersisa
          </p>
        </div>

        <div className={`rounded-xl p-3.5 transition-colors duration-200 ${todayCardStyle}`}>
          <p className="text-xs font-medium text-slate-500">Terpakai Hari Ini</p>
          <p className={`mt-1 text-lg font-bold tabular-nums ${todayValueColor}`}>
            {formatRupiah(todayExpense)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500 tabular-nums">
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
            ? 'bg-rose-50 text-rose-700'
            : isWarning
              ? 'bg-amber-50 text-amber-800'
              : 'bg-slate-50 text-slate-600'
        }`}
      >
        {isOverbudget ? (
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
        ) : isWarning ? (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
        )}
        <span className="leading-relaxed">{dailyStatusMessage}</span>
      </div>
    </section>
  );
}
