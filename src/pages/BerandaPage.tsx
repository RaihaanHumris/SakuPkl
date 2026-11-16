import { ArrowRight, Plus, ReceiptText } from 'lucide-react';
import { BalanceHeroCard } from '../components/BalanceHeroCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { QuickAddChips } from '../components/QuickAddChips';
import type {
  ActivePage,
  DailySafetyStatus,
  PeriodInfo,
  QuickTemplate,
  Transaction,
} from '../types/finance';
import { formatDateHeader, formatRupiah } from '../utils/format';

interface BerandaPageProps {
  remainingBalance: number;
  totalBudgetPool: number;
  remainingPercent: number;
  dailySafeLimit: number;
  todayExpense: number;
  dailyStatus: DailySafetyStatus;
  dailyStatusMessage: string;
  periodInfo: PeriodInfo;
  recentTransactions: Transaction[];
  totalTransactionCount: number;
  onQuickAdd: (template: QuickTemplate) => void;
  onEditTransaction: (tx: Transaction) => void;
  onOpenAddModal: () => void;
  onNavigate: (page: ActivePage) => void;
}

export function BerandaPage({
  remainingBalance,
  totalBudgetPool,
  remainingPercent,
  dailySafeLimit,
  todayExpense,
  dailyStatus,
  dailyStatusMessage,
  periodInfo,
  recentTransactions,
  totalTransactionCount,
  onQuickAdd,
  onEditTransaction,
  onOpenAddModal,
  onNavigate,
}: BerandaPageProps) {
  return (
    <div className="space-y-4 pt-1">
      <BalanceHeroCard
        remainingBalance={remainingBalance}
        totalBudgetPool={totalBudgetPool}
        remainingPercent={remainingPercent}
        dailySafeLimit={dailySafeLimit}
        todayExpense={todayExpense}
        dailyStatus={dailyStatus}
        dailyStatusMessage={dailyStatusMessage}
        periodInfo={periodInfo}
      />

      <QuickAddChips onQuickAdd={onQuickAdd} />

      {/* Transaksi Terbaru Preview */}
      <section aria-label="Transaksi Terbaru">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-sm font-bold text-slate-900">Transaksi Terbaru</h2>
          {totalTransactionCount > 0 && (
            <button
              type="button"
              onClick={() => onNavigate('riwayat')}
              className="min-h-[36px] px-2 -mr-2 rounded-lg text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 inline-flex items-center gap-1 transition-colors touch-manipulation"
            >
              <span>Lihat Semua ({totalTransactionCount})</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {recentTransactions.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200/80 p-7 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ReceiptText className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900">
              Belum ada transaksi tercatat
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-[240px] mx-auto leading-relaxed">
              Ketuk tombol Tambah Cepat di atas atau tombol + di bawah untuk mulai mencatat.
            </p>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="mt-4 min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white inline-flex items-center gap-1.5 active:scale-[0.98] transition-all touch-manipulation"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Transaksi Pertama</span>
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
            {recentTransactions.map((tx) => {
              const isExpense = tx.type === 'expense';
              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => onEditTransaction(tx)}
                  className="w-full text-left flex items-center gap-3 px-3.5 py-3 hover:bg-slate-50/80 active:bg-slate-100/70 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500"
                >
                  <CategoryIcon category={tx.category} />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {tx.note}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="truncate">{tx.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="shrink-0">{formatDateHeader(tx.date)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums shrink-0">{tx.time}</span>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-bold tabular-nums whitespace-nowrap shrink-0 ${
                      isExpense ? 'text-slate-900' : 'text-emerald-600'
                    }`}
                  >
                    {isExpense
                      ? `- ${formatRupiah(tx.amount)}`
                      : `+ ${formatRupiah(tx.amount)}`}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
