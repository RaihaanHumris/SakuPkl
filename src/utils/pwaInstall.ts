export type DevicePlatform = 'ios' | 'android' | 'desktop';

export type InstallAction =
  | 'installed'
  | 'native-prompt'
  | 'ios-tutorial'
  | 'android-fallback-tutorial'
  | 'unavailable';

export function detectDevicePlatform(info: {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
}): DevicePlatform {
  const ua = info.userAgent.toLowerCase();
  const maxTouch = info.maxTouchPoints ?? 0;
  const plat = (info.platform ?? '').toLowerCase();

  const isIOSUA = /iphone|ipad|ipod/.test(ua);
  const isModernIPad = plat === 'macintel' && maxTouch > 1;
  if (isIOSUA || isModernIPad) {
    return 'ios';
  }

  if (/android/.test(ua)) {
    return 'android';
  }

  return 'desktop';
}

export function resolveInstallAction(params: {
  isInstalled: boolean;
  hasDeferredPrompt: boolean;
  platform: DevicePlatform;
}): InstallAction {
  if (params.isInstalled) {
    return 'installed';
  }

  if (params.hasDeferredPrompt) {
    return 'native-prompt';
  }

  if (params.platform === 'ios') {
    return 'ios-tutorial';
  }

  if (params.platform === 'android') {
    return 'android-fallback-tutorial';
  }

  return 'unavailable';
}
