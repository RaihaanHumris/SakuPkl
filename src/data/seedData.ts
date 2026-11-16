import type {
  BudgetSettings,
  ExpenseCategory,
  IncomeCategory,
  QuickTemplate,
  Transaction,
  TransactionCategory,
} from '../types/finance';
import { offsetDateString } from '../utils/format';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Makan & Minum',
  'Transportasi',
  'Belanja Online',
  'Kebutuhan PKL',
  'Jajan & Kopi',
  'Lain-lain',
];

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Uang Transport',
  'Bonus PKL',
  'Uang Saku',
  'Lain-lain',
];

export const FILTER_CATEGORIES: Array<'Semua' | ExpenseCategory> = [
  'Semua',
  ...EXPENSE_CATEGORIES,
];

export const NOMINAL_PRESETS = [5000, 10000, 15000, 20000, 50000];

export const ALLOWANCE_PRESETS = [500000, 1000000, 1500000, 2000000];

export const DURATION_PRESETS = [14, 30, 60, 90];

export interface CategoryStyle {
  bgClass: string;
  textClass: string;
  barClass: string;
}

export const CATEGORY_STYLES: Record<TransactionCategory, CategoryStyle> = {
  'Makan & Minum': {
    bgClass: 'bg-amber-50 dark:bg-amber-950/60',
    textClass: 'text-amber-600 dark:text-amber-400',
    barClass: 'bg-amber-500',
  },
  Transportasi: {
    bgClass: 'bg-sky-50 dark:bg-sky-950/60',
    textClass: 'text-sky-600 dark:text-sky-400',
    barClass: 'bg-sky-500',
  },
  'Belanja Online': {
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/60',
    textClass: 'text-indigo-600 dark:text-indigo-400',
    barClass: 'bg-indigo-500',
  },
  'Kebutuhan PKL': {
    bgClass: 'bg-violet-50 dark:bg-violet-950/60',
    textClass: 'text-violet-600 dark:text-violet-400',
    barClass: 'bg-violet-500',
  },
  'Jajan & Kopi': {
    bgClass: 'bg-orange-50 dark:bg-orange-950/60',
    textClass: 'text-orange-600 dark:text-orange-400',
    barClass: 'bg-orange-500',
  },
  'Lain-lain': {
    bgClass: 'bg-slate-100 dark:bg-slate-800',
    textClass: 'text-slate-600 dark:text-slate-300',
    barClass: 'bg-slate-500',
  },
  'Uang Transport': {
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    barClass: 'bg-emerald-500',
  },
  'Bonus PKL': {
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    barClass: 'bg-emerald-500',
  },
  'Uang Saku': {
    bgClass: 'bg-teal-50 dark:bg-teal-950/60',
    textClass: 'text-teal-600 dark:text-teal-400',
    barClass: 'bg-teal-500',
  },
};

export const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: 'tpl-nasi-telor',
    emoji: '🍳',
    label: 'Nasi Telor',
    amount: 10000,
    category: 'Makan & Minum',
    note: 'Nasi Telor',
    group: 'makanan',
  },
  {
    id: 'tpl-nasi-telor-balado',
    emoji: '🌶️',
    label: 'Nasi Telor Balado',
    amount: 11000,
    category: 'Makan & Minum',
    note: 'Nasi Telor Balado',
    group: 'makanan',
  },
  {
    id: 'tpl-nasi-telur-orak-arik',
    emoji: '🍳',
    label: 'Nasi Telur Orak Arik',
    amount: 12000,
    category: 'Makan & Minum',
    note: 'Nasi Telur Orak Arik',
    group: 'makanan',
  },
  {
    id: 'tpl-nasi-ayam',
    emoji: '🍗',
    label: 'Nasi Ayam',
    amount: 13000,
    category: 'Makan & Minum',
    note: 'Nasi Ayam',
    group: 'makanan',
  },
  {
    id: 'tpl-magelangan',
    emoji: '🍜',
    label: 'Magelangan',
    amount: 14000,
    category: 'Makan & Minum',
    note: 'Magelangan',
    group: 'makanan',
  },
  {
    id: 'tpl-air-putih',
    emoji: '💧',
    label: 'Air Putih',
    amount: 1000,
    category: 'Makan & Minum',
    note: 'Air Putih',
    group: 'minuman',
  },
  {
    id: 'tpl-kukubima',
    emoji: '⚡',
    label: 'Kukubima',
    amount: 4000,
    category: 'Jajan & Kopi',
    note: 'Kukubima',
    group: 'minuman',
  },
  {
    id: 'tpl-ekstrajoss',
    emoji: '🟡',
    label: 'Ekstrajoss',
    amount: 4000,
    category: 'Jajan & Kopi',
    note: 'Ekstrajoss',
    group: 'minuman',
  },
  {
    id: 'tpl-bensin',
    emoji: '⛽',
    label: 'Bensin',
    amount: 20000,
    category: 'Transportasi',
    note: 'Isi bensin motor',
    group: 'pkl',
  },
  {
    id: 'tpl-parkir',
    emoji: '🅿️',
    label: 'Parkir',
    amount: 2000,
    category: 'Transportasi',
    note: 'Parkir area kantor',
    group: 'pkl',
  },
  {
    id: 'tpl-print',
    emoji: '🖨️',
    label: 'Print / Fotokopi',
    amount: 5000,
    category: 'Kebutuhan PKL',
    note: 'Print & fotokopi berkas',
    group: 'pkl',
  },
];

export function createDefaultBudget(): BudgetSettings {
  return {
    userName: 'Muhammad Raihaan Humris',
    pklPlace: '',
    totalAllowance: 1500000,
    durationDays: 30,
    startDate: offsetDateString(-11),
  };
}

export function createFreshZeroBudget(): BudgetSettings {
  return {
    userName: 'Muhammad Raihaan Humris',
    pklPlace: '',
    totalAllowance: 1500000,
    durationDays: 30,
    startDate: offsetDateString(0),
  };
}

export function createSeedTransactions(): Transaction[] {
  const now = Date.now();
  return [
    {
      id: 'seed-1',
      type: 'expense',
      category: 'Makan & Minum',
      amount: 16000,
      note: 'Nasi warteg ayam + es teh',
      date: offsetDateString(0),
      time: '12:25',
      createdAt: now - 1000 * 60 * 90,
    },
    {
      id: 'seed-2',
      type: 'expense',
      category: 'Transportasi',
      amount: 2000,
      note: 'Parkir motor kantor',
      date: offsetDateString(0),
      time: '08:05',
      createdAt: now - 1000 * 60 * 300,
    },
    {
      id: 'seed-3',
      type: 'expense',
      category: 'Jajan & Kopi',
      amount: 12000,
      note: 'Es kopi susu biar melek',
      date: offsetDateString(-1),
      time: '14:40',
      createdAt: now - 1000 * 60 * 60 * 24,
    },
    {
      id: 'seed-4',
      type: 'expense',
      category: 'Makan & Minum',
      amount: 18000,
      note: 'Nasi padang telur balado',
      date: offsetDateString(-1),
      time: '12:15',
      createdAt: now - 1000 * 60 * 60 * 26,
    },
    {
      id: 'seed-5',
      type: 'expense',
      category: 'Transportasi',
      amount: 25000,
      note: 'Pertalite full tank berangkat PKL',
      date: offsetDateString(-2),
      time: '07:30',
      createdAt: now - 1000 * 60 * 60 * 50,
    },
    {
      id: 'seed-6',
      type: 'expense',
      category: 'Kebutuhan PKL',
      amount: 14000,
      note: 'Jilid & print draft logbook PKL',
      date: offsetDateString(-3),
      time: '16:10',
      createdAt: now - 1000 * 60 * 60 * 72,
    },
    {
      id: 'seed-7',
      type: 'income',
      category: 'Uang Transport',
      amount: 150000,
      note: 'Uang transport mingguan dari kantor',
      date: offsetDateString(-4),
      time: '15:00',
      createdAt: now - 1000 * 60 * 60 * 96,
    },
    {
      id: 'seed-8',
      type: 'expense',
      category: 'Makan & Minum',
      amount: 22000,
      note: 'Ayam geprek bareng tim divisi',
      date: offsetDateString(-4),
      time: '12:30',
      createdAt: now - 1000 * 60 * 60 * 99,
    },
    {
      id: 'seed-9',
      type: 'expense',
      category: 'Jajan & Kopi',
      amount: 10000,
      note: 'Gorengan & teh tarik sore',
      date: offsetDateString(-5),
      time: '15:45',
      createdAt: now - 1000 * 60 * 60 * 120,
    },
    {
      id: 'seed-10',
      type: 'expense',
      category: 'Kebutuhan PKL',
      amount: 25000,
      note: 'Beli map plastik & pulpen kerja',
      date: offsetDateString(-6),
      time: '10:20',
      createdAt: now - 1000 * 60 * 60 * 146,
    },
    {
      id: 'seed-11',
      type: 'expense',
      category: 'Makan & Minum',
      amount: 45000,
      note: 'Makan siang & beli galon kos',
      date: offsetDateString(-8),
      time: '13:10',
      createdAt: now - 1000 * 60 * 60 * 192,
    },
    {
      id: 'seed-12',
      type: 'expense',
      category: 'Lain-lain',
      amount: 35000,
      note: 'Laundry seragam PKL mingguan',
      date: offsetDateString(-9),
      time: '18:20',
      createdAt: now - 1000 * 60 * 60 * 216,
    },
    {
      id: 'seed-13',
      type: 'expense',
      category: 'Transportasi',
      amount: 30000,
      note: 'Bensin + tambal ban darurat',
      date: offsetDateString(-10),
      time: '07:50',
      createdAt: now - 1000 * 60 * 60 * 240,
    },
  ];
}
