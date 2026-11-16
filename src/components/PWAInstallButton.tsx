import { Download, MoreVertical, PlusSquare, Share, Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { notifyToast } from '../utils/notify';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'card';
}

export function PWAInstallButton({ variant = 'compact' }: PWAInstallButtonProps) {
  const {
    canShowInstallButton,
    installAction,
    isInstalled,
    install,
  } = usePWAInstall();
  const [guideMode, setGuideMode] = useState<'ios' | 'android' | null>(null);

  useEffect(() => {
    if (!guideMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGuideMode(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guideMode]);

  if (isInstalled || !canShowInstallButton) {
    return null;
  }

  const handleClick = async () => {
    if (installAction === 'native-prompt') {
      const outcome = await install();
      if (outcome === 'accepted') {
        void notifyToast({
          title: 'SakuPkl berhasil dipasang!',
          text: 'Aplikasi siap dibuka langsung dari layar utama HP-mu.',
          icon: 'success',
        });
      } else if (outcome === 'unavailable') {
        setGuideMode('android');
      }
      return;
    }

    if (installAction === 'ios-tutorial') {
      setGuideMode('ios');
      return;
    }

    if (installAction === 'android-fallback-tutorial') {
      setGuideMode('android');
    }
  };

  return (
    <>
      {variant === 'compact' ? (
        <button
          type="button"
          onClick={() => {
            void handleClick();
          }}
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
              <Smartphone className="w-5 h-5" aria-hidden="true" />
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
            onClick={() => {
              void handleClick();
            }}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 active:scale-95 transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span className="whitespace-nowrap">Pasang</span>
          </button>
        </section>
      )}

      {guideMode === 'ios' &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/55 dark:bg-black/70 backdrop-blur-xs p-4"
            onClick={() => setGuideMode(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
          <div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xl animate-[slideUp_180ms_cubic-bezier(0.16,1,0.3,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3
                  id="ios-install-title"
                  className="text-sm font-extrabold text-slate-900 dark:text-slate-100"
                >
                  Tutorial Pasang di iPhone / iPad
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGuideMode(null)}
                aria-label="Tutup panduan pasang iOS"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Safari di iOS tidak mendukung install otomatis 1-klik. Ikuti 3 langkah berikut:
            </p>

            <ol className="mt-3 space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 p-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Buka halaman ini di <strong>Safari</strong>, lalu ketuk ikon{' '}
                  <strong className="inline-flex items-center gap-1 text-slate-900 dark:text-slate-100">
                    Bagikan <Share className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 inline" />
                  </strong>{' '}
                  di bilah bawah/atas browser.
                </span>
              </li>

              <li className="flex items-start gap-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 p-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Gulir ke bawah dan pilih{' '}
                  <strong className="inline-flex items-center gap-1 text-slate-900 dark:text-slate-100">
                    Tambah ke Layar Utama{' '}
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 inline" />
                  </strong>{' '}
                  (Add to Home Screen).
                </span>
              </li>

              <li className="flex items-start gap-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 p-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Ketuk <strong className="text-slate-900 dark:text-slate-100">Tambah</strong> di pojok kanan atas. Ikon <strong>SakuPkl</strong> akan muncul di layar utama.
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setGuideMode(null)}
              className="mt-4 w-full min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors touch-manipulation"
            >
              Mengerti
            </button>
          </div>
        </div>,
          document.body
        )}

      {guideMode === 'android' &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/55 dark:bg-black/70 backdrop-blur-xs p-4"
            onClick={() => setGuideMode(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="android-install-title"
          >
          <div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xl animate-[slideUp_180ms_cubic-bezier(0.16,1,0.3,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3
                  id="android-install-title"
                  className="text-sm font-extrabold text-slate-900 dark:text-slate-100"
                >
                  Pasang SakuPkl di Android
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGuideMode(null)}
                aria-label="Tutup panduan pasang Android"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Browser saat ini belum menampilkan pop-up install otomatis (sering terjadi jika dibuka dari WhatsApp/IG atau non-Chrome). Pasang lewat menu browser:
            </p>

            <ol className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 p-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Pastikan halaman dibuka di <strong>Google Chrome</strong>, lalu ketuk ikon menu{' '}
                  <strong className="inline-flex items-center gap-0.5 text-slate-900 dark:text-slate-100">
                    <MoreVertical className="w-3.5 h-3.5 inline" /> titik tiga
                  </strong>{' '}
                  di pojok kanan atas.
                </span>
              </li>
              <li className="flex items-start gap-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 p-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Pilih <strong className="text-slate-900 dark:text-slate-100">Tambahkan ke layar utama</strong> atau{' '}
                  <strong className="text-slate-900 dark:text-slate-100">Instal aplikasi</strong>, lalu konfirmasi <strong>Instal</strong>.
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setGuideMode(null)}
              className="mt-4 w-full min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors touch-manipulation"
            >
              Mengerti
            </button>
          </div>
        </div>,
          document.body
        )}
    </>
  );
}
