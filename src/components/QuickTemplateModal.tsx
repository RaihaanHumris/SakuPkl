import { FileText, Trash2, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { EXPENSE_CATEGORIES } from '../data/seedData';
import type {
  ExpenseCategory,
  QuickTemplate,
  QuickTemplateGroup,
} from '../types/finance';
import {
  formatCompactRupiah,
  formatThousandsInput,
  parseThousandsInput,
} from '../utils/format';
import type { QuickTemplateInput } from '../utils/quickTemplates';
import { CategoryIcon } from './CategoryIcon';

interface QuickTemplateModalProps {
  isOpen: boolean;
  editingTemplate: QuickTemplate | null;
  defaultGroup?: QuickTemplateGroup;
  onClose: () => void;
  onSave: (input: QuickTemplateInput, editId?: string) => void;
  onDelete?: (template: QuickTemplate) => void;
}

const EMOJI_OPTIONS = [
  '🍳',
  '🍗',
  '🍜',
  '🍛',
  '🌶️',
  '💧',
  '🧊',
  '⚡',
  '🟡',
  '☕',
  '⛽',
  '🅿️',
  '🖨️',
  '🛒',
  '📦',
  '💼',
];

const GROUP_OPTIONS: Array<{
  id: QuickTemplateGroup;
  label: string;
  defaultCategory: ExpenseCategory;
}> = [
  { id: 'makanan', label: 'Makanan', defaultCategory: 'Makan & Minum' },
  { id: 'minuman', label: 'Minuman', defaultCategory: 'Jajan & Kopi' },
  { id: 'pkl', label: 'Transport & PKL', defaultCategory: 'Transportasi' },
];

const QUICK_PRICE_PRESETS = [2000, 3000, 5000, 10000, 15000, 20000];

export function QuickTemplateModal({
  isOpen,
  editingTemplate,
  defaultGroup = 'makanan',
  onClose,
  onSave,
  onDelete,
}: QuickTemplateModalProps) {
  const [emoji, setEmoji] = useState('🍳');
  const [label, setLabel] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [group, setGroup] = useState<QuickTemplateGroup>(defaultGroup);
  const [category, setCategory] = useState<ExpenseCategory>('Makan & Minum');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingTemplate) {
      setEmoji(editingTemplate.emoji);
      setLabel(editingTemplate.label);
      setAmountInput(editingTemplate.amount.toLocaleString('id-ID'));
      setGroup(editingTemplate.group);
      setCategory(editingTemplate.category);
      setNote(
        editingTemplate.note === editingTemplate.label
          ? ''
          : editingTemplate.note
      );
    } else {
      const matchedGroup =
        GROUP_OPTIONS.find((item) => item.id === defaultGroup) ??
        GROUP_OPTIONS[0];
      setEmoji(
        defaultGroup === 'minuman'
          ? '🧊'
          : defaultGroup === 'pkl'
            ? '⛽'
            : '🍳'
      );
      setLabel('');
      setAmountInput('');
      setGroup(defaultGroup);
      setCategory(matchedGroup.defaultCategory);
      setNote('');
    }
    setErrorMsg('');
  }, [isOpen, editingTemplate, defaultGroup]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEditing = Boolean(editingTemplate);

  const handleGroupChange = (nextGroup: QuickTemplateGroup) => {
    setGroup(nextGroup);
    if (!isEditing) {
      const found = GROUP_OPTIONS.find((item) => item.id === nextGroup);
      if (found) setCategory(found.defaultCategory);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanLabel = label.trim();
    const numericAmount = parseThousandsInput(amountInput);

    if (!cleanLabel) {
      setErrorMsg('Masukkan nama menu atau pengeluaran cepat.');
      return;
    }
    if (numericAmount <= 0) {
      setErrorMsg('Masukkan harga lebih dari Rp 0.');
      return;
    }

    onSave(
      {
        emoji,
        label: cleanLabel,
        amount: numericAmount,
        category,
        note: note.trim() || cleanLabel,
        group,
      },
      editingTemplate?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/55 dark:bg-black/70 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-qt-title"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 max-h-[92dvh] overflow-y-auto animate-[slideUp_180ms_cubic-bezier(0.16,1,0.3,1)] pb-[env(safe-area-inset-bottom)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="flex items-center justify-between px-5 pt-2.5 pb-2">
          <div>
            <h2
              id="modal-qt-title"
              className="text-base font-bold text-slate-900 dark:text-slate-100"
            >
              {isEditing ? 'Ubah Menu Tambah Cepat' : 'Tambah Menu Favorit'}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Ketuk 1x di Beranda untuk langsung mencatat
            </p>
          </div>
          <div className="flex items-center gap-1">
            {isEditing && editingTemplate && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(editingTemplate);
                  onClose();
                }}
                aria-label={`Hapus menu ${editingTemplate.label}`}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors touch-manipulation"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal menu cepat"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-4">
          {/* Emoji Picker */}
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pilih Ikon Emoji
            </p>
            <div className="grid grid-cols-8 gap-1.5">
              {EMOJI_OPTIONS.map((item) => {
                const isSelected = emoji === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setEmoji(item)}
                    aria-label={`Pilih emoji ${item}`}
                    aria-pressed={isSelected}
                    className={`min-h-[40px] rounded-xl text-lg flex items-center justify-center border transition-all touch-manipulation ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-1 ring-emerald-500 scale-105'
                        : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nama Menu */}
          <div>
            <label
              htmlFor="qt-label"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Nama Menu / Item
            </label>
            <input
              id="qt-label"
              type="text"
              maxLength={32}
              autoFocus={!isEditing}
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Misal: Es Teh Manis / Nasi Pecel"
              className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Harga */}
          <div>
            <label
              htmlFor="qt-amount"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Harga
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                Rp
              </span>
              <input
                id="qt-amount"
                type="text"
                inputMode="numeric"
                value={amountInput}
                onChange={(e) => {
                  setAmountInput(formatThousandsInput(e.target.value));
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="10.000"
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PRICE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setAmountInput(preset.toLocaleString('id-ID'));
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-400 text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums whitespace-nowrap shrink-0 active:scale-95 transition-all touch-manipulation"
                >
                  {formatCompactRupiah(preset)}
                </button>
              ))}
            </div>

            {errorMsg && (
              <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Kelompok Tab */}
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Kelompok Tab Tambah Cepat
            </p>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              {GROUP_OPTIONS.map((item) => {
                const isSelected = group === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleGroupChange(item.id)}
                    className={`min-h-[40px] px-2 rounded-lg text-[11px] font-semibold transition-all touch-manipulation ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kategori Pengeluaran */}
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Kategori Pengeluaran
            </p>
            <div className="grid grid-cols-3 gap-2">
              {EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`min-h-[68px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all touch-manipulation ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 ring-1 ring-emerald-500'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CategoryIcon category={cat} size="sm" />
                    <span
                      className={`text-[11px] font-semibold leading-tight ${
                        isSelected
                          ? 'text-emerald-800 dark:text-emerald-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catatan Opsional */}
          <div>
            <label
              htmlFor="qt-note"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Catatan Transaksi (Opsional)
            </label>
            <div className="relative">
              <FileText
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="qt-note"
                type="text"
                maxLength={60}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Kosongkan untuk pakai nama menu"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-bold text-white shadow-sm active:scale-[0.98] transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            {isEditing ? 'Simpan Perubahan' : 'Simpan Menu'}
          </button>
        </form>
      </div>
    </div>
  );
}
