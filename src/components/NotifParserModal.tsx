import {
  AlertTriangle,
  BellRing,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardPaste,
  FileText,
  Info,
  X,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/seedData';
import type { TransactionInput } from '../hooks/useFinanceStore';
import type { TransactionCategory, TransactionType } from '../types/finance';
import {
  formatThousandsInput,
  getLocalDateString,
  parseThousandsInput,
} from '../utils/format';
import { parseExpenseNotification } from '../utils/notifParser';
import { CategoryIcon } from './CategoryIcon';

interface NotifParserModalProps {
  isOpen: boolean;
  initialText?: string;
  onClose: () => void;
  onSave: (input: TransactionInput) => void;
}

interface SampleNotification {
  label: string;
  text: string;
}

const SAMPLE_NOTIFICATIONS: SampleNotification[] = [
  {
    label: 'Shopee Rp 65.000',
    text: 'ShopeePay: Pembayaran sebesar Rp 65.000 untuk pesanan Shopee berhasil.',
  },
  {
    label: 'GoPay QRIS Rp 18.000',
    text: 'GoPay: Bayar QRIS di Warteg Bahari Rp 18.000 berhasil.',
  },
  {
    label: 'BCA Tokopedia Rp 120.000',
    text: 'BCA: Transfer Rp 120.000 ke Tokopedia berhasil.',
  },
];

export function NotifParserModal({
  isOpen,
  initialText = '',
  onClose,
  onSave,
}: NotifParserModalProps) {
  const [rawText, setRawText] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [amountInput, setAmountInput] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Belanja Online');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getLocalDateString());
  const [detectedSource, setDetectedSource] = useState<string | null>(null);
  const [clipboardFeedback, setClipboardFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPhoneGuide, setShowPhoneGuide] = useState(false);

  const applyParsedText = (text: string) => {
    setRawText(text);
    setErrorMsg('');
    if (!text.trim()) {
      setDetectedSource(null);
      return;
    }

    const parsed = parseExpenseNotification(text);
    setType(parsed.type);
    setCategory(parsed.category);
    setNote(parsed.note);
    setDetectedSource(parsed.sourceApp);
    if (parsed.amount !== null && parsed.amount > 0) {
      setAmountInput(parsed.amount.toLocaleString('id-ID'));
    } else {
      setAmountInput('');
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setClipboardFeedback(null);
    setErrorMsg('');
    setDate(getLocalDateString());
    if (initialText.trim()) {
      applyParsedText(initialText);
    } else {
      setRawText('');
      setType('expense');
      setAmountInput('');
      setCategory('Belanja Online');
      setNote('');
      setDetectedSource(null);
    }
  }, [isOpen, initialText]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const numericAmount = parseThousandsInput(amountInput);

  const handlePasteFromClipboard = async () => {
    setClipboardFeedback(null);
    if (!navigator.clipboard?.readText) {
      setClipboardFeedback(
        'Browser ini tidak mengizinkan akses clipboard otomatis. Tempel teks secara manual di kotak bawah.'
      );
      return;
    }
    try {
      const clipText = await navigator.clipboard.readText();
      if (!clipText.trim()) {
        setClipboardFeedback('Clipboard masih kosong. Salin teks notif terlebih dahulu.');
        return;
      }
      applyParsedText(clipText);
      setClipboardFeedback('Teks notif dari clipboard berhasil dibaca.');
    } catch {
      setClipboardFeedback(
        'Izin clipboard diblokir browser. Tekan lama pada kotak teks di bawah lalu pilih Tempel.'
      );
    }
  };

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    setCategory(nextType === 'expense' ? 'Belanja Online' : 'Uang Transport');
    setErrorMsg('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) {
      setErrorMsg('Nominal belum terdeteksi. Masukkan angka nominal lebih dari Rp 0.');
      return;
    }

    onSave({
      type,
      category,
      amount: numericAmount,
      note: note.trim() || category,
      date: date || getLocalDateString(),
    });
    onClose();
  };

  const automationExampleUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?notif_text={teks_notifikasi}`
      : 'https://domainmu/?notif_text={teks_notifikasi}';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/55 dark:bg-black/70 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-notif-title"
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BellRing className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="modal-notif-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight"
              >
                Baca Notif Pengeluaran
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Deteksi otomatis belanja online, QRIS & e-wallet
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal baca notif"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-4">
          {/* Honest Browser Security Info + Collapsible Phone Guide */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 p-3">
            <div className="flex items-start gap-2">
              <Info
                className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Browser tidak mengizinkan web/PWA menyadap notifikasi aplikasi lain secara diam-diam di latar belakang. Gunakan{' '}
                  <strong className="font-semibold text-slate-800 dark:text-slate-100">
                    Tempel Notif
                  </strong>{' '}
                  atau menu{' '}
                  <strong className="font-semibold text-slate-800 dark:text-slate-100">
                    Bagikan &rarr; SakuPkl
                  </strong>{' '}
                  di HP Android setelah install PWA.
                </p>
                <button
                  type="button"
                  onClick={() => setShowPhoneGuide((prev) => !prev)}
                  aria-expanded={showPhoneGuide}
                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline min-h-[28px] touch-manipulation"
                >
                  <span>Cara otomatis di HP Android (MacroDroid/Share)</span>
                  {showPhoneGuide ? (
                    <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {showPhoneGuide && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <p>
                  <strong className="text-slate-800 dark:text-slate-100">
                    1. Via Bagikan (Share Target):
                  </strong>{' '}
                  Install SakuPkl ke layar utama. Saat ada bukti bayar Shopee/GoPay/m-banking, pilih <em>Bagikan teks</em> &rarr; pilih <strong>SakuPkl</strong>.
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-slate-100">
                    2. Otomatis pakai MacroDroid / Tasker:
                  </strong>{' '}
                  Buat pemicu notifikasi dari aplikasi e-wallet/bank lalu buka URL:{' '}
                  <code className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-900 text-[10px] break-all">
                    {automationExampleUrl}
                  </code>
                </p>
              </div>
            )}
          </div>

          {/* Input Text Notification + Clipboard Paste */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="notif-raw-text"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Teks Notifikasi / SMS / Struk
              </label>
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="min-h-[36px] px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors touch-manipulation"
              >
                <ClipboardPaste className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Tempel dari Clipboard</span>
              </button>
            </div>

            <textarea
              id="notif-raw-text"
              rows={3}
              value={rawText}
              onChange={(e) => applyParsedText(e.target.value)}
              placeholder="Contoh: ShopeePay: Pembayaran sebesar Rp 65.000 untuk pesanan Shopee berhasil."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />

            {clipboardFeedback && (
              <p className="mt-1.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                {clipboardFeedback}
              </p>
            )}

            {/* Quick Sample Test Chips */}
            <div className="mt-2">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Coba contoh notif:
              </p>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {SAMPLE_NOTIFICATIONS.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => {
                      setClipboardFeedback(null);
                      applyParsedText(sample.text);
                    }}
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-400 text-[11px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0 active:scale-95 transition-all touch-manipulation"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Parsed Result Banner */}
          {rawText.trim() && (
            <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-3 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <CheckCircle2
                  className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 truncate">
                  {detectedSource
                    ? `Terdeteksi dari ${detectedSource}`
                    : 'Hasil pembacaan teks siap diperiksa'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                {category}
              </span>
            </div>
          )}

          {/* Segmented Toggle: Pengeluaran vs Pemasukan */}
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

          {/* Parsed Nominal */}
          <div>
            <label
              htmlFor="notif-amount"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Nominal Terbaca
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                Rp
              </span>
              <input
                id="notif-amount"
                type="text"
                inputMode="numeric"
                value={amountInput}
                onChange={(e) => {
                  setAmountInput(formatThousandsInput(e.target.value));
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="65.000"
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-2xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            {errorMsg && (
              <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                {errorMsg}
              </p>
            )}

            {type === 'expense' && numericAmount > 50000 && (
              <div className="mt-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/70 px-3 py-2 flex items-start gap-2 text-xs font-medium text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Peringatan: Pengeluaran ini melebihi Rp 50.000. Pastikan sesuai anggaran PKL-mu.
                </span>
              </div>
            )}
          </div>

          {/* Category Grid */}
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
                    className={`min-h-[70px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all touch-manipulation ${
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
                htmlFor="notif-note"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Catatan
              </label>
              <div className="relative">
                <FileText
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="notif-note"
                  type="text"
                  maxLength={60}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Belanja Online · ShopeePay"
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="notif-date"
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
                  id="notif-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-bold text-white shadow-sm active:scale-[0.98] transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Simpan Transaksi
          </button>
        </form>
      </div>
    </div>
  );
}
