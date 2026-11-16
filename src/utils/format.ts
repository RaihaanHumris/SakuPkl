import type { PeriodInfo } from '../types/finance';

const BULAN_INDO = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const HARI_INDO_SINGKAT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function formatRupiah(amount: number, showNegativeSign = false): string {
  const absValue = Math.abs(Math.round(amount));
  const formatted = absValue.toLocaleString('id-ID');
  if (amount < 0 || showNegativeSign) {
    return `- Rp ${formatted}`;
  }
  return `Rp ${formatted}`;
}

export function formatCompactRupiah(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) {
    const val = (abs / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1).replace('.', ',');
    return `${val}jt`;
  }
  if (abs >= 1_000) {
    const val = Math.round(abs / 1_000);
    return `${val}rb`;
  }
  return String(abs);
}

export function formatThousandsInput(rawValue: string): string {
  const digitsOnly = rawValue.replace(/\D/g, '');
  if (!digitsOnly) return '';
  const num = parseInt(digitsOnly, 10);
  if (Number.isNaN(num)) return '';
  return num.toLocaleString('id-ID');
}

export function parseThousandsInput(formattedValue: string): number {
  const digitsOnly = formattedValue.replace(/\D/g, '');
  if (!digitsOnly) return 0;
  return parseInt(digitsOnly, 10) || 0;
}

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeString(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function offsetDateString(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return getLocalDateString(date);
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function formatDateHeader(dateStr: string): string {
  const today = getLocalDateString();
  const yesterday = offsetDateString(-1);

  if (dateStr === today) return 'Hari Ini';
  if (dateStr === yesterday) return 'Kemarin';

  const date = parseLocalDate(dateStr);
  const day = date.getDate();
  const monthName = BULAN_INDO[date.getMonth()] ?? '';
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
}

export function formatReadableDate(dateStr: string): string {
  const date = parseLocalDate(dateStr);
  const day = date.getDate();
  const monthName = BULAN_INDO[date.getMonth()] ?? '';
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
}

export function formatShortDayLabel(dateStr: string): { dayName: string; dayNum: number } {
  const date = parseLocalDate(dateStr);
  return {
    dayName: HARI_INDO_SINGKAT[date.getDay()] ?? '',
    dayNum: date.getDate(),
  };
}

export function calculatePeriodInfo(startDate: string, durationDays: number): PeriodInfo {
  const safeDuration = Math.max(1, durationDays);
  const todayStr = getLocalDateString();
  const today = parseLocalDate(todayStr);
  const start = parseLocalDate(startDate || todayStr);

  const end = new Date(start);
  end.setDate(end.getDate() + safeDuration - 1);
  const endDate = getLocalDateString(end);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((today.getTime() - start.getTime()) / msPerDay);

  if (diffDays < 0) {
    return {
      currentDay: 0,
      totalDays: safeDuration,
      remainingDays: safeDuration,
      isBeforeStart: true,
      isCompleted: false,
      badgeLabel: `Mulai ${Math.abs(diffDays)} hari lagi`,
      endDate,
    };
  }

  const currentDay = diffDays + 1;
  if (currentDay > safeDuration) {
    return {
      currentDay: safeDuration,
      totalDays: safeDuration,
      remainingDays: 1,
      isBeforeStart: false,
      isCompleted: true,
      badgeLabel: `Hari ke-${safeDuration} dari ${safeDuration} · Selesai`,
      endDate,
    };
  }

  const remainingDays = Math.max(1, safeDuration - diffDays);

  return {
    currentDay,
    totalDays: safeDuration,
    remainingDays,
    isBeforeStart: false,
    isCompleted: false,
    badgeLabel: `Hari ke-${currentDay} dari ${safeDuration}`,
    endDate,
  };
}
