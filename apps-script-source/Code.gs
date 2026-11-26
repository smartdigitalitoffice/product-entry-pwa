/**
 * Bangla Product Dashboard — standalone Apps Script project
 * IMPORTANT: Paste your Google Spreadsheet ID in SPREADSHEET_ID below.
 */
const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';

const CFG = {
  SHEET_PRODUCTS: 'Products',
  SHEET_MOVES: 'StockLog',
  FOLDER_NAME: 'Bangla Product Dashboard',
  BACKUP_FOLDER: 'Backups',
  IMAGE_FOLDER: 'Product Images',
  CURRENCY: '৳',
  MAX_IMAGE_BYTES: 2 * 1024 * 1024
};

/** Run this once from the Apps Script editor after setting SPREADSHEET_ID. */
function initializeDashboard() {
  const id = String(SPREADSHEET_ID || '').trim();
  if (!id || id === 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE') {
    throw new Error('Code.gs-এর SPREADSHEET_ID-তে আপনার Google Sheet ID বসিয়ে Save করুন।');
  }
  // Validate the ID and confirm that the signed-in account can access the sheet.
  const ss = SpreadsheetApp.openById(id);
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  setup_();
  return 'সেটআপ সম্পন্ন: ' + ss.getName();
}

function doGet() {
  setup_();
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('বাংলা Product Entry Dashboard')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function getSS_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) {
    throw new Error('প্রথমে Code.gs-এ SPREADSHEET_ID বসিয়ে initializeDashboard একবার Run করুন।');
  }
  return SpreadsheetApp.openById(id);
}

function setup_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SPREADSHEET_ID');
  if (!id) {
    throw new Error('SPREADSHEET_ID সেট করা নেই। Code.gs-এ Sheet ID বসিয়ে initializeDashboard Run করুন।');
  }
  const ss = SpreadsheetApp.openById(id);

  let products = ss.getSheetByName(CFG.SHEET_PRODUCTS);
  if (!products) products = ss.insertSheet(CFG.SHEET_PRODUCTS);
  if (products.getLastRow() === 0) {
    products.appendRow(['ID','নাম','ক্যাটাগরি','SKU','ক্রয়মূল্য','বিক্রয়মূল্য','স্টক','সর্বনিম্ন স্টক','ছবির URL','Drive File ID','বিবরণ','তৈরির সময়','আপডেট সময়']);
    products.setFrozenRows(1);
  }

  let log = ss.getSheetByName(CFG.SHEET_MOVES);
  if (!log) log = ss.insertSheet(CFG.SHEET_MOVES);
  if (log.getLastRow() === 0) {
    log.appendRow(['সময়','Product ID','পণ্যের নাম','ধরন','পরিমাণ','নোট']);
    log.setFrozenRows(1);
  }

  // Create the Drive folders once and retain their IDs in Script Properties.
  if (!props.getProperty('ROOT_FOLDER_ID')) {
    const root = DriveApp.createFolder(CFG.FOLDER_NAME);
    const images = root.createFolder(CFG.IMAGE_FOLDER);
    const backups = root.createFolder(CFG.BACKUP_FOLDER);
    props.setProperties({
      ROOT_FOLDER_ID: root.getId(),
      IMAGE_FOLDER_ID: images.getId(),
      BACKUP_FOLDER_ID: backups.getId()
    });
  }
}

function getData() {
  setup_();
  const ss = getSS_();
  const rows = ss.getSheetByName(CFG.SHEET_PRODUCTS).getDataRange().getValues();
  const products = rows.slice(1).filter(r => r[0]).map(r => ({
    id: String(r[0]), name: r[1] || '', category: r[2] || '', sku: r[3] || '',
    cost: Number(r[4]) || 0, price: Number(r[5]) || 0,
    stock: Number(r[6]) || 0, minStock: Number(r[7]) || 0,
    imageUrl: r[8] || '', fileId: r[9] || '', description: r[10] || '',
    created: r[11] ? new Date(r[11]).toISOString() : '',
    updated: r[12] ? new Date(r[12]).toISOString() : ''
  }));
  return { products, currency: CFG.CURRENCY, spreadsheetUrl: ss.getUrl() };
}

function saveProduct(p) {
  setup_();
  if (!p || !String(p.name || '').trim()) throw new Error('পণ্যের নাম দিতে হবে।');
  const cost = Number(p.cost), price = Number(p.price), stock = Number(p.stock), minStock = Number(p.minStock);
  if (![cost, price, stock, minStock].every(Number.isFinite) || [cost, price, stock, minStock].some(n => n < 0)) {
    throw new Error('মূল্য ও স্টক শূন্য বা তার বেশি সঠিক সংখ্যা হতে হবে।');
  }
  if (!Number.isInteger(stock) || !Number.isInteger(minStock)) throw new Error('স্টক ও সর্বনিম্ন স্টক পূর্ণসংখ্যা হতে হবে।');

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = getSS_().getSheetByName(CFG.SHEET_PRODUCTS);
    const data = sh.getDataRange().getValues();
    const id = p.id || Utilities.getUuid();
    const idx = data.findIndex((r, i) => i > 0 && String(r[0]) === String(id));
    const old = idx > 0 ? data[idx] : null;
    let imageUrl = old ? old[8] : '', fileId = old ? old[9] : '';

    if (p.imageData && p.imageName) {
      const match = String(p.imageData).match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,([\s\S]+)$/i);
      if (!match) throw new Error('শুধু JPG, PNG বা WebP ছবি আপলোড করুন।');
      const bytes = Utilities.base64Decode(match[2]);
      if (bytes.length > CFG.MAX_IMAGE_BYTES) throw new Error('ছবির সাইজ 2 MB-এর মধ্যে রাখুন।');
      const folderId = PropertiesService.getScriptProperties().getProperty('IMAGE_FOLDER_ID');
      const blob = Utilities.newBlob(bytes, match[1], p.imageName);
      const file = DriveApp.getFolderById(folderId).createFile(blob);
      // Link sharing is used so the image can render in the web dashboard.
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      imageUrl = 'https://drive.google.com/uc?export=view&id=' + file.getId();
      const previousFileId = fileId;
      fileId = file.getId();
      if (previousFileId) { try { DriveApp.getFileById(previousFileId).setTrashed(true); } catch (e) {} }
    }

    const now = new Date();
    const row = [id, String(p.name).trim(), String(p.category || '').trim(), String(p.sku || '').trim(),
      cost, price, stock, minStock, imageUrl, fileId, String(p.description || '').trim(), old ? old[11] : now, now];
    if (idx > 0) sh.getRange(idx + 1, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return getData();
  } finally {
    lock.releaseLock();
  }
}

function deleteProduct(id) {
  setup_();
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = getSS_().getSheetByName(CFG.SHEET_PRODUCTS);
    const data = sh.getDataRange().getValues();
    const idx = data.findIndex((r, i) => i > 0 && String(r[0]) === String(id));
    if (idx < 0) throw new Error('পণ্য পাওয়া যায়নি।');
    const fileId = data[idx][9];
    sh.deleteRow(idx + 1);
    if (fileId) { try { DriveApp.getFileById(fileId).setTrashed(true); } catch (e) {} }
    return getData();
  } finally {
    lock.releaseLock();
  }
}

function adjustStock(id, delta, note) {
  setup_();
  const amount = Number(delta);
  if (!Number.isInteger(amount) || amount === 0) throw new Error('শূন্য ছাড়া পূর্ণ সংখ্যা দিন।');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ss = getSS_();
    const sh = ss.getSheetByName(CFG.SHEET_PRODUCTS);
    const data = sh.getDataRange().getValues();
    const idx = data.findIndex((r, i) => i > 0 && String(r[0]) === String(id));
    if (idx < 0) throw new Error('পণ্য পাওয়া যায়নি।');
    const current = Number(data[idx][6]) || 0;
    const next = current + amount;
    if (next < 0) throw new Error('স্টক শূন্যের নিচে হতে পারবে না।');
    sh.getRange(idx + 1, 7).setValue(next);
    sh.getRange(idx + 1, 13).setValue(new Date());
    ss.getSheetByName(CFG.SHEET_MOVES).appendRow([new Date(), id, data[idx][1], amount > 0 ? 'স্টক যোগ' : 'স্টক কম', Math.abs(amount), note || '']);
    return getData();
  } finally {
    lock.releaseLock();
  }
}

function getReportData() {
  const d = getData();
  return { products: d.products, totals: {
    count: d.products.length,
    units: d.products.reduce((s, p) => s + p.stock, 0),
    cost: d.products.reduce((s, p) => s + p.stock * p.cost, 0),
    value: d.products.reduce((s, p) => s + p.stock * p.price, 0),
    profit: d.products.reduce((s, p) => s + p.stock * (p.price - p.cost), 0)
  }};
}

function exportExcel() {
  setup_();
  const ss = getSS_();
  const folder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('BACKUP_FOLDER_ID'));
  const temp = SpreadsheetApp.create('Product Report ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmm'));
  const source = ss.getSheetByName(CFG.SHEET_PRODUCTS).getDataRange().getValues();
  const target = temp.getSheets()[0];
  target.setName('Products');
  if (source.length && source[0].length) target.getRange(1, 1, source.length, source[0].length).setValues(source);
  SpreadsheetApp.flush();
  const url = 'https://docs.google.com/spreadsheets/d/' + temp.getId() + '/export?format=xlsx';
  const blob = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } }).getBlob().setName('Product-Report.xlsx');
  const file = folder.createFile(blob);
  DriveApp.getFileById(temp.getId()).setTrashed(true);
  return { url: file.getUrl(), name: file.getName() };
}

function exportPdf() {
  setup_();
  const ss = getSS_();
  const folder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('BACKUP_FOLDER_ID'));
  const sh = ss.getSheetByName(CFG.SHEET_PRODUCTS);
  const url = 'https://docs.google.com/spreadsheets/d/' + ss.getId() + '/export?format=pdf&gid=' + sh.getSheetId() + '&portrait=false&fitw=true&sheetnames=false&printtitle=false&pagenumbers=true&gridlines=true';
  const blob = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } }).getBlob().setName('Product-Report.pdf');
  const file = folder.createFile(blob);
  return { url: file.getUrl(), name: file.getName() };
}

function createBackup() {
  setup_();
  const ss = getSS_();
  const folder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('BACKUP_FOLDER_ID'));
  const file = DriveApp.getFileById(ss.getId()).makeCopy('Backup-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss'), folder);
  return { url: file.getUrl(), name: file.getName() };
}
