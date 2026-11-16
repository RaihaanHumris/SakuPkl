import type { DailySafetyStatus, Transaction } from '../types/finance';
import { offsetDateString } from './format';

export interface TodayRemainingResult {
  remaining: number;
  isOver: boolean;
}

export interface ProfileStatusBadge {
  label: string;
  tone: 'emerald' | 'amber' | 'rose';
  streakDays: number;
}

export function calculateTodayRemaining(
  dailySafeLimit: number,
  todayExpense: number
): TodayRemainingResult {
  const diff = dailySafeLimit - todayExpense;
  return {
    remaining: diff,
    isOver: diff < 0,
  };
}

export function calculateSavingStreak(
  transactions: Transaction[],
  dailySafeLimit: number,
  todayStr: string,
  maxDays = 30
): number {
  if (dailySafeLimit <= 0 || maxDays <= 0) return 0;

  const expenseByDate = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.type === 'expense') {
      expenseByDate.set(tx.date, (expenseByDate.get(tx.date) ?? 0) + tx.amount);
    }
  }

  const todaySpent = expenseByDate.get(todayStr) ?? 0;
  if (todaySpent > dailySafeLimit) {
    return 0;
  }

  const todayDate = new Date(`${todayStr}T00:00:00`);
  if (Number.isNaN(todayDate.getTime())) {
    return todaySpent <= dailySafeLimit ? 1 : 0;
  }

  let streak = 0;
  const limitDays = Math.min(Math.max(1, maxDays), 90);

  for (let offset = 0; offset < limitDays; offset++) {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - offset);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const daySpent = expenseByDate.get(dateKey) ?? 0;
    if (daySpent <= dailySafeLimit) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export function getProfileStatusBadge(params: {
  dailyStatus: DailySafetyStatus;
  remainingBalance: number;
  savingStreakDays: number;
  todayStr?: string;
}): ProfileStatusBadge {
  const { dailyStatus, remainingBalance, savingStreakDays } = params;

  if (remainingBalance <= 0) {
    return {
      label: 'Saldo Habis',
      tone: 'rose',
      streakDays: 0,
    };
  }

  if (dailyStatus === 'overbudget') {
    return {
      label: 'Lewat Limit Hari Ini',
      tone: 'rose',
      streakDays: 0,
    };
  }

  if (dailyStatus === 'warning') {
    return {
      label: 'Hampir Limit',
      tone: 'amber',
      streakDays: savingStreakDays,
    };
  }

  if (savingStreakDays >= 2) {
    return {
      label: `Streak Hemat ${savingStreakDays} Hari`,
      tone: 'emerald',
      streakDays: savingStreakDays,
    };
  }

  return {
    label: 'Aman di Bawah Limit',
    tone: 'emerald',
    streakDays: savingStreakDays,
  };
}

export { offsetDateString };
