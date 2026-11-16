import type {
  ExpenseCategory,
  QuickTemplate,
  QuickTemplateGroup,
} from '../types/finance';

export interface QuickTemplateInput {
  emoji: string;
  label: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
  group: QuickTemplateGroup;
}

const VALID_GROUPS: QuickTemplateGroup[] = ['makanan', 'minuman', 'pkl'];
const VALID_CATEGORIES: ExpenseCategory[] = [
  'Makan & Minum',
  'Transportasi',
  'Belanja Online',
  'Kebutuhan PKL',
  'Jajan & Kopi',
  'Lain-lain',
];

export function isValidQuickGroup(value: unknown): value is QuickTemplateGroup {
  return (
    typeof value === 'string' &&
    VALID_GROUPS.includes(value as QuickTemplateGroup)
  );
}

export function isValidExpenseCategory(value: unknown): value is ExpenseCategory {
  return (
    typeof value === 'string' &&
    VALID_CATEGORIES.includes(value as ExpenseCategory)
  );
}

export function sanitizeQuickTemplate(raw: unknown): QuickTemplate | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;

  if (typeof candidate.id !== 'string' || !candidate.id.trim()) return null;
  if (typeof candidate.label !== 'string' || !candidate.label.trim()) return null;
  if (typeof candidate.amount !== 'number' || !Number.isFinite(candidate.amount) || candidate.amount <= 0) {
    return null;
  }

  const label = candidate.label.trim().slice(0, 32);
  const emoji =
    typeof candidate.emoji === 'string' && candidate.emoji.trim()
      ? candidate.emoji.trim().slice(0, 8)
      : '🍽️';
  const category: ExpenseCategory = isValidExpenseCategory(candidate.category)
    ? candidate.category
    : 'Lain-lain';
  const group: QuickTemplateGroup = isValidQuickGroup(candidate.group)
    ? candidate.group
    : 'makanan';
  const note =
    typeof candidate.note === 'string' && candidate.note.trim()
      ? candidate.note.trim().slice(0, 60)
      : label;

  return {
    id: candidate.id.trim(),
    emoji,
    label,
    amount: Math.round(candidate.amount),
    category,
    note,
    group,
  };
}

export function normalizeQuickTemplates(
  raw: unknown,
  fallback: QuickTemplate[]
): QuickTemplate[] {
  if (!Array.isArray(raw)) {
    return fallback;
  }

  const sanitized: QuickTemplate[] = [];
  const seenIds = new Set<string>();

  for (const item of raw) {
    const clean = sanitizeQuickTemplate(item);
    if (clean && !seenIds.has(clean.id)) {
      seenIds.add(clean.id);
      sanitized.push(clean);
    }
  }

  return sanitized;
}

export function createQuickTemplate(
  input: QuickTemplateInput,
  customId?: string
): QuickTemplate {
  const label = input.label.trim().slice(0, 32) || 'Menu Baru';
  const emoji = input.emoji.trim().slice(0, 8) || '🍽️';
  const amount = Math.max(100, Math.round(input.amount));
  const note = (input.note ?? '').trim().slice(0, 60) || label;

  return {
    id:
      customId ||
      `tpl-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    emoji,
    label,
    amount,
    category: input.category,
    note,
    group: input.group,
  };
}

export function updateQuickTemplateInList(
  list: QuickTemplate[],
  id: string,
  input: QuickTemplateInput
): QuickTemplate[] {
  const label = input.label.trim().slice(0, 32) || 'Menu Baru';
  const emoji = input.emoji.trim().slice(0, 8) || '🍽️';
  const amount = Math.max(100, Math.round(input.amount));
  const note = (input.note ?? '').trim().slice(0, 60) || label;

  return list.map((item) =>
    item.id === id
      ? {
          ...item,
          emoji,
          label,
          amount,
          category: input.category,
          note,
          group: input.group,
        }
      : item
  );
}

export function deleteQuickTemplateFromList(
  list: QuickTemplate[],
  id: string
): QuickTemplate[] {
  return list.filter((item) => item.id !== id);
}
