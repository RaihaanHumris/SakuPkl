import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import {
  ArrowDownRight,
  ArrowUpRight,
  Copy,
  Download,
  PieChart as PieChartIcon,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { CategoryIcon } from '../components/CategoryIcon';
import type { CategoryBreakdownItem, DailyTrendItem } from '../hooks/useFinanceStore';
import type { ExpenseCategory, PeriodInfo } from '../types/finance';
import {
  formatCompactRupiah,
  formatDateHeader,
  formatRupiah,
  formatShortDayLabel,
} from '../utils/format';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const CATEGORY_HEX: Record<ExpenseCategory, string> = {
  'Makan & Minum': '#f59e0b',
  Transportasi: '#0ea5e9',
  'Kebutuhan PKL': '#8b5cf6',
  'Jajan & Kopi': '#f97316',
  'Lain-lain': '#64748b',
};

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
  isDark: boolean;
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
  isDark,
  onExportCsv,
  onCopySummary,
}: StatistikPageProps) {
  const activeCategories = useMemo(
    () => categoryBreakdown.filter((item) => item.amount > 0),
    [categoryBreakdown]
  );

  const topCategory = activeCategories[0];

  const donutChartData = useMemo(() => {
    return {
      labels: activeCategories.map((item) => item.category),
      datasets: [
        {
          data: activeCategories.map((item) => item.amount),
          backgroundColor: activeCategories.map(
            (item) => CATEGORY_HEX[item.category] ?? '#64748b'
          ),
          borderColor: isDark ? '#0f172a' : '#ffffff',
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    };
  }, [activeCategories, isDark]);

  const donutChartOptions = useMemo<ChartOptions<'doughnut'>>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0',
          padding: 10,
          cornerRadius: 10,
          displayColors: true,
          callbacks: {
            label: (ctx) => {
              const value = Number(ctx.raw ?? 0);
              const pct =
                totalExpense > 0 ? Math.round((value / totalExpense) * 100) : 0;
              return ` ${formatRupiah(value)} (${pct}%)`;
            },
          },
        },
      },
    };
  }, [isDark, totalExpense]);

  const barChartData = useMemo(() => {
    return {
      labels: last7DaysSpend.map((d) => {
        const { dayName, dayNum } = formatShortDayLabel(d.date);
        return `${dayName} ${dayNum}`;
      }),
      datasets: [
        {
          label: 'Pengeluaran',
          data: last7DaysSpend.map((d) => d.amount),
          backgroundColor: last7DaysSpend.map((d) => {
            if (d.amount === 0) return isDark ? '#1e293b' : '#e2e8f0';
            if (dailySafeLimit > 0 && d.amount > dailySafeLimit) {
              return '#f43f5e';
            }
            return '#10b981';
          }),
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 28,
        },
      ],
    };
  }, [last7DaysSpend, dailySafeLimit, isDark]);

  const barChartOptions = useMemo<ChartOptions<'bar'>>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0',
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            title: (items) => {
              const idx = items[0]?.dataIndex ?? 0;
              const item = last7DaysSpend[idx];
              return item ? formatDateHeader(item.date) : '';
            },
            label: (ctx) => ` Pengeluaran: ${formatRupiah(Number(ctx.raw ?? 0))}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: isDark ? '#94a3b8' : '#64748b',
            font: {
              size: 10,
              weight: 600,
            },
          },
        },
        y: {
          beginAtZero: true,
          border: {
            display: false,
          },
          grid: {
            color: isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.2)',
          },
          ticks: {
            maxTicksLimit: 4,
            color: isDark ? '#94a3b8' : '#64748b',
            font: {
              size: 10,
            },
            callback: (val) => {
              const num = Number(val);
              return num === 0 ? '0' : formatCompactRupiah(num);
            },
          },
        },
      },
    };
  }, [isDark, last7DaysSpend]);

  const handleCopy = () => {
    const lines = [
      `Ringkasan SakuPkl (${periodInfo.badgeLabel})`,
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
        <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Statistik PKL
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Ringkasan kategori, tren 7 hari, proyeksi saldo, dan ekspor laporan
        </p>
      </div>

      {/* Action Row: Export CSV & Salin Ringkasan */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onExportCsv}
          disabled={transactionCount === 0}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Export CSV</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Copy className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
          <span className="whitespace-nowrap">Salin Ringkasan</span>
        </button>
      </div>

      {/* Ringkasan Pengeluaran vs Pemasukan */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <ArrowUpRight className="w-4 h-4 text-rose-500" aria-hidden="true" />
            <span>Total Pengeluaran</span>
          </div>
          <p className="mt-1.5 text-xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
            {formatRupiah(totalExpense)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            Rata-rata {formatRupiah(averageDailyExpense)}/hari
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <ArrowDownRight className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            <span>Total Pemasukan</span>
          </div>
          <p className="mt-1.5 text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatRupiah(totalBudgetPool)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
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
            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/60'
            : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/60'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              projectedEndBalance >= 0
                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Proyeksi Akhir Periode PKL
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {totalExpense === 0
                ? 'Belum ada pengeluaran tercatat. Catat transaksimu untuk melihat proyeksi ketahanan uang saku.'
                : projectedEndBalance >= 0
                  ? `Dengan rata-rata ${formatRupiah(averageDailyExpense)}/hari, saldomu cukup hingga hari terakhir dengan estimasi sisa ${formatRupiah(projectedEndBalance)}.`
                  : `Dengan rata-rata ${formatRupiah(averageDailyExpense)}/hari, saldo diperkirakan hanya bertahan sekitar ${runwayDays} hari dari ${periodInfo.remainingDays} hari tersisa.`}
            </p>
          </div>
        </div>
      </section>

      {/* Tren Pengeluaran 7 Hari Terakhir (Chart.js Bar Chart) */}
      <section
        aria-label="Tren Pengeluaran 7 Hari Terakhir"
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <TrendingDown
              className="w-4 h-4 text-slate-600 dark:text-slate-400"
              aria-hidden="true"
            />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Tren 7 Hari Terakhir
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            Batas aman: {formatRupiah(dailySafeLimit)}
          </span>
        </div>

        <div className="h-48 w-full">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </section>

      {/* Pengeluaran per Kategori (Chart.js Donut Chart + Category Details) */}
      <section
        aria-label="Pengeluaran per Kategori"
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <PieChartIcon
              className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Pengeluaran per Kategori
            </h2>
          </div>
          {topCategory && (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Terbesar: {topCategory.category}
            </span>
          )}
        </div>

        {activeCategories.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Belum ada data pengeluaran untuk dianalisis.
            </p>
          </div>
        ) : (
          <>
            <div className="relative h-56 w-full max-w-[240px] mx-auto my-2">
              <Doughnut data={donutChartData} options={donutChartOptions} />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Total Keluar
                </span>
                <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                  {formatRupiah(totalExpense)}
                </span>
              </div>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
              {categoryBreakdown.map((item) => (
                <div
                  key={item.category}
                  className="py-3 first:pt-3 last:pb-1 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: CATEGORY_HEX[item.category] ?? '#64748b',
                      }}
                      aria-hidden="true"
                    />
                    <CategoryIcon category={item.category} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.category}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                        {item.count} transaksi
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 tabular-nums">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {formatRupiah(item.amount)}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {item.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
