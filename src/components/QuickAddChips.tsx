import { Zap } from 'lucide-react';
import { useState } from 'react';
import { QUICK_TEMPLATES } from '../data/seedData';
import type { QuickTemplate, QuickTemplateGroup } from '../types/finance';
import { formatCompactRupiah } from '../utils/format';

interface QuickAddChipsProps {
  onQuickAdd: (template: QuickTemplate) => void;
}

type QuickFilter = 'semua' | QuickTemplateGroup;

const QUICK_TABS: Array<{ id: QuickFilter; label: string }> = [
  { id: 'semua', label: 'Semua' },
  { id: 'makanan', label: 'Makanan' },
  { id: 'minuman', label: 'Minuman' },
  { id: 'pkl', label: 'Transport & PKL' },
];

export function QuickAddChips({ onQuickAdd }: QuickAddChipsProps) {
  const [activeGroup, setActiveGroup] = useState<QuickFilter>('semua');

  const visibleTemplates =
    activeGroup === 'semua'
      ? QUICK_TEMPLATES
      : QUICK_TEMPLATES.filter((tpl) => tpl.group === activeGroup);

  return (
    <section aria-label="Pengeluaran Cepat" className="mt-5">
      <div className="flex items-center justify-between px-0.5 mb-2">
        <div className="flex items-center gap-1.5">
          <Zap
            className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Tambah Cepat
          </h2>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Ketuk 1x langsung tersimpan
        </span>
      </div>

      {/* Filter Tabs for Makanan / Minuman / PKL */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
        {QUICK_TABS.map((tab) => {
          const isActive = activeGroup === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveGroup(tab.id)}
              className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors touch-manipulation ${
                isActive
                  ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Responsive 2-column mobile grid for effortless thumb tapping */}
      <div className="grid grid-cols-2 gap-2">
        {visibleTemplates.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onQuickAdd(tpl)}
            className="min-h-[48px] px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 active:scale-[0.97] transition-all duration-150 flex items-center justify-between gap-2 text-left shadow-2xs touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span className="flex items-center gap-1.5 min-w-0">
              <span aria-hidden="true" className="text-sm leading-none shrink-0">
                {tpl.emoji}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                {tpl.label}
              </span>
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tabular-nums shrink-0">
              {formatCompactRupiah(tpl.amount)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
