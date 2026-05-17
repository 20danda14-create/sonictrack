/**
 * SonicTrack — Ses Yönü Bulucu
 * Google Apps Script Backend (STEREO ENTEGRASYONLU)
 */

// ── WEB UYGULAMASINI BAŞLAT ──
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('SonicTrack — Ses Yönü Bulucu')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── BAŞLIK SATIRI OLUŞTUR (ilk açılışta) ──
function sayfaBasligiOlustur() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Zaman Damgası', 'Açı (°)', 'Güven Skoru', 'Gecikme (örnek)', 'Yerel Saat', 'Yön Etiketi']);
    
    // Başlığı formatla
    var header = sheet.getRange(1, 1, 1, 6);
    header.setBackground('#0a0a0f');
    header.setFontColor('#00e5ff');
    header.setFontWeight('bold');
    header.setFontFamily('Courier New');
    sheet.setFrozenRows(1);
    
    // Sütun genişlikleri
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 80);
    sheet.setColumnWidth(3, 120);
    sheet.setColumnWidth(4, 140);
    sheet.setColumnWidth(5, 100);
    sheet.setColumnWidth(6, 120);
  }
}

// ── YÖNÜ E-TABLOYA KAYDET ──
function kaydetSesYonu(aci, siddet, gecikme, yerelSaat) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // İlk çalıştırmada başlık oluştur
    if (sheet.getLastRow() === 0) {
      sayfaBasligiOlustur();
    }
    
    // Açıya göre yön etiketi belirle
    var aciNum = parseFloat(aci);
    var yonEtiketi = aciyaGoreYon(aciNum);
    
    // Satırı ekle
    sheet.appendRow([
      new Date(),             // Sistem zaman damgası
      aciNum,                 // Açı
      parseFloat(siddet),     // Güven skoru
      parseInt(gecikme) || 0, // Örneklem Gecikmesi (TDOA)
      yerelSaat || '',        // Cihazın yerel saati
      yonEtiketi              // Yön açıklaması
    ]);
    
    // Son satırı renklendir (güven skoruna göre görsel dinamizm)
    var lastRow = sheet.getLastRow();
    var confScore = parseFloat(siddet);
    var rowColor = confScore > 0.6 ? '#0d2b1a' : confScore > 0.3 ? '#1a1a0a' : '#1a0a0a';
    sheet.getRange(lastRow, 1, 1, 6).setBackground(rowColor);
    
    return { success: true, row: lastRow };
    
  } catch (e) {
    Logger.log('Kayıt hatası: ' + e.toString());
    return { success: false, error: e.toString() };
  }
}

// ── ACI → YÖN ETIKETI DÖNÜŞTÜRÜCÜ ──
function aciyaGoreYon(aci) {
  if (aci < 15)  return 'Sol Sektör (Tam Sol)';
  if (aci < 45)  return 'Sol';
  if (aci < 75)  return 'Ön Sol';
  if (aci < 105) return 'Doğrudan Karşı';
  if (aci < 135) return 'Ön Sağ';
  if (aci < 165) return 'Sağ';
  return 'Sağ Sektör (Tam Sağ)';
}

// ── İSTATİSTİK RAPORU ──
function raporOlustur() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    SpreadsheetApp.getUi().alert('Henüz yeterli veri yok.');
    return;
  }
  
  var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  var totalRecords = data.length;
  var angles = data.map(r => parseFloat(r[1])).filter(a => !isNaN(a));
  var avgAngle = angles.reduce((a, b) => a + b, 0) / angles.length;
  
  var msg = '📊 SonicTrack Raporu\n\n';
  msg += 'Toplam Kayıt: ' + totalRecords + '\n';
  msg += 'Ortalama Açı: ' + avgAngle.toFixed(1) + '°\n';
  msg += 'Min Açı: ' + Math.min(...angles).toFixed(1) + '°\n';
  msg += 'Max Açı: ' + Math.max(...angles).toFixed(1) + '°\n';
  
  SpreadsheetApp.getUi().alert(msg);
}

// ── MENÜ EKLE ──
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SonicTrack')
    .addItem('Başlık Oluştur', 'sayfaBasligiOlustur')
    .addItem('İstatistik Raporu', 'raporOlustur')
    .addToUi();
}
