import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Copy,
  Download,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { useState } from 'react';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORY_STYLES } from '../data/seedData';
import type { CategoryBreakdownItem, DailyTrendItem } from '../hooks/useFinanceStore';
import type { PeriodInfo } from '../types/finance';
import { formatDateHeader, formatRupiah, formatShortDayLabel } from '../utils/format';

interface StatistikPageProps {
  totalExpense: number;
  totalBudgetPool: number;
  totalAdditionalIncome: number;
  initialAllowance: number;
  remainingBalance: number;
  averageDailyExpense: number;
  dailySafeLimit: number;
  projectedEndBalance: number;
  runwayDays: number;
  periodInfo: PeriodInfo;
  categoryBreakdown: CategoryBreakdownItem[];
  last7DaysSpend: DailyTrendItem[];
  transactionCount: number;
  onExportCsv: () => void;
  onCopySummary: (summaryText: string) => void;
}

export function StatistikPage({
  totalExpense,
  totalBudgetPool,
  totalAdditionalIncome,
  initialAllowance,
  remainingBalance,
  averageDailyExpense,
  dailySafeLimit,
  projectedEndBalance,
  runwayDays,
  periodInfo,
  categoryBreakdown,
  last7DaysSpend,
  transactionCount,
  onExportCsv,
  onCopySummary,
}: StatistikPageProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(
    last7DaysSpend.length - 1
  );

  const maxDailySpend = Math.max(
    dailySafeLimit,
    ...last7DaysSpend.map((d) => d.amount),
    1
  );

  const topCategory = categoryBreakdown.find((item) => item.amount > 0);
  const selectedDay = last7DaysSpend[selectedDayIndex] ?? last7DaysSpend[last7DaysSpend.length - 1];

  const handleCopy = () => {
    const lines = [
      `Ringkasan SakuPKL (${periodInfo.badgeLabel})`,
      `Sisa Saldo: ${formatRupiah(remainingBalance)}`,
      `Batas Aman/Hari: ${formatRupiah(dailySafeLimit)}`,
      `Total Pemasukan: ${formatRupiah(totalBudgetPool)}`,
      `Total Pengeluaran: ${formatRupiah(totalExpense)}`,
      topCategory
        ? `Kategori Terbesar: ${topCategory.category} (${formatRupiah(topCategory.amount)})`
        : '',
    ]
      .filter(Boolean)
      .join('\n');
    onCopySummary(lines);
  };

  return (
    <div className="space-y-4">
      <div className="px-0.5 pt-1">
        <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
          Statistik PKL
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Analisis pengeluaran, proyeksi saldo, dan ekspor laporan
        </p>
      </div>

      {/* Action Row: Export CSV & Salin Ringkasan */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onExportCsv}
          disabled={transactionCount === 0}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Export CSV</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-100 text-slate-800 text-xs font-semibold inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Copy className="w-4 h-4 shrink-0 text-slate-500" />
          <span className="whitespace-nowrap">Salin Ringkasan</span>
        </button>
      </div>

      {/* Ringkasan Pengeluaran vs Pemasukan */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <ArrowUpRight className="w-4 h-4 text-rose-500" aria-hidden="true" />
            <span>Total Pengeluaran</span>
          </div>
          <p className="mt-1.5 text-xl font-extrabold text-slate-900 tabular-nums">
            {formatRupiah(totalExpense)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 tabular-nums">
            Rata-rata {formatRupiah(averageDailyExpense)}/hari
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/80 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <ArrowDownRight className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            <span>Total Pemasukan</span>
          </div>
          <p className="mt-1.5 text-xl font-extrabold text-emerald-600 tabular-nums">
            {formatRupiah(totalBudgetPool)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 tabular-nums">
            Saku {formatRupiah(initialAllowance)}
            {totalAdditionalIncome > 0
              ? ` + ${formatRupiah(totalAdditionalIncome)}`
              : ''}
          </p>
        </div>
      </div>

      {/* Proyeksi Ketahanan Saldo PKL */}
      <section
        aria-label="Proyeksi Ketahanan Saldo"
        className={`rounded-2xl border p-4 ${
          projectedEndBalance >= 0
            ? 'bg-emerald-50/60 border-emerald-200/80'
            : 'bg-amber-50/70 border-amber-200/80'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              projectedEndBalance >= 0
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xs font-bold text-slate-900">
              Proyeksi Akhir Periode PKL
            </h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {totalExpense === 0
                ? 'Belum ada pengeluaran tercatat. Catat transaksimu untuk melihat proyeksi ketahanan uang saku.'
                : projectedEndBalance >= 0
                  ? `Dengan rata-rata ${formatRupiah(averageDailyExpense)}/hari, saldomu cukup hingga hari terakhir dengan estimasi sisa ${formatRupiah(projectedEndBalance)}.`
                  : `Dengan rata-rata ${formatRupiah(averageDailyExpense)}/hari, saldo diperkirakan hanya bertahan sekitar ${runwayDays} hari dari ${periodInfo.remainingDays} hari tersisa.`}
            </p>
          </div>
        </div>
      </section>

      {/* Tren Pengeluaran 7 Hari Terakhir (Interactive Tap Bars) */}
      <section
        aria-label="Tren Pengeluaran 7 Hari Terakhir"
        className="rounded-2xl bg-white border border-slate-200/80 p-4"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-slate-600" aria-hidden="true" />
            <h2 className="text-sm font-bold text-slate-900">7 Hari Terakhir</h2>
          </div>
          <span className="text-[11px] text-slate-500 tabular-nums">
            Batas aman: {formatRupiah(dailySafeLimit)}
          </span>
        </div>

        {selectedDay && (
          <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">
              {formatDateHeader(selectedDay.date)}
            </span>
            <span className="font-bold text-slate-900 tabular-nums">
              {formatRupiah(selectedDay.amount)}
            </span>
          </div>
        )}

        <div className="grid grid-cols-7 gap-1.5 items-end h-36 pt-2">
          {last7DaysSpend.map((day, idx) => {
            const { dayName, dayNum } = formatShortDayLabel(day.date);
            const heightPercent =
              day.amount > 0
                ? Math.max(12, Math.round((day.amount / maxDailySpend) * 100))
                : 5;
            const isOverLimit = dailySafeLimit > 0 && day.amount > dailySafeLimit;
            const isSelected = idx === selectedDayIndex;

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                aria-label={`${dayName} ${dayNum}: ${formatRupiah(day.amount)}`}
                className={`flex flex-col items-center justify-end h-full gap-1.5 rounded-xl py-1 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isSelected ? 'bg-slate-100/90' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-full flex-1 flex items-end justify-center px-1.5">
                  <div
                    className={`w-full max-w-[26px] rounded-t-lg transition-all duration-300 ${
                      day.amount === 0
                        ? 'bg-slate-200'
                        : isOverLimit
                          ? isSelected
                            ? 'bg-rose-600'
                            : 'bg-rose-400'
                          : isSelected
                            ? 'bg-emerald-600'
                            : 'bg-emerald-400/80'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <div className="text-center leading-tight">
                  <p
                    className={`text-[10px] font-semibold ${
                      isSelected ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {dayName}
                  </p>
                  <p className="text-[10px] text-slate-400 tabular-nums">{dayNum}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Breakdown Pengeluaran per Kategori */}
      <section
        aria-label="Pengeluaran per Kategori"
        className="rounded-2xl bg-white border border-slate-200/80 p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-slate-600" aria-hidden="true" />
            <h2 className="text-sm font-bold text-slate-900">
              Pengeluaran per Kategori
            </h2>
          </div>
          {topCategory && (
            <span className="text-[11px] font-medium text-slate-500">
              Terbesar: {topCategory.category}
            </span>
          )}
        </div>

        {totalExpense === 0 ? (
          <div className="py-6 text-center">
            <p className="text-xs text-slate-500">
              Belum ada data pengeluaran untuk dianalisis.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categoryBreakdown.map((item) => {
              const style = CATEGORY_STYLES[item.category];
              return (
                <div key={item.category}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CategoryIcon category={item.category} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {item.category}
                        </p>
                        <p className="text-[11px] text-slate-500 tabular-nums">
                          {item.count} transaksi
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-900 tabular-nums">
                        {formatRupiah(item.amount)}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 tabular-nums">
                        {item.percentage}%
                      </p>
                    </div>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${style.barClass}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
