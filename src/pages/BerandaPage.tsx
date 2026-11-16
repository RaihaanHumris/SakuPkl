import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  ChevronRight,
  Flame,
  Plus,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react';
import { BalanceHeroCard } from '../components/BalanceHeroCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { QuickAddChips } from '../components/QuickAddChips';
import type {
  ActivePage,
  DailySafetyStatus,
  PeriodInfo,
  QuickTemplate,
  QuickTemplateGroup,
  Transaction,
} from '../types/finance';
import type { ProfileStatusBadge } from '../utils/dailyInsights';
import { getInitials } from '../utils/avatar';
import { formatDateHeader, formatRupiah } from '../utils/format';

interface BerandaPageProps {
  userName: string;
  pklPlace: string;
  avatarDataUrl?: string;
  remainingBalance: number;
  totalBudgetPool: number;
  remainingPercent: number;
  dailySafeLimit: number;
  todayExpense: number;
  dailyStatus: DailySafetyStatus;
  dailyStatusMessage: string;
  profileBadge: ProfileStatusBadge;
  periodInfo: PeriodInfo;
  recentTransactions: Transaction[];
  totalTransactionCount: number;
  quickTemplates: QuickTemplate[];
  onQuickAdd: (template: QuickTemplate) => void;
  onAddQuickTemplate: (group?: QuickTemplateGroup) => void;
  onEditQuickTemplate: (template: QuickTemplate) => void;
  onDeleteQuickTemplate: (template: QuickTemplate) => void;
  onResetQuickTemplates: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onOpenAddModal: () => void;
  onOpenNotifModal: () => void;
  onNavigate: (page: ActivePage) => void;
}

export function BerandaPage({
  userName,
  pklPlace,
  avatarDataUrl,
  remainingBalance,
  totalBudgetPool,
  remainingPercent,
  dailySafeLimit,
  todayExpense,
  dailyStatus,
  dailyStatusMessage,
  profileBadge,
  periodInfo,
  recentTransactions,
  totalTransactionCount,
  quickTemplates,
  onQuickAdd,
  onAddQuickTemplate,
  onEditQuickTemplate,
  onDeleteQuickTemplate,
  onResetQuickTemplates,
  onEditTransaction,
  onOpenAddModal,
  onOpenNotifModal,
  onNavigate,
}: BerandaPageProps) {
  const initials = getInitials(userName);

  return (
    <div className="space-y-4 pt-1">
      {/* Non-sticky Personal Profile Greeting */}
      <button
        type="button"
        onClick={() => onNavigate('anggaran')}
        aria-label="Buka profil dan pengaturan anggaran"
        className="w-full flex items-center justify-between gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-3.5 py-3 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/70 active:scale-[0.99] transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <div className="flex items-center gap-3 min-w-0">
          {avatarDataUrl ? (
            <img
              src={avatarDataUrl}
              alt={`Foto profil ${userName}`}
              className="w-10 h-10 rounded-full object-cover shrink-0 shadow-xs border border-emerald-200 dark:border-emerald-800"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-xs"
              aria-hidden="true"
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-display text-[15px] font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-snug truncate">
              Halo, {userName}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
              {pklPlace ? `PKL di ${pklPlace}` : 'Dompet harian anak PKL'}
            </p>
            <p
              className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${
                profileBadge.tone === 'rose'
                  ? 'text-rose-600 dark:text-rose-400'
                  : profileBadge.tone === 'amber'
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {profileBadge.tone === 'rose' || profileBadge.tone === 'amber' ? (
                <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" />
              ) : profileBadge.streakDays >= 2 ? (
                <Flame className="w-3 h-3 shrink-0" aria-hidden="true" />
              ) : (
                <ShieldCheck className="w-3 h-3 shrink-0" aria-hidden="true" />
              )}
              <span>{profileBadge.label}</span>
            </p>
          </div>
        </div>
        <ChevronRight
          className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0"
          aria-hidden="true"
        />
      </button>

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

      {/* Smart Notification / Receipt Reader Entry */}
      <button
        type="button"
        onClick={onOpenNotifModal}
        aria-label="Baca Notif Pengeluaran HP"
        className="w-full min-h-[58px] flex items-center justify-between gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900/60 px-3.5 py-3 text-left hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 active:scale-[0.99] transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <BellRing className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="font-display text-[13px] font-bold text-slate-900 dark:text-slate-100">
              Baca Notif Pengeluaran HP
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
              Catat dari teks Shopee, GoPay, QRIS &amp; m-banking
            </p>
          </div>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
          Tempel
        </span>
      </button>

      <QuickAddChips
        templates={quickTemplates}
        onQuickAdd={onQuickAdd}
        onAddTemplate={onAddQuickTemplate}
        onEditTemplate={onEditQuickTemplate}
        onDeleteTemplate={onDeleteQuickTemplate}
        onResetTemplates={onResetQuickTemplates}
      />

      {/* Transaksi Terbaru Preview */}
      <section aria-label="Transaksi Terbaru">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
            Transaksi Terbaru
          </h2>
          {totalTransactionCount > 0 && (
            <button
              type="button"
              onClick={() => onNavigate('riwayat')}
              className="min-h-[36px] px-2 -mr-2 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 inline-flex items-center gap-1 transition-colors touch-manipulation"
            >
              <span>Lihat Semua ({totalTransactionCount})</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {recentTransactions.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-7 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ReceiptText className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
              Belum ada transaksi tercatat
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-[240px] mx-auto leading-relaxed">
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
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {recentTransactions.map((tx) => {
              const isExpense = tx.type === 'expense';
              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => onEditTransaction(tx)}
                  className="w-full text-left flex items-center gap-3 px-3.5 py-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 active:bg-slate-100/70 dark:active:bg-slate-800 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500"
                >
                  <CategoryIcon category={tx.category} />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {tx.note}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="truncate">{tx.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="shrink-0">{formatDateHeader(tx.date)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums shrink-0">{tx.time}</span>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-bold tabular-nums whitespace-nowrap shrink-0 ${
                      isExpense
                        ? 'text-slate-900 dark:text-slate-100'
                        : 'text-emerald-600 dark:text-emerald-400'
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
