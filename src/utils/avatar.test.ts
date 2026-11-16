import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSquareCropRect,
  getInitials,
  sanitizeAvatarDataUrl,
  validateAvatarFile,
} from './avatar';

test('getInitials generates 2-letter uppercase initials cleanly', () => {
  assert.equal(getInitials('Muhammad Raihaan Humris'), 'MR');
  assert.equal(getInitials('Raihaan'), 'RA');
  assert.equal(getInitials('  '), 'PK');
});

test('calculateSquareCropRect computes centered square crop coordinates', () => {
  assert.deepEqual(calculateSquareCropRect(1200, 800), {
    sx: 200,
    sy: 0,
    sSize: 800,
  });

  assert.deepEqual(calculateSquareCropRect(600, 1000), {
    sx: 0,
    sy: 200,
    sSize: 600,
  });
});

test('validateAvatarFile accepts image MIME types and rejects invalid files', () => {
  assert.deepEqual(
    validateAvatarFile({ type: 'image/jpeg', size: 1024 * 500 }),
    { valid: true }
  );
  assert.equal(
    validateAvatarFile({ type: 'application/pdf', size: 1024 }).valid,
    false
  );
  assert.equal(
    validateAvatarFile({ type: 'image/png', size: 20 * 1024 * 1024 }).valid,
    false
  );
});

test('sanitizeAvatarDataUrl only allows bounded data:image URLs', () => {
  assert.equal(
    sanitizeAvatarDataUrl('data:image/jpeg;base64,/9j/4AAQ'),
    'data:image/jpeg;base64,/9j/4AAQ'
  );
  assert.equal(sanitizeAvatarDataUrl('https://example.com/a.jpg'), undefined);
  assert.equal(sanitizeAvatarDataUrl(123), undefined);
});
