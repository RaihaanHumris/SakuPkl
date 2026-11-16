export type TransactionType = 'expense' | 'income';

export type ExpenseCategory =
  | 'Makan & Minum'
  | 'Transportasi'
  | 'Belanja Online'
  | 'Kebutuhan PKL'
  | 'Jajan & Kopi'
  | 'Lain-lain';

export type IncomeCategory =
  | 'Uang Transport'
  | 'Bonus PKL'
  | 'Uang Saku'
  | 'Lain-lain';

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export type FilterCategory = 'Semua' | ExpenseCategory;

export type ActivePage = 'beranda' | 'riwayat' | 'statistik' | 'anggaran';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  note: string;
  date: string; // YYYY-MM-DD (local date)
  time: string; // HH:mm
  createdAt: number;
}

export interface BudgetSettings {
  userName: string;
  pklPlace: string;
  avatarDataUrl?: string;
  totalAllowance: number;
  durationDays: number;
  startDate: string; // YYYY-MM-DD
}

export type QuickTemplateGroup = 'makanan' | 'minuman' | 'pkl';

export interface QuickTemplate {
  id: string;
  emoji: string;
  label: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
  group: QuickTemplateGroup;
}

export type DailySafetyStatus = 'safe' | 'warning' | 'overbudget';

export interface PeriodInfo {
  currentDay: number;
  totalDays: number;
  remainingDays: number;
  isBeforeStart: boolean;
  isCompleted: boolean;
  badgeLabel: string;
  endDate: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  variant?: 'success' | 'info' | 'warning';
  undoAction?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}
