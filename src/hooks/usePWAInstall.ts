import { useEffect, useState } from 'react';
import {
  detectDevicePlatform,
  resolveInstallAction,
  type DevicePlatform,
  type InstallAction,
} from '../utils/pwaInstall';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Capture beforeinstallprompt early at module evaluation so it is never missed before React mounts
let capturedDeferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    capturedDeferredPrompt = e as BeforeInstallPromptEvent;
    promptListeners.forEach((listener) => listener(capturedDeferredPrompt));
  });

  window.addEventListener('appinstalled', () => {
    capturedDeferredPrompt = null;
    promptListeners.forEach((listener) => listener(null));
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(capturedDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<DevicePlatform>('desktop');

  useEffect(() => {
    const checkStandalone = () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsInstalled(checkStandalone());

    setPlatform(
      detectDevicePlatform({
        userAgent: window.navigator.userAgent,
        platform: window.navigator.platform,
        maxTouchPoints: window.navigator.maxTouchPoints,
      })
    );

    const handlePromptUpdate = (nextPrompt: BeforeInstallPromptEvent | null) => {
      setDeferredPrompt(nextPrompt);
    };
    promptListeners.add(handlePromptUpdate);

    // Sync in case beforeinstallprompt fired between initial render and effect
    if (capturedDeferredPrompt !== deferredPrompt) {
      setDeferredPrompt(capturedDeferredPrompt);
    }

    const handleAppInstalled = () => {
      setIsInstalled(true);
      capturedDeferredPrompt = null;
      setDeferredPrompt(null);
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      if (checkStandalone()) {
        setIsInstalled(true);
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    mediaQuery.addEventListener?.('change', handleDisplayModeChange);

    return () => {
      promptListeners.delete(handlePromptUpdate);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener?.('change', handleDisplayModeChange);
    };
  }, []);

  const installAction: InstallAction = resolveInstallAction({
    isInstalled,
    hasDeferredPrompt: Boolean(deferredPrompt),
    platform,
  });

  const canShowInstallButton = installAction !== 'installed' && installAction !== 'unavailable';

  const install = async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    const activePrompt = deferredPrompt ?? capturedDeferredPrompt;
    if (!activePrompt) return 'unavailable';

    try {
      await activePrompt.prompt();
      const { outcome } = await activePrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        capturedDeferredPrompt = null;
        setDeferredPrompt(null);
        return 'accepted';
      }
      return 'dismissed';
    } catch {
      return 'unavailable';
    }
  };

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    platform,
    installAction,
    canShowInstallButton,
    install,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
