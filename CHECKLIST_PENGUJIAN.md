# CHECKLIST PENGUJIAN — Aplikasi Keuangan Pribadi
## Pastikan semua poin ini ✅ sebelum menggunakan secara aktif

---

## 🔗 A. Koneksi ke Google Sheets

- [ ] Buka aplikasi → data lama dari sheet "Pemasukan" muncul di Riwayat
- [ ] Buka aplikasi → data lama dari sheet "Pengeluaran" muncul di Riwayat
- [ ] Dashboard menampilkan total yang benar (bandingkan manual dengan spreadsheet)
- [ ] Tidak ada pesan error "Gagal memuat data" saat membuka

---

## ➕ B. Tambah Transaksi

- [ ] Ketuk tombol ＋ → bottom sheet terbuka dengan mulus
- [ ] Pilih "Pemasukan", isi nominal 50.000, pilih kategori "Gaji", klik Simpan
  → Cek di Google Sheets: baris baru muncul di sheet "Pemasukan"
  → Format tanggal: `2026-11-01` (bukan teks lain)
  → Nominal tersimpan sebagai angka (bukan teks "Rp 50.000")
- [ ] Pilih "Pengeluaran", isi nominal 25.000, pilih kategori "Makanan & Minuman", isi catatan "Makan siang", klik Simpan
  → Cek di Google Sheets: baris baru muncul di sheet "Pengeluaran"
  → Kolom Catatan terisi "Makan siang"
- [ ] Data lama di sheet TIDAK berubah, TIDAK terhapus, TIDAK tergeser
- [ ] Transaksi baru langsung muncul di dashboard tanpa perlu refresh manual

---

## 🚫 C. Validasi Input

- [ ] Klik Simpan tanpa mengisi nominal → muncul notifikasi merah "Nominal harus lebih dari 0"
- [ ] Isi nominal negatif (misal -100) → muncul notifikasi error
- [ ] Klik Simpan tanpa memilih kategori → muncul notifikasi "Pilih kategori"
- [ ] Klik Simpan tanpa tanggal → muncul notifikasi "Tanggal tidak boleh kosong"
- [ ] Nominal 0 → muncul notifikasi error
- [ ] Setelah error, perbaiki data, simpan lagi → berhasil tersimpan

---

## ✏️ D. Edit Transaksi

- [ ] Ketuk salah satu transaksi di Riwayat → bottom sheet terbuka dengan data terisi
- [ ] Ubah nominal, klik Simpan → perubahan tersimpan di Sheets (cek baris yang sama)
- [ ] Ubah kategori → tersimpan dengan benar
- [ ] Ubah catatan → tersimpan dengan benar
- [ ] Data di baris yang lain di Sheets tidak ikut berubah

---

## 🗑️ E. Hapus Transaksi

- [ ] Buka edit transaksi → tombol "Hapus Transaksi" muncul di bawah
- [ ] Klik Hapus → muncul dialog konfirmasi (bukan langsung terhapus)
- [ ] Klik "Batal" → data tidak terhapus
- [ ] Klik "Ya, Hapus" → transaksi terhapus dari aplikasi dan dari Sheets
- [ ] Data lain di Sheets tidak ikut terhapus

---

## 📊 F. Dashboard & Filter

- [ ] Filter "Hari ini" → hanya menampilkan transaksi hari ini
- [ ] Filter "Minggu ini" → menampilkan transaksi 7 hari ini
- [ ] Filter "Bulan ini" → menampilkan seluruh bulan berjalan
- [ ] Filter "Custom" → muncul field tanggal awal dan akhir, filter bekerja
- [ ] Total Pemasukan, Total Pengeluaran, Saldo Bersih dihitung dengan benar
- [ ] Insight "Kategori Terbesar" menampilkan kategori pengeluaran tertinggi
- [ ] Insight "Rata-rata/Hari" masuk akal (total pengeluaran ÷ jumlah hari)

---

## 📈 G. Grafik

- [ ] Tab Grafik → semua 3 chart tampil tanpa error
- [ ] Chart "Pengeluaran per Kategori" cocok dengan data di Sheets
- [ ] Chart "Pemasukan vs Pengeluaran" menampilkan batang dua warna
- [ ] Chart "Tren Bulanan" berubah saat filter diganti

---

## 🔍 H. Riwayat & Pencarian

- [ ] Semua transaksi muncul di tab Riwayat (pemasukan hijau, pengeluaran merah)
- [ ] Ketik nama kategori di kolom pencarian → hasil difilter real-time
- [ ] Filter "Pengeluaran" → hanya tampil transaksi pengeluaran
- [ ] Filter "Pemasukan" → hanya tampil transaksi pemasukan
- [ ] Klik filter kategori di pil → hanya tampil kategori itu
- [ ] Hapus teks pencarian → semua transaksi kembali tampil

---

## 📱 I. PWA & Mobile

- [ ] Aplikasi bisa di-install ke layar utama HP
- [ ] Setelah di-install, ikon muncul di layar utama
- [ ] Aplikasi membuka tanpa address bar browser (tampak seperti app native)
- [ ] Tombol ＋ mudah dijangkau dengan jempol
- [ ] Scroll halus, tidak ada elemen yang terpotong di layar kecil
- [ ] Notifikasi sukses/error muncul di bagian atas dan hilang otomatis

---

## 🔒 J. Keamanan

- [ ] Buka URL Web App Apps Script langsung di browser (tanpa login) → pastikan tidak bisa diakses orang lain
  (Harusnya muncul halaman error "You do not have permission" jika diakses dari browser yang tidak login ke akun kamu)

---

## ✅ Semua poin lulus? Aplikasi siap digunakan!

Jika ada poin yang gagal, cek kembali:
- ID Spreadsheet di `Code.gs` sudah benar?
- URL Apps Script di `index.html` sudah diperbarui?
- Nama sheet persis `Pemasukan` dan `Pengeluaran` (huruf kapital pertama)?
- Deployment Apps Script sudah di-update ke "New version" setelah mengedit kode?
