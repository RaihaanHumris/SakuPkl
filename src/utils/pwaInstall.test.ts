import test from 'node:test';
import assert from 'node:assert/strict';
import { detectDevicePlatform, resolveInstallAction } from './pwaInstall';

test('detectDevicePlatform identifies Android, iOS, iPadOS, and desktop', () => {
  assert.equal(
    detectDevicePlatform({
      userAgent:
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36',
      platform: 'Linux armv8l',
      maxTouchPoints: 5,
    }),
    'android'
  );

  assert.equal(
    detectDevicePlatform({
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
      platform: 'iPhone',
      maxTouchPoints: 5,
    }),
    'ios'
  );

  assert.equal(
    detectDevicePlatform({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    }),
    'ios'
  );

  assert.equal(
    detectDevicePlatform({
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      platform: 'Linux x86_64',
      maxTouchPoints: 0,
    }),
    'desktop'
  );
});

test('resolveInstallAction triggers native prompt on Android when available and iOS tutorial on iOS', () => {
  assert.equal(
    resolveInstallAction({
      isInstalled: false,
      hasDeferredPrompt: true,
      platform: 'android',
    }),
    'native-prompt'
  );

  assert.equal(
    resolveInstallAction({
      isInstalled: false,
      hasDeferredPrompt: false,
      platform: 'ios',
    }),
    'ios-tutorial'
  );

  assert.equal(
    resolveInstallAction({
      isInstalled: false,
      hasDeferredPrompt: false,
      platform: 'android',
    }),
    'android-fallback-tutorial'
  );

  assert.equal(
    resolveInstallAction({
      isInstalled: true,
      hasDeferredPrompt: true,
      platform: 'android',
    }),
    'installed'
  );
});
