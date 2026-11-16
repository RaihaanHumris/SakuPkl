import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWAInstall';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-4 mt-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/70 px-3.5 py-2 flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-300"
    >
      <WifiOff className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      <span>Mode Offline — Data tetap tersimpan aman di perangkat.</span>
    </div>
  );
}
