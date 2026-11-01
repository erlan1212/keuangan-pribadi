# PANDUAN SETUP — Aplikasi Keuangan Pribadi
## Dari nol sampai bisa dipakai di HP dalam ~20 menit

---

## BAGIAN 1 — Setup Google Apps Script (Backend)

### Langkah 1: Salin ID Spreadsheet kamu
1. Buka Google Sheets kamu di browser.
2. Lihat URL-nya, contoh:
   `https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/edit`
3. Salin bagian antara `/d/` dan `/edit`:
   ✅ `1aBcDeFgHiJkLmNoPqRsTuVwXyZ` ← ini ID-nya
4. **Simpan dulu**, akan dipakai di langkah 3.

---

### Langkah 2: Buka Google Apps Script
1. Pergi ke: **https://script.google.com**
2. Klik tombol **"+ Proyek baru"** (New project).
3. Hapus semua kode default yang ada (`function myFunction() {...}`).

---

### Langkah 3: Tempel kode backend
1. Buka file `Code.gs` yang sudah kamu terima.
2. **Salin semua isinya**.
3. Tempel di editor Apps Script (gantikan seluruh teks yang ada).
4. Cari baris ini di bagian atas:
   ```
   const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_KAMU';
   ```
5. Ganti `GANTI_DENGAN_ID_SPREADSHEET_KAMU` dengan ID yang kamu salin di Langkah 1.
   Contoh hasil akhir:
   ```
   const SPREADSHEET_ID = '1aBcDeFgHiJkLmNoPqRsTuVwXyZ';
   ```
6. Klik ikon **💾 Simpan** (Ctrl+S / Cmd+S).
7. Beri nama proyek, misalnya: `Keuangan Pribadi`.

---

### Langkah 4: Deploy sebagai Web App
1. Klik tombol **"Deploy"** → **"Deployment baru"** (New deployment).
2. Di jendela yang muncul:
   - Klik ikon ⚙️ di samping "Pilih jenis" → pilih **"Web app"**.
   - **Deskripsi**: isi bebas, misal `v1`.
   - **Execute as**: pilih **"Me (nama email kamu)"**.
   - **Who has access**: pilih **"Only myself"** ← PENTING untuk keamanan!
3. Klik **"Deploy"**.
4. Jika muncul jendela izin (permission), klik **"Authorize access"**:
   - Pilih akun Google kamu.
   - Klik **"Advanced"** → **"Go to Keuangan Pribadi (unsafe)"**.
   - Klik **"Allow"**.
5. Setelah berhasil, kamu akan melihat **URL Web App** seperti:
   `https://script.google.com/macros/s/AKfycb.../exec`
6. **Salin URL tersebut** — ini sangat penting untuk langkah selanjutnya!

---

## BAGIAN 2 — Setup Frontend (Tampilan Aplikasi)

### Langkah 5: Isi URL API di file index.html
1. Buka file `index.html` dengan teks editor (Notepad, VS Code, dll).
2. Cari baris ini (sekitar baris 600):
   ```
   const API_URL = 'GANTI_DENGAN_URL_APPS_SCRIPT_KAMU';
   ```
3. Ganti dengan URL yang kamu salin dari Langkah 4.
   Contoh:
   ```
   const API_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
4. Simpan file.

---

### Langkah 6: Buat ikon aplikasi (untuk tampilan di layar HP)
1. Buat folder baru bernama `icons` di dalam folder yang sama dengan `index.html`.
2. Siapkan dua gambar ikon berbentuk persegi:
   - `icon-192.png` → ukuran 192×192 piksel
   - `icon-512.png` → ukuran 512×512 piksel
3. Kamu bisa gunakan foto/logo apa saja, atau buat gratis di:
   **https://favicon.io/favicon-generator/**
   Unduh dan ubah nama filenya sesuai di atas.
4. Letakkan kedua file tersebut di dalam folder `icons/`.

> **💡 Catatan:** Jika tidak membuat ikon, app tetap bisa dipakai,
> hanya ikon di layar HP akan tampil sebagai placeholder.

---

### Langkah 7: Upload ke GitHub Pages (hosting gratis)

> **Kenapa GitHub Pages?** Gratis, cepat, dan HTTPS otomatis (wajib untuk PWA).

**Jika belum punya akun GitHub:**
1. Daftar gratis di: **https://github.com**

**Upload file:**
1. Login ke GitHub, klik **"+"** → **"New repository"**.
2. Nama repository: `keuangan-pribadi` (atau bebas).
3. Centang **"Public"** dan **"Add a README file"**.
4. Klik **"Create repository"**.
5. Di halaman repository, klik **"Add file"** → **"Upload files"**.
6. Drag & drop semua file: `index.html`, `manifest.json`, `sw.js`, dan folder `icons/`.
7. Klik **"Commit changes"**.

**Aktifkan GitHub Pages:**
1. Klik tab **"Settings"** di repository.
2. Scroll ke bawah, klik **"Pages"** di menu kiri.
3. Di bagian **"Branch"**, pilih `main` dan folder `/ (root)`.
4. Klik **"Save"**.
5. Tunggu ~1 menit, lalu URL aplikasi kamu akan muncul:
   `https://username-github-kamu.github.io/keuangan-pribadi/`

---

## BAGIAN 3 — Install ke Layar Utama HP (PWA)

### Di Android (Chrome):
1. Buka URL aplikasi di Chrome.
2. Tunggu beberapa detik — akan muncul banner **"Tambahkan ke layar utama"** di bawah.
3. Jika banner tidak muncul: ketuk **⋮** (menu titik tiga) → **"Tambah ke layar utama"**.
4. Klik **"Tambah"**. Selesai! 🎉

### Di iPhone (Safari):
1. Buka URL aplikasi di **Safari** (bukan Chrome/Firefox).
2. Ketuk ikon **⬆ Share** di bawah layar.
3. Scroll dan pilih **"Add to Home Screen"** (Tambahkan ke Layar Utama).
4. Ketuk **"Add"**. Selesai! 🎉

---

## BAGIAN 4 — Cara Memperbarui Jika Ada Perubahan

Jika kamu mengubah kode dan ingin update di Apps Script:
1. Buka kembali script.google.com → buka proyek kamu.
2. Edit kode, lalu klik **Deploy** → **"Manage deployments"**.
3. Klik ikon ✏️ (edit) pada deployment yang ada.
4. Di "Version", pilih **"New version"**.
5. Klik **"Deploy"**. URL tidak berubah, data aman.

---

## RINGKASAN FILE

```
financial-app/
├── index.html      ← Aplikasi utama (UI + logika)
├── manifest.json   ← Konfigurasi PWA
├── sw.js           ← Service Worker (cache offline)
├── Code.gs         ← Backend Google Apps Script
└── icons/
    ├── icon-192.png
    └── icon-512.png
```
