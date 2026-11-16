# Product Requirements Document (PRD)
**Nama Produk:** SakuPKL (Personal Finance & Daily Expense Tracker)  
**Versi:** 1.0 (MVP)  
**Target Rilis:** Q4 2026  
**Status:** Draft Siap Pengembangan  

---

## 1. Latar Belakang & Masalah
Siswa SMK dan mahasiswa yang sedang menjalani Praktik Kerja Lapangan (PKL) atau magang umumnya memiliki anggaran uang saku yang terbatas (mingguan atau bulanan), sementara kebutuhan pengeluaran harian meningkat (makan siang di luar, transportasi/bensin, cetak dokumen, hingga jajan/kopi bersama rekan magang). 

Tanpa pencatatan yang cepat dan kontrol harian yang jelas, peserta PKL sering kehabisan uang saku sebelum periode magang berakhir. Aplikasi pencatat keuangan konvensional sering kali terlalu rumit dan memakan waktu untuk sekadar mencatat pengeluaran kecil harian.

## 2. Tujuan Produk
1. **Kecepatan Pencatatan:** Memungkinkan pengguna mencatat pengeluaran harian dalam waktu kurang dari 10 detik.
2. **Kontrol Anggaran Otomatis:** Memberikan panduan batas pengeluaran harian secara dinamis agar uang saku cukup hingga akhir periode.
3. **Transparansi Pengeluaran:** Memudahkan evaluasi pos pengeluaran terbesar (misal: makan vs transportasi) serta ekspor laporan untuk pertanggungjawaban ke orang tua/wali.

## 3. Target Pengguna
* **Pengguna Utama:** Siswa SMK dan Mahasiswa aktif yang sedang menjalani program PKL/Magang (usia 16–23 tahun).
* **Karakteristik:** Menggunakan *smartphone* sebagai perangkat utama, membutuhkan antarmuka yang ringan, langsung bisa dipakai tanpa registrasi rumit, dan relevan dengan kebiasaan pengeluaran anak magang.

## 4. Fitur Utama (Scope MVP)

### 4.1 Manajemen Anggaran (Smart Budgeting)
* **Input Periode & Dana:** Pengguna dapat mengatur total uang saku awal dan durasi hari PKL (contoh: 30 hari kerja atau 1 bulan kalender).
* **Kalkulasi Batas Aman Harian:** Sistem secara otomatis menghitung batas pengeluaran yang disarankan per hari menggunakan rumus:
  $$\text{Batas Aman Harian} = \frac{\text{Sisa Saldo}}{\text{Sisa Hari}}$$
* **Indikator Peringatan:** Menampilkan status visual (Aman, Waspada, Melebihi Batas) jika total pengeluaran pada hari berjalan melampaui batas aman harian.

### 4.2 Pencatatan Transaksi Cepat (Quick-Add)
* **Akses Satu Sentuhan:** Tombol aksi utama (`+`) yang selalu mudah dijangkau di bagian bawah layar.
* **Template Pengeluaran Rutin (Quick Chips):** Tombol *preset* sekali klik untuk mengisi form otomatis berdasarkan kebiasaan anak PKL (contoh: *Makan Siang Rp15.000*, *Bensin Rp20.000*, *Parkir Rp2.000*, *Kopi/Jajan Rp10.000*).
* **Atribut Transaksi:** Jenis (Pengeluaran / Pemasukan Tambahan), Nominal (Rupiah), Kategori, Catatan singkat (opsional), dan Tanggal.

### 4.3 Kategorisasi Khusus PKL
Kategori dirancang spesifik sesuai kebutuhan harian di tempat magang:
1. **Makan & Minum** (Sarapan, Makan Siang, Makan Malam, Galon/Air)
2. **Transportasi** (Bensin, Ojek Online, Angkutan Umum, Parkir)
3. **Kebutuhan PKL** (Print/Fotokopi laporan, Kuota internet, Alat tulis)
4. **Jajan & Nongkrong** (Kopi, Camilan, Makan bareng tim)
5. **Lain-lain / Darurat**

### 4.4 Riwayat, Filter & Analisis Ringkas
* **Pengelompokan Harian:** Riwayat transaksi dikelompokkan berdasarkan tanggal (Hari Ini, Kemarin, dst.) lengkap dengan subtotal pengeluaran per hari.
* **Pencarian & Filter:** Pencarian berdasarkan kata kunci catatan dan filter berdasarkan kategori.
* **Ringkasan Kategori:** Visualisasi persentase pengeluaran per kategori untuk mengetahui pos paling boros.
* **Ekspor CSV:** Fitur mengunduh seluruh data transaksi ke format `.csv` agar dapat dibuka di Microsoft Excel atau Google Sheets.

## 5. Kebutuhan Non-Fungsional
* **Performa:** Waktu muat awal (*initial load*) di bawah 1,5 detik pada jaringan seluler standar.
* **Offline-First Storage:** Data tersimpan secara lokal di browser (`LocalStorage`) sehingga aplikasi tetap dapat digunakan tanpa koneksi internet, dengan struktur kode terpisah agar siap dimigrasi ke database cloud (Supabase/MySQL) di versi berikutnya.
* **Responsivitas:** Desain *mobile-first* yang nyaman digunakan satu tangan di layar ponsel maupun layar desktop.

## 6. Metrik Keberhasilan (KPI)
* Waktu rata-rata pengguna menyelesaikan pencatatan 1 transaksi $\le 10$ detik.
* Tingkat retensi pengguna mencatat transaksi minimal 5 hari dalam seminggu selama masa PKL.