import { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { NotifParserModal } from './components/NotifParserModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { QuickTemplateModal } from './components/QuickTemplateModal';
import { TransactionModal } from './components/TransactionModal';
import { useFinanceStore, type TransactionInput } from './hooks/useFinanceStore';
import { useTheme } from './hooks/useTheme';
import { AnggaranPage } from './pages/AnggaranPage';
import { BerandaPage } from './pages/BerandaPage';
import { RiwayatPage } from './pages/RiwayatPage';
import { StatistikPage } from './pages/StatistikPage';
import type {
  ActivePage,
  BudgetSettings,
  QuickTemplate,
  QuickTemplateGroup,
  Transaction,
} from './types/finance';
import { formatRupiah, getLocalDateString } from './utils/format';
import {
  confirmDialog,
  notifyLargeExpenseWarning,
  notifyToast,
} from './utils/notify';
import type { QuickTemplateInput } from './utils/quickTemplates';

const LARGE_EXPENSE_THRESHOLD = 50000;

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const {
    budget,
    transactions,
    quickTemplates,
    metrics,
    categoryBreakdown,
    last7DaysSpend,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    restoreTransaction,
    updateBudget,
    updateAvatar,
    startFromZero,
    resetAllData,
    addQuickTemplate,
    updateQuickTemplate,
    deleteQuickTemplate,
    restoreQuickTemplate,
    resetQuickTemplates,
    exportToCsv,
  } = useFinanceStore();

  const [activePage, setActivePage] = useState<ActivePage>('beranda');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [sharedNotifText, setSharedNotifText] = useState('');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [editingQuickTpl, setEditingQuickTpl] = useState<QuickTemplate | null>(null);
  const [quickModalGroup, setQuickModalGroup] =
    useState<QuickTemplateGroup>('makanan');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const notifTextParam = params.get('notif_text')?.trim();
    const shareTitle = params.get('title')?.trim();
    const shareText = params.get('text')?.trim();
    const shareUrl = params.get('url')?.trim();

    const incomingText =
      notifTextParam ||
      [shareTitle, shareText, shareUrl].filter(Boolean).join(' ').trim();

    if (incomingText) {
      setSharedNotifText(incomingText);
      setIsNotifModalOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAddModal = () => {
    setEditingTx(null);
    setIsTxModalOpen(true);
  };

  const openEditModal = (tx: Transaction) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  const handleQuickAdd = (template: QuickTemplate) => {
    const todayStr = getLocalDateString();
    const prevTodayExpense = metrics.todayExpense;
    const nextTodayExpense = prevTodayExpense + template.amount;

    const created = addTransaction({
      type: 'expense',
      category: template.category,
      amount: template.amount,
      note: template.note,
      date: todayStr,
    });

    if (
      prevTodayExpense <= LARGE_EXPENSE_THRESHOLD &&
      nextTodayExpense > LARGE_EXPENSE_THRESHOLD
    ) {
      void notifyLargeExpenseWarning({
        title: 'Peringatan Pengeluaran > Rp 50.000!',
        text: `Total pengeluaran hari ini mencapai ${formatRupiah(nextTodayExpense)} setelah menambah ${template.label} (${formatRupiah(template.amount)}).`,
        undoAction: () => {
          deleteTransaction(created.id);
          void notifyToast({
            title: 'Transaksi dibatalkan',
            icon: 'info',
            timer: 2000,
          });
        },
      });
      return;
    }

    void notifyToast({
      title: `Tersimpan! ${template.label}`,
      text: `${formatRupiah(template.amount)} · ${template.category}`,
      icon: 'success',
      actionLabel: 'Ubah',
      onAction: () => openEditModal(created),
      undoAction: () => {
        deleteTransaction(created.id);
        void notifyToast({
          title: 'Transaksi dibatalkan',
          icon: 'info',
          timer: 2000,
        });
      },
    });
  };

  const handleSaveTransaction = (input: TransactionInput, editId?: string) => {
    const todayStr = getLocalDateString();

    if (editId) {
      updateTransaction(editId, input);
      if (input.type === 'expense' && input.amount > LARGE_EXPENSE_THRESHOLD) {
        void notifyLargeExpenseWarning({
          title: 'Peringatan Pengeluaran > Rp 50.000!',
          text: `Catatan "${input.note.trim() || input.category}" bernilai ${formatRupiah(input.amount)}, melebihi Rp 50.000.`,
        });
        return;
      }
      void notifyToast({
        title: 'Perubahan tersimpan!',
        text: `${input.note.trim() || input.category} · ${formatRupiah(input.amount)}`,
        icon: 'success',
      });
      return;
    }

    const prevTodayExpense = metrics.todayExpense;
    const isTodayExpense = input.type === 'expense' && input.date === todayStr;
    const nextTodayExpense = isTodayExpense
      ? prevTodayExpense + input.amount
      : prevTodayExpense;

    const created = addTransaction(input);

    const undoCreated = () => {
      deleteTransaction(created.id);
      void notifyToast({
        title: 'Transaksi dibatalkan',
        icon: 'info',
        timer: 2000,
      });
    };

    if (input.type === 'expense' && input.amount > LARGE_EXPENSE_THRESHOLD) {
      void notifyLargeExpenseWarning({
        title: 'Peringatan Pengeluaran > Rp 50.000!',
        text: `Pengeluaran "${input.note.trim() || input.category}" sebesar ${formatRupiah(input.amount)} melebihi Rp 50.000. Pastikan sesuai batas anggaran PKL-mu.`,
        undoAction: undoCreated,
      });
      return;
    }

    if (
      isTodayExpense &&
      prevTodayExpense <= LARGE_EXPENSE_THRESHOLD &&
      nextTodayExpense > LARGE_EXPENSE_THRESHOLD
    ) {
      void notifyLargeExpenseWarning({
        title: 'Pengeluaran Hari Ini > Rp 50.000!',
        text: `Total pengeluaran hari ini kini mencapai ${formatRupiah(nextTodayExpense)}. Yuk jaga pengeluaran sisa hari ini.`,
        undoAction: undoCreated,
      });
      return;
    }

    const prefix = input.type === 'expense' ? 'Pengeluaran' : 'Pemasukan';
    void notifyToast({
      title: `${prefix} ${formatRupiah(input.amount)} tersimpan!`,
      text: input.note.trim() || input.category,
      icon: 'success',
      undoAction: undoCreated,
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const deleted = deleteTransaction(id);
    if (deleted) {
      void notifyToast({
        title: `"${deleted.note}" dihapus`,
        text: formatRupiah(deleted.amount),
        icon: 'info',
        undoAction: () => {
          restoreTransaction(deleted);
          void notifyToast({
            title: 'Transaksi dipulihkan',
            icon: 'success',
            timer: 2000,
          });
        },
      });
    }
  };

  const handleSaveBudget = (nextBudget: BudgetSettings) => {
    updateBudget(nextBudget);
    void notifyToast({
      title: 'Pengaturan anggaran diperbarui!',
      text: `Uang saku ${formatRupiah(nextBudget.totalAllowance)} · ${nextBudget.durationDays} hari`,
      icon: 'success',
    });
  };

  const handleUpdateAvatar = (nextAvatar: string | undefined) => {
    updateAvatar(nextAvatar);
    void notifyToast({
      title: nextAvatar ? 'Foto profil diperbarui!' : 'Foto profil dihapus',
      text: nextAvatar
        ? 'Foto barumu sekarang tampil di Beranda.'
        : 'Kembali menggunakan inisial nama.',
      icon: nextAvatar ? 'success' : 'info',
    });
  };

  const handleStartFromZero = (customBudget?: Partial<BudgetSettings>) => {
    startFromZero(customBudget);
    setActivePage('beranda');
    void notifyToast({
      title: 'Berhasil mulai dari nol!',
      text: 'Catatan transaksi dikosongkan dan periode dimulai hari ini.',
      icon: 'success',
    });
  };

  const handleResetToDemo = () => {
    resetAllData();
    setActivePage('beranda');
    void notifyToast({
      title: 'Data contoh PKL dimuat!',
      icon: 'success',
    });
  };

  const handleExportCsv = () => {
    exportToCsv();
    void notifyToast({
      title: 'Laporan CSV berhasil diunduh!',
      icon: 'success',
    });
  };

  const handleOpenAddQuickTemplate = (group: QuickTemplateGroup = 'makanan') => {
    setEditingQuickTpl(null);
    setQuickModalGroup(group);
    setIsQuickModalOpen(true);
  };

  const handleOpenEditQuickTemplate = (tpl: QuickTemplate) => {
    setEditingQuickTpl(tpl);
    setQuickModalGroup(tpl.group);
    setIsQuickModalOpen(true);
  };

  const handleSaveQuickTemplate = (
    input: QuickTemplateInput,
    editId?: string
  ) => {
    if (editId) {
      updateQuickTemplate(editId, input);
      void notifyToast({
        title: `Menu "${input.label}" diperbarui!`,
        text: `${formatRupiah(input.amount)} · ${input.category}`,
        icon: 'success',
      });
      return;
    }

    const created = addQuickTemplate(input);
    void notifyToast({
      title: `Menu "${created.label}" ditambahkan!`,
      text: `${formatRupiah(created.amount)} · Siap ketuk 1x`,
      icon: 'success',
    });
  };

  const handleDeleteQuickTemplate = (tpl: QuickTemplate) => {
    const deleted = deleteQuickTemplate(tpl.id);
    if (deleted) {
      void notifyToast({
        title: `Menu "${deleted.label}" dihapus`,
        icon: 'info',
        undoAction: () => {
          restoreQuickTemplate(deleted);
          void notifyToast({
            title: `Menu "${deleted.label}" dipulihkan`,
            icon: 'success',
            timer: 2000,
          });
        },
      });
    }
  };

  const handleResetQuickTemplates = async () => {
    const confirmed = await confirmDialog({
      title: 'Reset Menu Tambah Cepat?',
      text: 'Daftar menu cepat akan dikembalikan ke bawaan awal SakuPkl (Nasi Telor, Magelangan, Kukubima, dll.).',
      confirmText: 'Ya, Reset Default',
      cancelText: 'Batal',
    });
    if (!confirmed) return;

    resetQuickTemplates();
    void notifyToast({
      title: 'Menu Tambah Cepat dikembalikan ke default',
      icon: 'success',
    });
  };

  const handleCopySummary = async (summaryText: string) => {
    try {
      await navigator.clipboard.writeText(summaryText);
      void notifyToast({
        title: 'Ringkasan disalin ke clipboard!',
        icon: 'success',
      });
    } catch {
      void notifyToast({
        title: 'Gagal menyalin ringkasan.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="min-h-dvh bg-slate-100 dark:bg-slate-950 transition-colors">
      <div className="max-w-md mx-auto min-h-dvh bg-slate-50 dark:bg-slate-950 shadow-xl dark:shadow-black/50 dark:border-x dark:border-slate-800/70 relative pb-24 transition-colors">
        <Header
          periodInfo={metrics.periodInfo}
          activePage={activePage}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onNavigate={handleNavigate}
        />

        <OfflineIndicator />

        <main className="px-4 pt-2">
          {activePage === 'beranda' && (
            <BerandaPage
              userName={budget.userName}
              pklPlace={budget.pklPlace}
              avatarDataUrl={budget.avatarDataUrl}
              remainingBalance={metrics.remainingBalance}
              totalBudgetPool={metrics.totalBudgetPool}
              remainingPercent={metrics.remainingPercent}
              dailySafeLimit={metrics.dailySafeLimit}
              todayExpense={metrics.todayExpense}
              dailyStatus={metrics.dailyStatus}
              dailyStatusMessage={metrics.dailyStatusMessage}
              profileBadge={metrics.profileBadge}
              periodInfo={metrics.periodInfo}
              recentTransactions={transactions.slice(0, 5)}
              totalTransactionCount={transactions.length}
              quickTemplates={quickTemplates}
              onQuickAdd={handleQuickAdd}
              onAddQuickTemplate={handleOpenAddQuickTemplate}
              onEditQuickTemplate={handleOpenEditQuickTemplate}
              onDeleteQuickTemplate={handleDeleteQuickTemplate}
              onResetQuickTemplates={() => {
                void handleResetQuickTemplates();
              }}
              onEditTransaction={openEditModal}
              onOpenAddModal={openAddModal}
              onOpenNotifModal={() => {
                setSharedNotifText('');
                setIsNotifModalOpen(true);
              }}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'riwayat' && (
            <RiwayatPage
              transactions={transactions}
              onEdit={openEditModal}
              onDuplicate={(tx) =>
                handleSaveTransaction({
                  type: tx.type,
                  category: tx.category,
                  amount: tx.amount,
                  note: tx.note,
                  date: getLocalDateString(),
                })
              }
              onDelete={handleDeleteTransaction}
              onOpenAddModal={openAddModal}
            />
          )}

          {activePage === 'statistik' && (
            <StatistikPage
              totalExpense={metrics.totalExpense}
              totalBudgetPool={metrics.totalBudgetPool}
              totalAdditionalIncome={metrics.totalAdditionalIncome}
              initialAllowance={budget.totalAllowance}
              remainingBalance={metrics.remainingBalance}
              averageDailyExpense={metrics.averageDailyExpense}
              dailySafeLimit={metrics.dailySafeLimit}
              projectedEndBalance={metrics.projectedEndBalance}
              runwayDays={metrics.runwayDays}
              periodInfo={metrics.periodInfo}
              categoryBreakdown={categoryBreakdown}
              last7DaysSpend={last7DaysSpend}
              transactionCount={transactions.length}
              isDark={isDark}
              onExportCsv={handleExportCsv}
              onCopySummary={handleCopySummary}
            />
          )}

          {activePage === 'anggaran' && (
            <AnggaranPage
              budget={budget}
              periodInfo={metrics.periodInfo}
              transactionCount={transactions.length}
              isDark={isDark}
              onToggleTheme={toggleTheme}
              onSaveBudget={handleSaveBudget}
              onUpdateAvatar={handleUpdateAvatar}
              onStartFromZero={handleStartFromZero}
              onResetToDemo={handleResetToDemo}
              onExportCsv={handleExportCsv}
            />
          )}
        </main>

        <BottomNav
          activePage={activePage}
          onChangePage={handleNavigate}
          onOpenAddModal={openAddModal}
        />

        <TransactionModal
          isOpen={isTxModalOpen}
          editingTransaction={editingTx}
          onClose={() => {
            setIsTxModalOpen(false);
            setEditingTx(null);
          }}
          onSave={handleSaveTransaction}
          onDelete={handleDeleteTransaction}
        />

        <NotifParserModal
          isOpen={isNotifModalOpen}
          initialText={sharedNotifText}
          onClose={() => {
            setIsNotifModalOpen(false);
            setSharedNotifText('');
          }}
          onSave={(input) => handleSaveTransaction(input)}
        />

        <QuickTemplateModal
          isOpen={isQuickModalOpen}
          editingTemplate={editingQuickTpl}
          defaultGroup={quickModalGroup}
          onClose={() => {
            setIsQuickModalOpen(false);
            setEditingQuickTpl(null);
          }}
          onSave={handleSaveQuickTemplate}
          onDelete={handleDeleteQuickTemplate}
        />
      </div>
    </div>
  );
}
