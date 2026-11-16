import { Plus, ReceiptText, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CategoryIcon } from '../components/CategoryIcon';
import { FILTER_CATEGORIES } from '../data/seedData';
import type { FilterCategory, Transaction, TransactionType } from '../types/finance';
import { formatDateHeader, formatRupiah } from '../utils/format';

interface RiwayatPageProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
}

interface DateGroup {
  date: string;
  label: string;
  expenseSubtotal: number;
  items: Transaction[];
}

export function RiwayatPage({
  transactions,
  onEdit,
  onDelete,
  onOpenAddModal,
}: RiwayatPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('Semua');

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return transactions.filter((tx) => {
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      const matchesCategory =
        selectedCategory === 'Semua' || tx.category === selectedCategory;
      const matchesQuery =
        !query ||
        tx.note.toLowerCase().includes(query) ||
        tx.category.toLowerCase().includes(query);
      return matchesType && matchesCategory && matchesQuery;
    });
  }, [transactions, searchQuery, typeFilter, selectedCategory]);

  const filteredSummary = useMemo(() => {
    let expense = 0;
    let income = 0;
    for (const tx of filteredTransactions) {
      if (tx.type === 'expense') expense += tx.amount;
      else income += tx.amount;
    }
    return { expense, income };
  }, [filteredTransactions]);

  const groupedByDate = useMemo<DateGroup[]>(() => {
    const map = new Map<string, Transaction[]>();

    for (const tx of filteredTransactions) {
      const list = map.get(tx.date) ?? [];
      list.push(tx);
      map.set(tx.date, list);
    }

    return Array.from(map.entries()).map(([date, items]) => {
      const expenseSubtotal = items
        .filter((item) => item.type === 'expense')
        .reduce((acc, item) => acc + item.amount, 0);
      return {
        date,
        label: formatDateHeader(date),
        expenseSubtotal,
        items,
      };
    });
  }, [filteredTransactions]);

  const hasActiveFilter =
    searchQuery.trim().length > 0 ||
    typeFilter !== 'all' ||
    selectedCategory !== 'Semua';

  return (
    <div className="space-y-4">
      <div className="px-0.5 pt-1">
        <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
          Riwayat Transaksi
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Cari, filter, atau ketuk catatan untuk mengubah detailnya
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari catatan atau kategori..."
          aria-label="Cari catatan transaksi"
          className="w-full h-12 pl-10 pr-10 rounded-xl bg-white border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Hapus pencarian"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center absolute right-0.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 rounded-lg touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Segmented Type Filter */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-200/60">
        {(
          [
            { id: 'all', label: 'Semua' },
            { id: 'expense', label: 'Pengeluaran' },
            { id: 'income', label: 'Pemasukan' },
          ] as const
        ).map((tab) => {
          const isActive = typeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id)}
              className={`min-h-[38px] rounded-lg text-xs font-semibold transition-all touch-manipulation ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Category Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter Kategori Transaksi"
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4"
      >
        {FILTER_CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedCategory(category)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Summary Strip */}
      {filteredTransactions.length > 0 && (
        <div className="rounded-xl bg-white border border-slate-200/80 px-3.5 py-2.5 flex items-center justify-between text-xs">
          <span className="text-slate-500 tabular-nums">
            {filteredTransactions.length} transaksi
          </span>
          <div className="flex items-center gap-3 tabular-nums">
            {filteredSummary.expense > 0 && (
              <span className="font-semibold text-rose-600">
                Keluar {formatRupiah(filteredSummary.expense)}
              </span>
            )}
            {filteredSummary.income > 0 && (
              <span className="font-semibold text-emerald-600">
                Masuk {formatRupiah(filteredSummary.income)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Grouped Transaction List or Empty State */}
      {groupedByDate.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <ReceiptText className="w-7 h-7" strokeWidth={1.75} />
          </div>
          <h2 className="mt-3.5 text-sm font-bold text-slate-900">
            {hasActiveFilter
              ? 'Tidak ada transaksi yang cocok'
              : 'Belum ada riwayat transaksi'}
          </h2>
          <p className="mt-1 text-xs text-slate-500 max-w-[240px] mx-auto leading-relaxed">
            {hasActiveFilter
              ? 'Coba ubah kata kunci pencarian atau reset filter yang aktif.'
              : 'Semua catatan keluar masuk uang sakumu akan tampil rapi di sini.'}
          </p>
          <div className="mt-4">
            {hasActiveFilter ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setSelectedCategory('Semua');
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors touch-manipulation"
              >
                Reset Filter
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white inline-flex items-center gap-1.5 transition-colors touch-manipulation"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Transaksi</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByDate.map((group) => (
            <div key={group.date}>
              <div className="flex items-center justify-between px-1 mb-2">
                <h2 className="text-xs font-bold text-slate-500">{group.label}</h2>
                {group.expenseSubtotal > 0 && (
                  <span className="text-xs font-semibold text-slate-500 tabular-nums">
                    Keluar {formatRupiah(group.expenseSubtotal)}
                  </span>
                )}
              </div>

              <div className="rounded-2xl bg-white border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
                {group.items.map((tx) => {
                  const isExpense = tx.type === 'expense';
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center gap-2 px-3.5 py-2.5 hover:bg-slate-50/70 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => onEdit(tx)}
                        className="flex items-center gap-3 min-w-0 flex-1 text-left py-0.5 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
                      >
                        <CategoryIcon category={tx.category} />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {tx.note}
                          </p>
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="truncate">{tx.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums shrink-0">{tx.time}</span>
                          </div>
                        </div>

                        <span
                          className={`text-sm font-bold tabular-nums whitespace-nowrap shrink-0 ${
                            isExpense ? 'text-slate-900' : 'text-emerald-600'
                          }`}
                        >
                          {isExpense
                            ? `- ${formatRupiah(tx.amount)}`
                            : `+ ${formatRupiah(tx.amount)}`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(tx.id)}
                        aria-label={`Hapus transaksi ${tx.note}`}
                        className="min-h-[44px] min-w-[44px] -mr-1.5 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
