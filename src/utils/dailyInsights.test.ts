import test from 'node:test';
import assert from 'node:assert/strict';
import type { Transaction } from '../types/finance';
import {
  calculateSavingStreak,
  calculateTodayRemaining,
  getProfileStatusBadge,
} from './dailyInsights';

function makeExpense(date: string, amount: number, id = date): Transaction {
  return {
    id,
    type: 'expense',
    category: 'Makan & Minum',
    amount,
    note: 'Test',
    date,
    time: '12:00',
    createdAt: Date.now(),
  };
}

test('calculateTodayRemaining returns positive remaining and over-limit diff', () => {
  assert.deepEqual(calculateTodayRemaining(73473, 18000), {
    remaining: 55473,
    isOver: false,
  });
  assert.deepEqual(calculateTodayRemaining(50000, 65000), {
    remaining: -15000,
    isOver: true,
  });
});

test('calculateSavingStreak counts consecutive days within daily limit', () => {
  const transactions: Transaction[] = [
    makeExpense('2026-11-16', 20000, 'd0'),
    makeExpense('2026-11-15', 30000, 'd1'),
    makeExpense('2026-11-14', 45000, 'd2'),
    makeExpense('2026-11-13', 90000, 'd3'), // breaks streak
  ];

  assert.equal(
    calculateSavingStreak(transactions, 50000, '2026-11-16', 10),
    3
  );

  // If today exceeds limit, streak resets to 0
  const overToday = [makeExpense('2026-11-16', 60000, 'over')];
  assert.equal(calculateSavingStreak(overToday, 50000, '2026-11-16', 10), 0);
});

test('getProfileStatusBadge picks appropriate label and tone', () => {
  assert.equal(
    getProfileStatusBadge({
      dailyStatus: 'safe',
      remainingBalance: 500000,
      savingStreakDays: 4,
    }).label,
    'Streak Hemat 4 Hari'
  );

  assert.equal(
    getProfileStatusBadge({
      dailyStatus: 'safe',
      remainingBalance: 500000,
      savingStreakDays: 1,
    }).label,
    'Aman di Bawah Limit'
  );

  assert.equal(
    getProfileStatusBadge({
      dailyStatus: 'warning',
      remainingBalance: 500000,
      savingStreakDays: 2,
    }).tone,
    'amber'
  );

  assert.equal(
    getProfileStatusBadge({
      dailyStatus: 'overbudget',
      remainingBalance: 500000,
      savingStreakDays: 0,
    }).label,
    'Lewat Limit Hari Ini'
  );
});
