# TernakPro — Sistem Manajemen Ternak & Barcode Eartag

Aplikasi web responsif modern untuk manajemen peternakan terpadu, identifikasi eartag barcode/QR, pelacakan bobot harian (ADG), protokol masa henti obat (*Withdrawal*), dan laporan efisiensi pakan vs penjualan.

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan Node.js sudah terpasang, lalu di terminal jalankan:

```bash
# Masuk ke folder proyek (jika belum)
cd "C:\Users\asust\OneDrive\Documents\Manajemen Ternak"

# Jalankan server development
npm run dev
```

Buka browser di: **`http://localhost:3000`**

---

## 🛠️ Perbaikan & Penyesuaian dari Desain Figma

1. **Perbaikan Layout "Catat Obat & Medis"**:
   - Di desain Figma, tombol aksi (*Simpan & Kunci Status Withdrawal* dan *Simpan & Lanjut*) secara tidak sengaja menumpuk di tengah form di bawah *Kategori Tindakan*.
   - **Perbaikan**: Dipindahkan ke bagian bawah formulir sebagai aksi final yang rapi dan logis.

2. **Pembersihan Teks "Laporan & Analitik"**:
   - Di desain Figma terdapat teks catatan draft: `"Pakan vs Penjualan Task 19: HPP & Margin"`.
   - **Perbaikan**: Judul diperbaiki menjadi `"Pakan vs Penjualan (HPP & Margin)"`.

3. **Perbaikan Tumpang Tindih (Overlap) Nilai ADG & Badge**:
   - Di desain Figma, badge `"SANGAT BAIK"` dan `"EVALUASI PAKAN"` bertabrakan dengan angka `0.92 kg/hari` dan `0.14 kg/hari`.
   - **Perbaikan**: Tata letak grid/flex diperbaiki dengan hierarki yang jelas sehingga badge dan nilai metrik memiliki ruang yang lega.

4. **Perbaikan Format Eartag "Tambah Ternak Baru"**:
   - Teks subjudul rumus tertimpa angka seri eartag.
   - **Perbaikan**: Kartu identifikasi hijau ditata ulang dengan format eartag besar yang proporsional, status anti-duplikat, dan penjelasan format standar.

5. **Responsivitas Penuh (Mobile + Tablet + Desktop)**:
   - **Mobile View**: Pengalaman ala aplikasi mobile PWA dengan *bottom navigation bar*, tombol *glove-friendly* (mudah ditekan saat menggunakan sarung tangan di kandang), dan form terarah.
   - **Desktop/Tablet View**: Lebar kontainer otomatis menyesuaikan, navigasi atas modern, dan kartu multi-kolom yang nyaman di layar besar.

---

## ✨ Fitur-Fitur Interaktif

- **Masuk Operator**: Login cepat dengan proteksi sandi sesi kandang.
- **Beranda Dashboard**: 
  - Banner pemindai cepat eartag.
  - Peringatan aktif *Withdrawal* keamanan pangan dengan tag ternak yang dapat diklik.
  - Aksi cepat: Tambah Ternak, Timbang Bobot, Catat Obat.
  - Metrik populasi aktif (Sapi, Kambing, Domba).
- **Daftar Ternak**: Pencarian real-time, filter spesies, filter status aktif/withdrawal/bunting, kartu ternak interaktif.
- **Scan Barcode Eartag**: 
  - Bidikan kamera dengan reticle sudut dan animasi laser scan.
  - Deteksi otomatis eartag.
  - Input manual jika eartag berlumpur atau barcode rusak.
- **Tambah Ternak Baru**:
  - Penomoran eartag otomatis anti-duplikat per spesies dan tahun.
  - Stepper bobot responsif.
  - Cetak label thermal eartag langsung.
- **Timbang Bobot & Kalkulator ADG**:
  - Simulasi tarik data timbangan digital bluetooth.
  - Stepper penyesuaian bobot cepat (-1.0, -0.5, +0.5, +1.0).
  - Kalkulator ADG harian *real-time* dengan ring gauge visual dan evaluasi ransum otomatis.
- **Catat Obat & Protokol Withdrawal**:
  - Kategori terapi obat & vaksinasi.
  - Perhitungan otomatis tanggal bebas residu sesuai regulasi ASUH (Aman, Sehat, Utuh, Halal).
  - Pencatatan HPP biaya medis per ternak.
- **Laporan & Analitik**:
  - Margin operasional efisiensi pakan vs penjualan.
  - Dinamika populasi & kepatuhan.
  - Modal Cetak / Simpan Laporan PDF resmi.
