import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractAmountFromText,
  parseExpenseNotification,
} from './notifParser';

test('extractAmountFromText parses Rupiah, shorthand, and plain thousands', () => {
  assert.equal(extractAmountFromText('Pembayaran Rp 65.000 berhasil'), 65000);
  assert.equal(extractAmountFromText('Total IDR 120.000,00 sukses'), 120000);
  assert.equal(extractAmountFromText('Beli kopi 18k di kantin'), 18000);
  assert.equal(extractAmountFromText('Transfer Rp 1,5jt ke rekening'), 1500000);
  assert.equal(extractAmountFromText('Debit 45.000 berhasil'), 45000);
  assert.equal(extractAmountFromText('Tidak ada angka nominal'), null);
});

test('parseExpenseNotification classifies online shopping notifications', () => {
  const shopee = parseExpenseNotification(
    'ShopeePay: Pembayaran sebesar Rp 65.000 untuk pesanan Shopee berhasil.'
  );
  assert.equal(shopee.type, 'expense');
  assert.equal(shopee.amount, 65000);
  assert.equal(shopee.category, 'Belanja Online');
  assert.equal(shopee.sourceApp, 'ShopeePay');

  const tokopedia = parseExpenseNotification(
    'BCA: Transfer Rp 120.000 ke Tokopedia berhasil.'
  );
  assert.equal(tokopedia.type, 'expense');
  assert.equal(tokopedia.amount, 120000);
  assert.equal(tokopedia.category, 'Belanja Online');
  assert.equal(tokopedia.note, 'Tokopedia');
});

test('parseExpenseNotification distinguishes food, transport, and income', () => {
  const qrisFood = parseExpenseNotification(
    'GoPay: Bayar QRIS di Warteg Bahari Rp 18.000 berhasil.'
  );
  assert.equal(qrisFood.type, 'expense');
  assert.equal(qrisFood.amount, 18000);
  assert.equal(qrisFood.category, 'Makan & Minum');
  assert.equal(qrisFood.note, 'Warteg Bahari (GoPay)');

  const shopeeFood = parseExpenseNotification(
    'ShopeeFood: Pembayaran pesanan Rp 24.000 berhasil.'
  );
  assert.equal(shopeeFood.type, 'expense');
  assert.equal(shopeeFood.category, 'Makan & Minum');

  const transport = parseExpenseNotification(
    'Gojek: Pembayaran GoRide sebesar Rp 14.000 sukses.'
  );
  assert.equal(transport.type, 'expense');
  assert.equal(transport.category, 'Transportasi');

  const income = parseExpenseNotification(
    'BCA: Transfer masuk Rp 200.000 dari Orang Tua berhasil.'
  );
  assert.equal(income.type, 'income');
  assert.equal(income.amount, 200000);
  assert.equal(income.category, 'Uang Saku');
});

test('parseExpenseNotification does not treat credit card bill as income', () => {
  const bill = parseExpenseNotification(
    'Tagihan kartu kredit Mandiri Rp 150.000 jatuh tempo.'
  );
  assert.equal(bill.type, 'expense');
  assert.equal(bill.amount, 150000);
});
