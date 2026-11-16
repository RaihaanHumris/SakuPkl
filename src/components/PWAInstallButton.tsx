import { Download, Share, Smartphone, X } from 'lucide-react';
import { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'card';
}

export function PWAInstallButton({ variant = 'compact' }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleClick = () => {
    if (isInstallable) {
      void install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'compact' ? (
        <button
          type="button"
          onClick={handleClick}
          aria-label="Pasang aplikasi SakuPkl"
          className="min-h-[40px] px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Pasang</span>
        </button>
      ) : (
        <section
          aria-label="Pasang Aplikasi PWA"
          className="rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/35 border border-emerald-200/80 dark:border-emerald-900/60 p-4 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Pasang SakuPkl
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                Akses lebih cepat & bisa dipakai offline
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClick}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 active:scale-95 transition-all touch-manipulation"
          >
            <Download className="w-4 h-4" />
            <span className="whitespace-nowrap">Pasang</span>
          </button>
        </section>
      )}

      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/55 dark:bg-black/70 backdrop-blur-xs p-4"
          onClick={() => setShowIOSGuide(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <h3
                id="ios-install-title"
                className="text-base font-extrabold text-slate-900 dark:text-slate-100"
              >
                Pasang SakuPkl di iPhone / iPad
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                aria-label="Tutup panduan pasang"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ol className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-decimal list-inside">
              <li>
                Ketuk ikon <strong className="text-slate-900 dark:text-slate-100 inline-flex items-center gap-1">Bagikan <Share className="w-3.5 h-3.5 inline" /></strong> di bilah Safari.
              </li>
              <li>
                Gulir ke bawah lalu pilih{' '}
                <strong className="text-slate-900 dark:text-slate-100">
                  Tambah ke Layar Utama (Add to Home Screen)
                </strong>
                .
              </li>
              <li>
                Ketuk <strong className="text-slate-900 dark:text-slate-100">Tambah</strong> untuk memasang aplikasi.
              </li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors touch-manipulation"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
