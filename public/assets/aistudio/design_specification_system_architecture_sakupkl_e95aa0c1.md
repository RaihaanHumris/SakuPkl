# Design Document (UI/UX & Technical Architecture)
**Proyek:** SakuPKL  
**Pendekatan Desain:** Mobile-First, Clean Minimalist, High Contrast  

---

## 1. Filosofi Desain & Identitas Visual
Aplikasi dirancang dengan pendekatan **Frictionless UX** (minim hambatan). Karena pengguna akan membuka aplikasi di sela-sela jam istirahat makan siang atau saat di parkiran motor, seluruh informasi penting harus terbaca dalam sekali lirik dan tombol interaksi utama harus berada dalam jangkauan ibu jari (*thumb-friendly zone*).

### 1.1 Palet Warna (Color System)
Menggunakan skema warna netral yang bersih dengan aksen semantik yang tegas untuk membedakan arus kas:

| Peran Warna | Nama Token | Kode Hex | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Background Utama** | `Slate 50` | `#F8FAFC` | Latar belakang halaman utama agar tidak melelahkan mata |
| **Surface / Card** | `Pure White` | `#FFFFFF` | Latar belakang kartu ringkasan, daftar transaksi, dan modal |
| **Teks Utama** | `Slate 900` | `#0F172A` | Nominal uang, judul bagian, teks utama |
| **Teks Sekunder** | `Slate 500` | `#64748B` | Tanggal, label kategori, catatan tambahan |
| **Aksen Utama / Pemasukan** | `Emerald 600` | `#059669` | Tombol utama, saldo aman, pemasukan tambahan |
| **Pengeluaran / Peringatan** | `Rose 600` | `#E11D48` | Nominal pengeluaran, peringatan *overbudget* |
| **Waspada / Limit Harian** | `Amber 500` | `#F59E0B` | Indikator batas harian mendekati maksimal ($\ge 80\%$) |

### 1.2 Tipografi
* **Font Family:** `Inter` atau `Plus Jakarta Sans` (Sans-serif modern dengan keterbacaan angka yang tinggi).
* **Tabular Numbers:** Menggunakan properti CSS `font-variant-numeric: tabular-nums` pada seluruh angka nominal Rupiah agar deretan angka sejajar rapi secara vertikal.

---

## 2. Tata Letak & Wireframe Struktur Layar

Aplikasi menggunakan layout kontainer terpusat (`max-w-md mx-auto`) menyerupai aplikasi *native mobile* saat dibuka di desktop maupun ponsel.

```text
+------------------------------------------+
|  SakuPKL                  [Atur Budget]  |  <- Header
+------------------------------------------+
|  Sisa Uang Saku                          |
|  Rp 450.000                              |  <- Hero Balance Card
|  [||||||||||||-------] 55% Terpakai      |
|  --------------------------------------  |
|  Batas Aman Hari Ini: Rp 22.500          |  <- Dynamic Safe Limit
+------------------------------------------+
|  [Semua] [Makan] [Transport] [PKL] ...   |  <- Horizontal Filter Chips
+------------------------------------------+
|  Hari Ini                   -Rp 17.000   |  <- Daily Group Header
|  +------------------------------------+  |
|  | [Utensils] Makan Siang  -Rp 15.000 |  |  <- Transaction Item
|  |            Warteg depan kantor     |  |
|  +------------------------------------+  |
|  | [Fuel]     Parkir       -Rp 2.000  |  |
|  +------------------------------------+  |
+------------------------------------------+
|         [  + Catat Transaksi  ]          |  <- Sticky Bottom CTA
+------------------------------------------+
```

---

## 3. Spesifikasi Komponen Utama

### 3.1 Hero Budget Card
* Menampilkan **Sisa Saldo** dengan ukuran font besar (`28px` / `text-3xl`, Bold).
* **Progress Bar:** Berubah warna secara dinamis berdasarkan sisa anggaran:
  * Hijau (`Emerald 500`): Sisa saldo $> 30\%$.
  * Kuning (`Amber 500`): Sisa saldo $15\% - 30\%$.
  * Merah (`Rose 500`): Sisa saldo $< 15\%$.
* **Badge Batas Aman Harian:** Menampilkan angka nominal maksimal yang disarankan untuk hari ini. Jika pengeluaran hari ini melewati angka tersebut, teks berubah menjadi merah dengan ikon peringatan kecil.

### 3.2 Quick-Add Bottom Sheet / Modal
* Muncul dari bawah layar saat tombol `+ Catat Transaksi` ditekan.
* **Baris 1 (Quick Presets):** Deretan tombol kecil (*chips*) yang bisa digeser horizontal:
  * `🍛 Makan Siang (15rb)`
  * `⛽ Bensin (20rb)`
  * `🅿️ Parkir (2rb)`
  * `☕ Kopi (10rb)`
* **Baris 2 (Input Nominal):** Input angka besar dengan auto-formatting pemisah ribuan (`15.000`) dan auto-focus saat modal terbuka.
* **Baris 3 (Grid Kategori):** Pilihan ikon kategori 2 baris agar bisa dipilih dengan satu ketukan tanpa *dropdown*.
* **Baris 4 (Catatan & Tanggal):** Input teks singkat opsional dan pemilih tanggal (default: hari ini).

### 3.3 Tab Analisis & Ekspor
* Dapat diakses melalui tab navigasi atau *drawer* ringkasan.
* Menampilkan rincian pengeluaran per kategori dalam bentuk *horizontal progress bar* lengkap dengan nominal total dan persentasenya.
* Tombol sekunder `Download Laporan (.CSV)` di bagian bawah untuk mengunduh file rekap.

---

## 4. Arsitektur Data & State Management

### 4.1 Struktur Data (TypeScript Interface)

```typescript
export type TransactionType = 'expense' | 'income';

export type CategoryId = 
  | 'food'       // Makan & Minum
  | 'transport'  // Transportasi
  | 'pkl_needs'  // Kebutuhan PKL
  | 'snack'      // Jajan & Kopi
  | 'other';     // Lain-lain

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: CategoryId;
  note: string;
  date: string; // Format ISO: YYYY-MM-DD
  createdAt: number;
}

export interface BudgetConfig {
  totalBudget: number;
  totalDays: number;
  startDate: string; // Format ISO: YYYY-MM-DD
}
```

### 4.2 Alur Penyimpanan (Storage Service Layer)
Untuk memastikan aplikasi mudah dikembangkan ke backend (seperti Supabase atau Laravel API) di masa depan, akses data dipisahkan ke dalam modul `storageService.ts`:
* `getBudget(): BudgetConfig`
* `saveBudget(config: BudgetConfig): void`
* `getTransactions(): Transaction[]`
* `addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction`
* `deleteTransaction(id: string): void`
* `exportToCSV(): string`