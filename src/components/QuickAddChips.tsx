import { Check, ChevronDown, ChevronUp, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { QuickTemplate, QuickTemplateGroup } from '../types/finance';
import { formatCompactRupiah } from '../utils/format';

interface QuickAddChipsProps {
  templates: QuickTemplate[];
  onQuickAdd: (template: QuickTemplate) => void;
  onAddTemplate: (group?: QuickTemplateGroup) => void;
  onEditTemplate: (template: QuickTemplate) => void;
  onDeleteTemplate: (template: QuickTemplate) => void;
  onResetTemplates: () => void;
}

type QuickFilter = 'semua' | QuickTemplateGroup;

const QUICK_TABS: Array<{ id: QuickFilter; label: string }> = [
  { id: 'semua', label: 'Semua' },
  { id: 'makanan', label: 'Makanan' },
  { id: 'minuman', label: 'Minuman' },
  { id: 'pkl', label: 'Transport & PKL' },
];

const COMPACT_LIMIT = 6;

export function QuickAddChips({
  templates,
  onQuickAdd,
  onAddTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onResetTemplates,
}: QuickAddChipsProps) {
  const [activeGroup, setActiveGroup] = useState<QuickFilter>('semua');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAllInSemua, setShowAllInSemua] = useState(false);

  const filteredTemplates =
    activeGroup === 'semua'
      ? templates
      : templates.filter((tpl) => tpl.group === activeGroup);

  const canCollapse =
    activeGroup === 'semua' &&
    !isEditMode &&
    filteredTemplates.length > COMPACT_LIMIT;

  const visibleTemplates =
    canCollapse && !showAllInSemua
      ? filteredTemplates.slice(0, COMPACT_LIMIT)
      : filteredTemplates;

  const preferredGroup: QuickTemplateGroup =
    activeGroup === 'semua' ? 'makanan' : activeGroup;

  return (
    <section aria-label="Pengeluaran Cepat" className="mt-5">
      <div className="flex items-center justify-between gap-2 px-0.5 mb-2">
        <div className="min-w-0">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
            Tambah Cepat
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onAddTemplate(preferredGroup)}
            aria-label="Tambah menu cepat baru"
            className="min-h-[34px] px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold inline-flex items-center gap-1 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Menu</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditMode((prev) => !prev)}
            aria-pressed={isEditMode}
            aria-label={isEditMode ? 'Selesai mengatur menu cepat' : 'Atur menu cepat'}
            className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isEditMode
                ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950'
                : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {isEditMode ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Selesai</span>
              </>
            ) : (
              <>
                <Pencil className="w-3 h-3" aria-hidden="true" />
                <span>Atur</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Edit Mode Helper Strip */}
      {isEditMode && (
        <div className="mb-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 px-3 py-2 flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium text-amber-800 dark:text-amber-300 leading-snug">
            Ketuk menu untuk ubah harga/nama, atau ikon sampah untuk hapus.
          </p>
          <button
            type="button"
            onClick={onResetTemplates}
            className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-amber-900/50 inline-flex items-center gap-1 shrink-0 transition-colors touch-manipulation"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      )}

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

      {visibleTemplates.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-5 text-center">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Belum ada menu cepat di kategori ini.
          </p>
          <button
            type="button"
            onClick={() => onAddTemplate(preferredGroup)}
            className="mt-2.5 min-h-[40px] px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white inline-flex items-center gap-1.5 active:scale-95 transition-all touch-manipulation"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tambah Menu Favorit</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {visibleTemplates.map((tpl) =>
            isEditMode ? (
              <div
                key={tpl.id}
                className="min-h-[52px] rounded-xl bg-white dark:bg-slate-900 border border-amber-300/80 dark:border-amber-800/70 flex items-stretch overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => onEditTemplate(tpl)}
                  aria-label={`Ubah ${tpl.label}`}
                  className="flex-1 min-w-0 px-2.5 py-2 flex items-center justify-between gap-1.5 text-left hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500"
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span
                      aria-hidden="true"
                      className="text-sm leading-none shrink-0"
                    >
                      {tpl.emoji}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold text-slate-800 dark:text-slate-100 leading-tight break-words">
                        {tpl.label}
                      </span>
                      <span className="block text-[10px] font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-0.5">
                        {formatCompactRupiah(tpl.amount)}
                      </span>
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTemplate(tpl)}
                  aria-label={`Hapus ${tpl.label}`}
                  className="w-10 shrink-0 flex items-center justify-center border-l border-slate-100 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-500"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onQuickAdd(tpl)}
                className="min-h-[50px] px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 active:scale-[0.97] transition-all duration-150 flex items-center justify-between gap-2 text-left shadow-2xs touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <span
                    aria-hidden="true"
                    className="text-sm leading-none shrink-0"
                  >
                    {tpl.emoji}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100 leading-tight break-words">
                    {tpl.label}
                  </span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tabular-nums shrink-0">
                  {formatCompactRupiah(tpl.amount)}
                </span>
              </button>
            )
          )}
        </div>
      )}

      {canCollapse && (
        <button
          type="button"
          onClick={() => setShowAllInSemua((prev) => !prev)}
          className="mt-2 w-full min-h-[40px] rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 inline-flex items-center justify-center gap-1.5 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {showAllInSemua ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ringkas menu</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Lihat semua menu ({filteredTemplates.length})</span>
            </>
          )}
        </button>
      )}
    </section>
  );
}
