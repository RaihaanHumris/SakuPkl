import { Calendar, FileText, Trash2, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  NOMINAL_PRESETS,
} from '../data/seedData';
import type { TransactionInput } from '../hooks/useFinanceStore';
import type { Transaction, TransactionCategory, TransactionType } from '../types/finance';
import {
  formatCompactRupiah,
  formatThousandsInput,
  getLocalDateString,
  parseThousandsInput,
} from '../utils/format';
import { CategoryIcon } from './CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  editingTransaction: Transaction | null;
  onClose: () => void;
  onSave: (input: TransactionInput, editId?: string) => void;
  onDelete?: (id: string) => void;
}

export function TransactionModal({
  isOpen,
  editingTransaction,
  onClose,
  onSave,
  onDelete,
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amountInput, setAmountInput] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Makan & Minum');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getLocalDateString());
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        setType(editingTransaction.type);
        setAmountInput(editingTransaction.amount.toLocaleString('id-ID'));
        setCategory(editingTransaction.category);
        setNote(editingTransaction.note);
        setDate(editingTransaction.date);
      } else {
        setType('expense');
        setAmountInput('');
        setCategory('Makan & Minum');
        setNote('');
        setDate(getLocalDateString());
      }
      setErrorMsg('');
    }
  }, [isOpen, editingTransaction]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEditing = Boolean(editingTransaction);
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    setCategory(nextType === 'expense' ? 'Makan & Minum' : 'Uang Transport');
    setErrorMsg('');
  };

  const handleAmountChange = (raw: string) => {
    setAmountInput(formatThousandsInput(raw));
    if (errorMsg) setErrorMsg('');
  };

  const handlePresetNominal = (value: number) => {
    setAmountInput(value.toLocaleString('id-ID'));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numericAmount = parseThousandsInput(amountInput);
    if (numericAmount <= 0) {
      setErrorMsg('Masukkan nominal lebih dari Rp 0.');
      return;
    }

    onSave(
      {
        type,
        category,
        amount: numericAmount,
        note: note.trim() || category,
        date: date || getLocalDateString(),
        time: editingTransaction?.time,
      },
      editingTransaction?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/55 dark:bg-black/70 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-tx-title"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 max-h-[92dvh] overflow-y-auto animate-[slideUp_180ms_cubic-bezier(0.16,1,0.3,1)] pb-[env(safe-area-inset-bottom)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2.5 pb-2">
          <h2
            id="modal-tx-title"
            className="text-base font-bold text-slate-900 dark:text-slate-100"
          >
            {isEditing ? 'Ubah Transaksi' : 'Catat Transaksi'}
          </h2>
          <div className="flex items-center gap-1">
            {isEditing && editingTransaction && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(editingTransaction.id);
                  onClose();
                }}
                aria-label="Hapus transaksi ini"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors touch-manipulation"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-4">
          {/* Segmented Toggle: Pengeluaran vs Pemasukan Tambahan */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`min-h-[44px] rounded-lg text-xs font-semibold transition-all touch-manipulation ${
                type === 'expense'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`min-h-[44px] rounded-lg text-xs font-semibold transition-all touch-manipulation ${
                type === 'income'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pemasukan Tambahan
            </button>
          </div>

          {/* Nominal Input + Mobile Quick Nominal Presets */}
          <div>
            <label
              htmlFor="tx-amount"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Nominal
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                Rp
              </span>
              <input
                id="tx-amount"
                type="text"
                inputMode="numeric"
                autoFocus={!isEditing}
                value={amountInput}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="15.000"
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-2xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            {/* Quick Nominal Chips for 1-Tap Mobile Input */}
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {NOMINAL_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetNominal(preset)}
                  className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-400 text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums whitespace-nowrap shrink-0 active:scale-95 transition-all touch-manipulation"
                >
                  Rp {formatCompactRupiah(preset)}
                </button>
              ))}
            </div>

            {errorMsg && (
              <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                {errorMsg}
              </p>
            )}

            {type === 'expense' && parseThousandsInput(amountInput) > 50000 && (
              <div className="mt-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/70 px-3 py-2 text-xs font-medium text-amber-800 dark:text-amber-300">
                Peringatan: Pengeluaran ini melebihi batas Rp 50.000. Pastikan sesuai anggaranmu.
              </div>
            )}
          </div>

          {/* Interactive Category Icon Grid */}
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Kategori
            </p>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`min-h-[72px] p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all touch-manipulation ${
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

          {/* Note & Date */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label
                htmlFor="tx-note"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Catatan Singkat
              </label>
              <div className="relative">
                <FileText
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="tx-note"
                  type="text"
                  maxLength={60}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    type === 'expense'
                      ? 'Nasi padang + es teh'
                      : 'Uang transport minggu ke-2'
                  }
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="tx-date"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Tanggal
              </label>
              <div className="relative">
                <Calendar
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="tx-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-bold text-white shadow-sm active:scale-[0.98] transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            {isEditing
              ? 'Simpan Perubahan'
              : `Simpan ${type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
