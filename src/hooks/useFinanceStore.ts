import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createDefaultBudget,
  createFreshZeroBudget,
  createSeedTransactions,
  EXPENSE_CATEGORIES,
  QUICK_TEMPLATES,
} from '../data/seedData';
import type {
  BudgetSettings,
  DailySafetyStatus,
  ExpenseCategory,
  QuickTemplate,
  Transaction,
  TransactionCategory,
  TransactionType,
} from '../types/finance';
import {
  calculatePeriodInfo,
  getCurrentTimeString,
  getLocalDateString,
  offsetDateString,
} from '../utils/format';
import {
  calculateSavingStreak,
  calculateTodayRemaining,
  getProfileStatusBadge,
} from '../utils/dailyInsights';
import {
  createQuickTemplate,
  deleteQuickTemplateFromList,
  normalizeQuickTemplates,
  updateQuickTemplateInList,
  type QuickTemplateInput,
} from '../utils/quickTemplates';
import { sanitizeAvatarDataUrl } from '../utils/avatar';

const STORAGE_KEY_BUDGET = 'sakupkl_budget_v1';
const STORAGE_KEY_TRANSACTIONS = 'sakupkl_transactions_v1';
const STORAGE_KEY_QUICK_TEMPLATES = 'sakupkl_quick_templates_v1';

function loadInitialBudget(): BudgetSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BUDGET);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<BudgetSettings>;
      if (
        typeof parsed.totalAllowance === 'number' &&
        typeof parsed.durationDays === 'number' &&
        typeof parsed.startDate === 'string'
      ) {
        return {
          userName:
            typeof parsed.userName === 'string' &&
            parsed.userName.trim() &&
            parsed.userName.trim() !== 'Anak PKL'
              ? parsed.userName
              : 'Muhammad Raihaan Humris',
          pklPlace: typeof parsed.pklPlace === 'string' ? parsed.pklPlace : '',
          totalAllowance: Math.max(0, parsed.totalAllowance),
          durationDays: Math.max(1, parsed.durationDays),
          startDate: parsed.startDate,
          avatarDataUrl: sanitizeAvatarDataUrl(parsed.avatarDataUrl),
        };
      }
    }
  } catch {
    // Fallback to default budget
  }
  return createDefaultBudget();
}

function loadInitialTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as Transaction[];
      }
    }
  } catch {
    // Fallback to seed transactions
  }
  return createSeedTransactions();
}

function loadInitialQuickTemplates(): QuickTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUICK_TEMPLATES);
    if (raw) {
      const parsed = JSON.parse(raw);
      return normalizeQuickTemplates(parsed, QUICK_TEMPLATES);
    }
  } catch {
    // Fallback to default templates
  }
  return QUICK_TEMPLATES;
}

export interface TransactionInput {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  note: string;
  date: string;
  time?: string;
}

export interface CategoryBreakdownItem {
  category: ExpenseCategory;
  amount: number;
  count: number;
  percentage: number;
}

export interface DailyTrendItem {
  date: string;
  amount: number;
}

export function useFinanceStore() {
  const [budget, setBudget] = useState<BudgetSettings>(loadInitialBudget);
  const [transactions, setTransactions] = useState<Transaction[]>(loadInitialTransactions);
  const [quickTemplates, setQuickTemplates] = useState<QuickTemplate[]>(
    loadInitialQuickTemplates
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUDGET, JSON.stringify(budget));
    } catch {
      // Ignore storage quota errors
    }
  }, [budget]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch {
      // Ignore storage quota errors
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_QUICK_TEMPLATES,
        JSON.stringify(quickTemplates)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [quickTemplates]);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      if (a.time !== b.time) return b.time.localeCompare(a.time);
      return b.createdAt - a.createdAt;
    });
  }, [transactions]);

  const todayStr = getLocalDateString();

  const metrics = useMemo(() => {
    let totalExpense = 0;
    let totalAdditionalIncome = 0;
    let todayExpense = 0;
    let todayIncome = 0;

    for (const tx of transactions) {
      if (tx.type === 'expense') {
        totalExpense += tx.amount;
        if (tx.date === todayStr) {
          todayExpense += tx.amount;
        }
      } else {
        totalAdditionalIncome += tx.amount;
        if (tx.date === todayStr) {
          todayIncome += tx.amount;
        }
      }
    }

    const totalBudgetPool = budget.totalAllowance + totalAdditionalIncome;
    const remainingBalance = totalBudgetPool - totalExpense;
    const remainingPercent =
      totalBudgetPool > 0
        ? Math.max(0, Math.min(100, Math.round((remainingBalance / totalBudgetPool) * 100)))
        : 0;

    const periodInfo = calculatePeriodInfo(budget.startDate, budget.durationDays);

    const dailySafeLimit = Math.max(
      0,
      Math.floor(remainingBalance / Math.max(1, periodInfo.remainingDays))
    );

    let dailyStatus: DailySafetyStatus = 'safe';
    let dailyStatusMessage = 'Pengeluaran hari ini masih aman terkendali.';

    if (remainingBalance <= 0) {
      dailyStatus = 'overbudget';
      dailyStatusMessage = 'Saldo anggaran PKL sudah habis, evaluasi pengeluaranmu!';
    } else if (todayExpense > dailySafeLimit) {
      dailyStatus = 'overbudget';
      dailyStatusMessage = 'Pengeluaran hari ini melewati batas aman harian!';
    } else if (dailySafeLimit > 0 && todayExpense >= dailySafeLimit * 0.8) {
      dailyStatus = 'warning';
      dailyStatusMessage = 'Mendekati batas aman harian, mulai berhemat ya.';
    }

    const activeDaysCount = Math.max(1, periodInfo.currentDay || 1);
    const averageDailyExpense = Math.round(totalExpense / activeDaysCount);

    // Proyeksi akhir PKL berdasarkan rata-rata pengeluaran harian
    const projectedFutureExpense = averageDailyExpense * Math.max(0, periodInfo.remainingDays - 1);
    const projectedEndBalance = remainingBalance - todayExpense >= 0
      ? remainingBalance - projectedFutureExpense
      : remainingBalance - projectedFutureExpense;

    const runwayDays =
      averageDailyExpense > 0
        ? Math.max(0, Math.floor(remainingBalance / averageDailyExpense))
        : periodInfo.remainingDays;

    const todayRemaining = calculateTodayRemaining(dailySafeLimit, todayExpense);
    const savingStreakDays = calculateSavingStreak(
      transactions,
      dailySafeLimit,
      todayStr,
      Math.max(1, periodInfo.currentDay || 1)
    );
    const profileBadge = getProfileStatusBadge({
      dailyStatus,
      remainingBalance,
      savingStreakDays,
    });

    return {
      totalExpense,
      totalAdditionalIncome,
      totalBudgetPool,
      remainingBalance,
      remainingPercent,
      todayExpense,
      todayIncome,
      todayRemaining,
      profileBadge,
      dailySafeLimit,
      dailyStatus,
      dailyStatusMessage,
      periodInfo,
      averageDailyExpense,
      projectedEndBalance,
      runwayDays,
    };
  }, [budget, transactions, todayStr]);

  const categoryBreakdown = useMemo<CategoryBreakdownItem[]>(() => {
    const totals = new Map<ExpenseCategory, { amount: number; count: number }>();
    for (const cat of EXPENSE_CATEGORIES) {
      totals.set(cat, { amount: 0, count: 0 });
    }

    let expenseSum = 0;
    for (const tx of transactions) {
      if (tx.type === 'expense') {
        expenseSum += tx.amount;
        const cat = (EXPENSE_CATEGORIES.includes(tx.category as ExpenseCategory)
          ? tx.category
          : 'Lain-lain') as ExpenseCategory;
        const current = totals.get(cat) ?? { amount: 0, count: 0 };
        totals.set(cat, {
          amount: current.amount + tx.amount,
          count: current.count + 1,
        });
      }
    }

    return EXPENSE_CATEGORIES.map((category) => {
      const entry = totals.get(category) ?? { amount: 0, count: 0 };
      const percentage =
        expenseSum > 0 ? Math.round((entry.amount / expenseSum) * 100) : 0;
      return {
        category,
        amount: entry.amount,
        count: entry.count,
        percentage,
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const last7DaysSpend = useMemo<DailyTrendItem[]>(() => {
    const days: DailyTrendItem[] = [];
    const byDate = new Map<string, number>();

    for (const tx of transactions) {
      if (tx.type === 'expense') {
        byDate.set(tx.date, (byDate.get(tx.date) ?? 0) + tx.amount);
      }
    }

    for (let offset = -6; offset <= 0; offset++) {
      const d = offsetDateString(offset);
      days.push({
        date: d,
        amount: byDate.get(d) ?? 0,
      });
    }

    return days;
  }, [transactions]);

  const addTransaction = useCallback((input: TransactionInput): Transaction => {
    const now = Date.now();
    const newTx: Transaction = {
      id: `tx-${now}-${Math.random().toString(36).slice(2, 7)}`,
      type: input.type,
      category: input.category,
      amount: Math.max(0, Math.round(input.amount)),
      note: input.note.trim() || input.category,
      date: input.date || getLocalDateString(),
      time: input.time || getCurrentTimeString(),
      createdAt: now,
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  }, []);

  const updateTransaction = useCallback(
    (id: string, input: TransactionInput): Transaction | null => {
      let updatedTx: Transaction | null = null;
      setTransactions((prev) =>
        prev.map((tx) => {
          if (tx.id !== id) return tx;
          updatedTx = {
            ...tx,
            type: input.type,
            category: input.category,
            amount: Math.max(0, Math.round(input.amount)),
            note: input.note.trim() || input.category,
            date: input.date || tx.date,
            time: input.time || tx.time,
          };
          return updatedTx;
        })
      );
      return updatedTx;
    },
    []
  );

  const deleteTransaction = useCallback((id: string): Transaction | null => {
    let deleted: Transaction | null = null;
    setTransactions((prev) => {
      deleted = prev.find((tx) => tx.id === id) ?? null;
      return prev.filter((tx) => tx.id !== id);
    });
    return deleted;
  }, []);

  const restoreTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => {
      if (prev.some((item) => item.id === tx.id)) return prev;
      return [tx, ...prev];
    });
  }, []);

  const updateBudget = useCallback((nextBudget: BudgetSettings) => {
    setBudget((prev) => ({
      userName: nextBudget.userName.trim() || 'Muhammad Raihaan Humris',
      pklPlace: nextBudget.pklPlace.trim(),
      totalAllowance: Math.max(0, Math.round(nextBudget.totalAllowance)),
      durationDays: Math.max(1, Math.round(nextBudget.durationDays)),
      startDate: nextBudget.startDate || getLocalDateString(),
      avatarDataUrl:
        nextBudget.avatarDataUrl !== undefined
          ? sanitizeAvatarDataUrl(nextBudget.avatarDataUrl)
          : prev.avatarDataUrl,
    }));
  }, []);

  const updateAvatar = useCallback((avatarDataUrl: string | undefined) => {
    setBudget((prev) => ({
      ...prev,
      avatarDataUrl: sanitizeAvatarDataUrl(avatarDataUrl),
    }));
  }, []);

  const startFromZero = useCallback((customBudget?: Partial<BudgetSettings>) => {
    const fresh = createFreshZeroBudget();
    setBudget((prev) => ({
      ...fresh,
      userName: customBudget?.userName ?? prev.userName,
      pklPlace: customBudget?.pklPlace ?? prev.pklPlace,
      totalAllowance:
        typeof customBudget?.totalAllowance === 'number'
          ? Math.max(0, Math.round(customBudget.totalAllowance))
          : prev.totalAllowance,
      durationDays:
        typeof customBudget?.durationDays === 'number'
          ? Math.max(1, Math.round(customBudget.durationDays))
          : prev.durationDays,
      startDate: customBudget?.startDate || getLocalDateString(),
      avatarDataUrl:
        customBudget?.avatarDataUrl !== undefined
          ? sanitizeAvatarDataUrl(customBudget.avatarDataUrl)
          : prev.avatarDataUrl,
    }));
    setTransactions([]);
  }, []);

  const resetAllData = useCallback(() => {
    setBudget(createDefaultBudget());
    setTransactions(createSeedTransactions());
  }, []);

  const addQuickTemplate = useCallback(
    (input: QuickTemplateInput): QuickTemplate => {
      const created = createQuickTemplate(input);
      setQuickTemplates((prev) => [...prev, created]);
      return created;
    },
    []
  );

  const updateQuickTemplate = useCallback(
    (id: string, input: QuickTemplateInput) => {
      setQuickTemplates((prev) => updateQuickTemplateInList(prev, id, input));
    },
    []
  );

  const deleteQuickTemplate = useCallback((id: string): QuickTemplate | null => {
    let deleted: QuickTemplate | null = null;
    setQuickTemplates((prev) => {
      deleted = prev.find((item) => item.id === id) ?? null;
      return deleteQuickTemplateFromList(prev, id);
    });
    return deleted;
  }, []);

  const restoreQuickTemplate = useCallback((tpl: QuickTemplate) => {
    setQuickTemplates((prev) => {
      if (prev.some((item) => item.id === tpl.id)) return prev;
      return [...prev, tpl];
    });
  }, []);

  const resetQuickTemplates = useCallback(() => {
    setQuickTemplates(QUICK_TEMPLATES);
  }, []);

  const exportToCsv = useCallback(() => {
    const escapeCsv = (val: string | number): string => {
      const str = String(val);
      if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ['Tanggal', 'Tipe', 'Kategori', 'Catatan', 'Nominal'];
    const rows = sortedTransactions.map((tx) => [
      tx.date,
      tx.type === 'expense' ? 'Pengeluaran' : 'Pemasukan',
      tx.category,
      tx.note,
      tx.amount,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sakupkl-transaksi-${getLocalDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [sortedTransactions]);

  return {
    budget,
    transactions: sortedTransactions,
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
  };
}
