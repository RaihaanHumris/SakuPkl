import type {
  ExpenseCategory,
  IncomeCategory,
  TransactionCategory,
  TransactionType,
} from '../types/finance';

export interface ParsedNotificationResult {
  amount: number | null;
  type: TransactionType;
  category: TransactionCategory;
  note: string;
  sourceApp: string | null;
}

const SOURCE_APPS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /\bshopeefood\b/i, name: 'ShopeeFood' },
  { pattern: /\bshopeepay\b/i, name: 'ShopeePay' },
  { pattern: /\bshopee\b/i, name: 'Shopee' },
  { pattern: /\btokopedia\b/i, name: 'Tokopedia' },
  { pattern: /\blazada\b/i, name: 'Lazada' },
  { pattern: /\bblibli\b/i, name: 'Blibli' },
  { pattern: /\btiktok\s*shop\b/i, name: 'TikTok Shop' },
  { pattern: /\bgopay\b/i, name: 'GoPay' },
  { pattern: /\bgofood\b/i, name: 'GoFood' },
  { pattern: /\bgojek\b/i, name: 'Gojek' },
  { pattern: /\bgrabfood\b/i, name: 'GrabFood' },
  { pattern: /\bgrab\b/i, name: 'Grab' },
  { pattern: /\bdana\b/i, name: 'DANA' },
  { pattern: /\bovo\b/i, name: 'OVO' },
  { pattern: /\bqris\b/i, name: 'QRIS' },
  { pattern: /\bbca\b/i, name: 'BCA' },
  { pattern: /\bmandiri\b|\blivin\b/i, name: 'Mandiri' },
  { pattern: /\bbri\b|\bbrimo\b/i, name: 'BRI' },
  { pattern: /\bbni\b/i, name: 'BNI' },
  { pattern: /\bseabank\b/i, name: 'SeaBank' },
  { pattern: /\bjago\b/i, name: 'Bank Jago' },
];

export function extractAmountFromText(text: string): number | null {
  // 1. Match Rp / IDR formats: Rp 25.000, Rp25.000, Rp 25,000, Rp 150.000,00
  const rpMatch = text.match(
    /(?:rp\.?|idr)\s*([\d.,]+)(?:\s*(rb|ribu|k|jt|juta))?/i
  );
  if (rpMatch && rpMatch[1]) {
    const rawNum = rpMatch[1];
    const suffix = (rpMatch[2] || '').toLowerCase();

    if (suffix === 'rb' || suffix === 'ribu' || suffix === 'k') {
      const base = parseFloat(rawNum.replace(',', '.'));
      if (!Number.isNaN(base) && base > 0) return Math.round(base * 1000);
    }
    if (suffix === 'jt' || suffix === 'juta') {
      const base = parseFloat(rawNum.replace(',', '.'));
      if (!Number.isNaN(base) && base > 0) return Math.round(base * 1_000_000);
    }

    // Strip trailing ,00 or .00 decimals if present
    const withoutCents = rawNum.replace(/[,.]00$/, '');
    const digitsOnly = withoutCents.replace(/[.,]/g, '');
    const parsed = parseInt(digitsOnly, 10);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }

  // 2. Match shorthand like "50k", "15rb", "25 ribu"
  const shortMatch = text.match(/\b(\d+(?:[.,]\d+)?)\s*(rb|ribu|k|jt|juta)\b/i);
  if (shortMatch && shortMatch[1]) {
    const base = parseFloat(shortMatch[1].replace(',', '.'));
    const unit = shortMatch[2].toLowerCase();
    if (!Number.isNaN(base) && base > 0) {
      if (unit === 'jt' || unit === 'juta') return Math.round(base * 1_000_000);
      return Math.round(base * 1000);
    }
  }

  // 3. Fallback: formatted thousands like 25.000 or 120.000
  const plainMatch = text.match(/\b(\d{1,3}(?:\.\d{3})+)\b/);
  if (plainMatch && plainMatch[1]) {
    const parsed = parseInt(plainMatch[1].replace(/\./g, ''), 10);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }

  return null;
}

function detectTransactionType(text: string): TransactionType {
  const lower = text.toLowerCase();
  const isIncome =
    /\b(transfer\s+masuk|uang\s+masuk|dana\s+masuk|saldo\s+masuk|diterima|menerima|cashback|refund|top\s*up\s+berhasil|kredit)\b/i.test(
      lower
    ) &&
    !/\b(bayar|pembayaran|belanja|debit|keluar|pembelian|checkout|kirim|tagihan|kartu\s+kredit)\b/i.test(
      lower
    );

  return isIncome ? 'income' : 'expense';
}

function detectExpenseCategory(text: string): ExpenseCategory {
  const lower = text.toLowerCase();

  if (
    /\b(shopee|tokopedia|lazada|blibli|tiktok\s*shop|zalora|belanja\s*online|checkout|cod|paket|ongkir|marketplace)\b/i.test(
      lower
    ) &&
    !/\b(shopeefood)\b/i.test(lower)
  ) {
    return 'Belanja Online';
  }

  if (
    /\b(gofood|grabfood|shopeefood|makan|nasi|warteg|padang|ayam|geprek|mie|bakso|soto|magelangan|telor|telur|kantin|resto|warung)\b/i.test(
      lower
    )
  ) {
    return 'Makan & Minum';
  }

  if (
    /\b(kopi|coffee|kenangan|janji\s*jiwa|fore|starbucks|mixue|es\s*teh|boba|kukubima|ekstrajoss|jajan|snack|indomaret|alfamart)\b/i.test(
      lower
    )
  ) {
    return 'Jajan & Kopi';
  }

  if (
    /\b(gojek|goride|gocar|grab|maxim|pertamina|spbu|pertalite|pertamax|bensin|parkir|tol|krl|commuter|transjakarta|ojol)\b/i.test(
      lower
    )
  ) {
    return 'Transportasi';
  }

  if (/\b(print|fotokopi|fotocopy|jilid|atk|kertas|pulpen|map|pkl)\b/i.test(lower)) {
    return 'Kebutuhan PKL';
  }

  return 'Lain-lain';
}

function detectIncomeCategory(text: string): IncomeCategory {
  const lower = text.toLowerCase();
  if (/\b(transport|bensin)\b/i.test(lower)) return 'Uang Transport';
  if (/\b(bonus|honor|insentif|cashback)\b/i.test(lower)) return 'Bonus PKL';
  if (/\b(saku|ortu|orang\s*tua|kiriman)\b/i.test(lower)) return 'Uang Saku';
  return 'Lain-lain';
}

function buildCleanNote(
  text: string,
  sourceApp: string | null,
  category: TransactionCategory
): string {
  // Try extracting merchant after "di <merchant>" or "ke <merchant>"
  const merchantMatch = text.match(
    /(?:\bdi\b|\bke\b|\bkepada\b)\s+([A-Za-z0-9][A-Za-z0-9\s.&'-]{1,30}?)(?=\s+(?:sebesar|senilai|berhasil|sukses|via|pakai|menggunakan|rp|idr|\d)|[.,!\n]|$)/i
  );

  if (merchantMatch && merchantMatch[1]) {
    const merchant = merchantMatch[1].trim();
    if (
      merchant.length >= 2 &&
      !/^(rp|idr|berhasil|sukses)$/i.test(merchant)
    ) {
      return sourceApp && !merchant.toLowerCase().includes(sourceApp.toLowerCase())
        ? `${merchant} (${sourceApp})`.slice(0, 60)
        : merchant.slice(0, 60);
    }
  }

  if (sourceApp) {
    return `${category} · ${sourceApp}`.slice(0, 60);
  }

  const singleLine = text.replace(/\s+/g, ' ').trim();
  return (singleLine.slice(0, 48) || category).trim();
}

export function parseExpenseNotification(
  rawText: string
): ParsedNotificationResult {
  const text = rawText.trim();
  const amount = extractAmountFromText(text);
  const type = detectTransactionType(text);
  const matchedApp = SOURCE_APPS.find((app) => app.pattern.test(text));
  const sourceApp = matchedApp ? matchedApp.name : null;

  const category: TransactionCategory =
    type === 'expense'
      ? detectExpenseCategory(text)
      : detectIncomeCategory(text);

  const note = buildCleanNote(text, sourceApp, category);

  return {
    amount,
    type,
    category,
    note,
    sourceApp,
  };
}
