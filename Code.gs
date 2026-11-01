// ============================================================
// KEUANGAN PRIBADI — Google Apps Script Backend
// File: Code.gs
// Hubungkan ke spreadsheet kamu, lalu deploy sebagai Web App.
// ============================================================

// ─── KONFIGURASI ─────────────────────────────────────────────
const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_KAMU';
const SHEET_PEMASUKAN  = 'Pemasukan';
const SHEET_PENGELUARAN = 'Pengeluaran';

// Header kolom sesuai spreadsheet eksisting
const HEADERS = ['Tanggal', 'Kategori', 'Nominal', 'Catatan'];

// ─── ENTRY POINT HTTP ────────────────────────────────────────
// Semua request (baca & tulis) pakai doGet agar tidak kena
// batasan CORS/redirect pada cross-origin POST dari browser.

function doGet(e) {
  const action = e.parameter.action || '';
  try {
    let result;
    if      (action === 'getAll')          result = getAllData();
    else if (action === 'getSummary')      result = getSummary(e.parameter.startDate, e.parameter.endDate);
    else if (action === 'addTransaction')  result = addTransaction(JSON.parse(decodeURIComponent(e.parameter.data)));
    else if (action === 'editTransaction') result = editTransaction(JSON.parse(decodeURIComponent(e.parameter.data)));
    else if (action === 'deleteTransaction') result = deleteTransaction(JSON.parse(decodeURIComponent(e.parameter.data)));
    else result = { error: 'Action tidak dikenal' };
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// doPost tetap ada sebagai fallback, tidak dihapus
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action  = payload.action || '';
    let result;
    if      (action === 'addTransaction')    result = addTransaction(payload.data);
    else if (action === 'editTransaction')   result = editTransaction(payload.data);
    else if (action === 'deleteTransaction') result = deleteTransaction(payload.data);
    else result = { error: 'Action tidak dikenal' };
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// ─── TAMBAH TRANSAKSI ────────────────────────────────────────

function addTransaction(data) {
  validateTransaction(data);
  const sheet = getSheet(data.type);
  const row   = buildRow(data);
  sheet.appendRow(row);
  return { success: true, message: 'Transaksi berhasil disimpan.' };
}

// ─── EDIT TRANSAKSI ──────────────────────────────────────────

function editTransaction(data) {
  validateTransaction(data);
  const sheet   = getSheet(data.type);
  const rowIndex = findRowIndex(sheet, data.id);
  if (!rowIndex) return { error: 'Data tidak ditemukan.' };
  const row = buildRow(data);
  row.forEach((val, i) => sheet.getRange(rowIndex, i + 1).setValue(val));
  return { success: true, message: 'Transaksi berhasil diperbarui.' };
}

// ─── HAPUS TRANSAKSI ─────────────────────────────────────────

function deleteTransaction(data) {
  const sheet    = getSheet(data.type);
  const rowIndex = findRowIndex(sheet, data.id);
  if (!rowIndex) return { error: 'Data tidak ditemukan.' };
  sheet.deleteRow(rowIndex);
  return { success: true, message: 'Transaksi berhasil dihapus.' };
}

// ─── AMBIL SEMUA DATA ────────────────────────────────────────

function getAllData() {
  const pemasukan   = sheetToObjects(SHEET_PEMASUKAN,  'pemasukan');
  const pengeluaran = sheetToObjects(SHEET_PENGELUARAN, 'pengeluaran');
  return { pemasukan, pengeluaran };
}

// ─── SUMMARY PERIODE ─────────────────────────────────────────

function getSummary(startDate, endDate) {
  const all       = getAllData();
  const start     = startDate ? new Date(startDate) : null;
  const end       = endDate   ? new Date(endDate)   : null;

  const filter = (list) => list.filter(t => {
    if (!start && !end) return true;
    const d = new Date(t.tanggal);
    if (start && d < start) return false;
    if (end   && d > end)   return false;
    return true;
  });

  const pemasukanFiltered   = filter(all.pemasukan);
  const pengeluaranFiltered = filter(all.pengeluaran);

  const totalPemasukan   = pemasukanFiltered.reduce((s, t) => s + t.nominal, 0);
  const totalPengeluaran = pengeluaranFiltered.reduce((s, t) => s + t.nominal, 0);

  // Pengeluaran per kategori
  const perKategori = {};
  pengeluaranFiltered.forEach(t => {
    perKategori[t.kategori] = (perKategori[t.kategori] || 0) + t.nominal;
  });

  // Tren harian (pengeluaran)
  const trenHarian = {};
  pengeluaranFiltered.forEach(t => {
    trenHarian[t.tanggal] = (trenHarian[t.tanggal] || 0) + t.nominal;
  });

  return {
    totalPemasukan,
    totalPengeluaran,
    saldoBersih: totalPemasukan - totalPengeluaran,
    perKategori,
    trenHarian,
    jmlPemasukan:   pemasukanFiltered.length,
    jmlPengeluaran: pengeluaranFiltered.length,
  };
}

// ─── HELPER ──────────────────────────────────────────────────

function getSheet(type) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const name  = type === 'pemasukan' ? SHEET_PEMASUKAN : SHEET_PENGELUARAN;
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error(`Sheet "${name}" tidak ditemukan.`);
  return sheet;
}

function buildRow(data) {
  // Urutan kolom: Tanggal | Kategori | Nominal | Catatan
  return [
    data.tanggal,
    data.kategori,
    Number(data.nominal),
    data.catatan || '',
  ];
}

function sheetToObjects(sheetName, type) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];                       // hanya header, tidak ada data
  const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  return data
    .filter(row => row[0] !== '' && row[2] !== '') // skip baris kosong
    .map((row, i) => ({
      id:       `${type}_${i + 2}`,               // id = nama_sheet + nomor baris
      tanggal:  formatDate(row[0]),
      kategori: row[1] || '',
      nominal:  parseNominal(row[2]),
      catatan:  row[3] || '',
      type:     type,
    }));
}

function findRowIndex(sheet, id) {
  // id format: "pemasukan_5" atau "pengeluaran_3" → baris ke-5 atau ke-3
  const parts   = id.split('_');
  const rowNum  = parseInt(parts[parts.length - 1], 10);
  if (isNaN(rowNum) || rowNum < 2) return null;
  return rowNum;
}

function formatDate(value) {
  if (!value) return '';
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(value);
}

function parseNominal(value) {
  if (typeof value === 'number') return value;
  // Bersihkan Rp, titik pemisah ribuan, spasi
  const cleaned = String(value).replace(/[Rp\s.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

function validateTransaction(data) {
  if (!data.tanggal)                throw new Error('Tanggal tidak boleh kosong.');
  if (!data.kategori)               throw new Error('Kategori tidak boleh kosong.');
  if (!data.nominal || data.nominal <= 0) throw new Error('Nominal harus lebih dari 0.');
  if (!['pemasukan', 'pengeluaran'].includes(data.type))
    throw new Error('Jenis transaksi tidak valid.');
}

function jsonResponse(data) {
  // Tambah CORS header agar browser tidak blokir response
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
