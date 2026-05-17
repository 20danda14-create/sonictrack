# 🎯 SonicTrack — Ses Yönü Bulucu

iPhone mikrofonu kullanarak sesin geldiği yönü gerçek zamanlı olarak gösteren web uygulaması.  
Google Apps Script üzerinde çalışır, tüm veriler Google E-Tablolar'a otomatik kaydedilir.

---

## 📁 Dosya Yapısı

```
ses-yon-bulucu/
├── index.html    ← iPhone'da açılan arayüz
├── Code.gs       ← Google Apps Script backend
└── README.md     ← Bu dosya
```

---

## 🚀 ADIM ADIM KURULUM

### BÖLÜM 1 — Google E-Tablo ve Apps Script Kurulumu

**1. Yeni Google E-Tablo oluşturun**
- [sheets.google.com](https://sheets.google.com) adresine gidin
- `+` ile yeni boş bir e-tablo oluşturun
- İstediğiniz ismi verin (örn: "SonicTrack Veriler")

**2. Apps Script editörünü açın**
- E-tablo içinde: `Uzantılar` → `Apps Script`
- Yeni bir sekme açılır

**3. `Code.gs` dosyasını yapıştırın**
- Sol panelde `Code.gs` zaten açık gelir
- İçindeki tüm metni silin
- `Code.gs` dosyasından kopyaladığınız kodu yapıştırın
- Kaydet: `Ctrl+S` (Mac: `Cmd+S`)

**4. `index.html` dosyasını ekleyin**
- Sol panelde `+` butonuna tıklayın → `HTML dosyası` seçin
- Dosya adı: `index` yazın (uzantı olmadan, Apps Script otomatik ekler)
- İçine `index.html` dosyasındaki kodu yapıştırın
- Kaydet

**5. Web uygulaması olarak yayınlayın**
- Sağ üstte `Dağıt` → `Yeni dağıtım` tıklayın
- Dişli simgesine → `Web uygulaması` seçin
- Ayarlar:
  - **Açıklama:** `SonicTrack v1`
  - **Farklı çalıştır:** Kendi adınıza (Me)
  - **Erişim:** `Herkes` (Anyone)
- `Dağıt` butonuna basın
- İzin isteği gelirse: `Erişime izin ver` → Google hesabınızla onaylayın
- **Web uygulaması URL'sini kopyalayın** — bu URL'i telefonunuzda açacaksınız!

---

### BÖLÜM 2 — GitHub'a Yükleme (Opsiyonel / Yedek)

> Not: Uygulama doğrudan Google Apps Script URL'inden çalışır.
> GitHub sadece kodunuzu saklamak/paylaşmak içindir.

**1. GitHub hesabı açın** (yoksa)
- [github.com](https://github.com) → Sign Up

**2. Yeni repository oluşturun**
- Sağ üstte `+` → `New repository`
- Repository name: `sonictrack`
- Description: `iPhone ses yönü bulucu`
- **Public** seçin
- `Create repository` tıklayın

**3. Dosyaları yükleyin**
- Repository sayfasında `uploading an existing file` linkine tıklayın
- `index.html`, `Code.gs` ve `README.md` dosyalarını sürükleyin
- Alt kısımda `Commit changes` butonuna basın

**4. (Opsiyonel) GitHub Pages ile de yayınlama**
- Repository → `Settings` → `Pages`
- Source: `Deploy from a branch` → Branch: `main` → `/root`
- `Save` tıklayın
- Birkaç dakika sonra `https://KULLANICIADI.github.io/sonictrack` URL aktif olur
- ⚠️ UYARI: GitHub Pages versiyonu Google E-Tablolar'a kaydedemez (Google Script bağlantısı olmadan çalışır, sadece görsel sunar)

---

### BÖLÜM 3 — iPhone'da Çalıştırma

**Yöntem A — Google Apps Script URL (Önerilen)**
1. Apps Script'ten aldığınız URL'i iPhone'da Safari ile açın
2. `Mikrofonu Başlat` butonuna basın
3. Mikrofon izni isteği gelir → `İzin Ver`
4. Hazır!

**Yöntem B — Ana Ekrana Ekle (Uygulama gibi)**
1. Safari'de Apps Script URL'ini açın
2. Alt çubuktaki `Paylaş` simgesine (kare + ok) basın
3. `Ana Ekrana Ekle` seçin
4. İsim: `SonicTrack` → `Ekle`
5. Artık ikon olarak görünür, uygulama gibi açılır!

---

## ⚙️ Teknik Detaylar

| Özellik | Değer |
|---|---|
| Algoritma | Cross-Correlation (zaman gecikmesi analizi) |
| FFT Boyutu | 2048 örnek |
| Örnekleme hızı | 48.000 Hz |
| Tarama aralığı | ±20 örnek (±0.4ms) |
| Güncelleme hızı | ~8 Hz (120ms) |
| Açı aralığı | 0° – 180° (Sol – Sağ) |
| Tarayıcı | Safari iOS 14.5+ |

## 📊 E-Tablodaki Sütunlar

| Sütun | İçerik |
|---|---|
| A | Zaman Damgası |
| B | Açı (0–180°) |
| C | Güven Skoru (0–1) |
| D | Gecikme (örnek sayısı) |
| E | Yerel Saat |
| F | Yön Etiketi |

---

## 🔧 Sorun Giderme

**Mikrofon izni gelmiyor:**
- Safari → Ayarlar → Gizlilik → Mikrofon → Safari'nin yanındaki geçiş açık olmalı

**Ses algılanmıyor / ibre hareket etmiyor:**
- Yüksek sesle konuşun veya tıklama sesi yapın
- Enerji eşiği küçük sesleri filtreler (tasarım gereği)

**Stereyo çalışmıyor (ibre hep 90° kalıyor):**
- iPhone'un dahili mikrofonu stereodur, ama bazı uygulamalar mono kilitler
- Hoparlöre yakın konuşmayın (echo cancellation'ı kapattık)
- iOS 15+ cihazlarda daha iyi çalışır

**Google Sheets'e kayıt olmuyor:**
- Dağıtım ayarlarında "Erişim: Herkes" seçili olmalı
- Tekrar dağıtım yapın: `Dağıt` → `Dağıtımları yönet` → kalem simgesi → güncelle

---

## 📄 Lisans

MIT — İstediğiniz gibi kullanın ve geliştirin.
