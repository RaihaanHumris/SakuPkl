import test from 'node:test';
import assert from 'node:assert/strict';
import type { QuickTemplate } from '../types/finance';
import {
  createQuickTemplate,
  deleteQuickTemplateFromList,
  normalizeQuickTemplates,
  updateQuickTemplateInList,
} from './quickTemplates';

const SAMPLE_DEFAULTS: QuickTemplate[] = [
  {
    id: 'tpl-nasi-telor',
    emoji: '🍳',
    label: 'Nasi Telor',
    amount: 10000,
    category: 'Makan & Minum',
    note: 'Nasi Telor',
    group: 'makanan',
  },
];

test('createQuickTemplate creates valid trimmed template with defaults', () => {
  const created = createQuickTemplate(
    {
      emoji: '🧊',
      label: '  Es Teh Jumbo  ',
      amount: 5000,
      category: 'Makan & Minum',
      group: 'minuman',
    },
    'tpl-test-1'
  );

  assert.equal(created.id, 'tpl-test-1');
  assert.equal(created.emoji, '🧊');
  assert.equal(created.label, 'Es Teh Jumbo');
  assert.equal(created.note, 'Es Teh Jumbo');
  assert.equal(created.amount, 5000);
  assert.equal(created.group, 'minuman');
});

test('updateQuickTemplateInList updates target item without affecting others', () => {
  const updated = updateQuickTemplateInList(SAMPLE_DEFAULTS, 'tpl-nasi-telor', {
    emoji: '🍳',
    label: 'Nasi Telor Spesial',
    amount: 12500,
    category: 'Makan & Minum',
    note: 'Nasi Telor warung depan',
    group: 'makanan',
  });

  assert.equal(updated.length, 1);
  assert.equal(updated[0].label, 'Nasi Telor Spesial');
  assert.equal(updated[0].amount, 12500);
  assert.equal(updated[0].note, 'Nasi Telor warung depan');
});

test('deleteQuickTemplateFromList removes matching item by id', () => {
  const afterDelete = deleteQuickTemplateFromList(
    SAMPLE_DEFAULTS,
    'tpl-nasi-telor'
  );
  assert.equal(afterDelete.length, 0);
});

test('normalizeQuickTemplates handles invalid storage values and deduplicates', () => {
  assert.deepEqual(
    normalizeQuickTemplates('not-an-array', SAMPLE_DEFAULTS),
    SAMPLE_DEFAULTS
  );

  const normalized = normalizeQuickTemplates(
    [
      {
        id: 'custom-1',
        emoji: '☕',
        label: 'Kopi Susu',
        amount: 12000,
        category: 'Jajan & Kopi',
        group: 'minuman',
      },
      {
        id: 'custom-1',
        emoji: '☕',
        label: 'Duplicate',
        amount: 9999,
      },
      {
        id: 'bad-zero',
        label: 'Invalid',
        amount: 0,
      },
    ],
    SAMPLE_DEFAULTS
  );

  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].id, 'custom-1');
  assert.equal(normalized[0].note, 'Kopi Susu');
});
