---
title: "FlowMind Studio"
emoji: "⚡"
colorFrom: "purple"
colorTo: "blue"
sdk: "docker"
sdk_version: "0.0.0"
app_file: "Dockerfile"
pinned: false
---

# FlowMind Studio

AI-Powered Workflow Automation Studio - n8n benzeri görsel workflow editörü ile yapay zeka asistanı entegrasyonu.

## 🎯 Proje Hakkında

FlowMind Studio, görsel bir workflow otomasyon platformudur. Kullanıcılar, sürükle-bırak arayüzü ile karmaşık iş akışlarını tasarlayabilir, AI asistanı ile doğal dil kullanarak workflow'lar oluşturabilir ve çeşitli entegrasyonlar ile otomasyonlar geliştirebilirler.

## ✨ Özellikler

### 🎨 Görsel Workflow Editörü
- **ReactFlow Tabanlı Canvas**: Modern ve kullanıcı dostu node-based tasarım arayüzü
- **Sürükle-Bırak**: Sol panelden node'ları canvas'a sürükleyerek ekleme
- **Bağlantı Sistemi**: Node'ları birbirine bağlayarak akış oluşturma
- **Zoom & Pan**: Canvas üzerinde gezinme ve yakınlaştırma
- **MiniMap**: Workflow'un genel görünümünü gösteren harita
- **Koyu Tema**: Göz yormayan modern arayüz tasarımı

### 📊 Kapsamlı Node Sistemi (100+ Node Tipi)

#### 🔴 Triggers (Tetikleyiciler)
- `start` - Workflow başlangıç noktası
- `webhook_trigger` - Webhook ile tetikleme
- `schedule_trigger` - Zamanlanmış tetikleme
- `email_trigger` - Email ile tetikleme
- `file_watch_trigger` - Dosya değişikliği izleme

#### 🔵 Flow & Logic (Akış Kontrolü)
- `decision` - Koşullu dallanma
- `switch` - Çoklu dallanma
- `delay` - Gecikme ekleme
- `parallel_split` - Paralel işlem başlatma
- `parallel_join` - Paralel işlem birleştirme
- `loop` - Döngü oluşturma
- `merge` - Akışları birleştirme
- `wait` - Bekleme

#### 🤖 AI Nodes (Yapay Zeka)
- `ai_step` - Genel AI adımı
- `ai_classify` - Sınıflandırma
- `ai_extract` - Veri çıkarma
- `ai_simulate` - Simülasyon
- `ai_embed` - Embedding oluşturma
- `ai_summarize` - Özetleme
- `ai_translate` - Çeviri

#### 🔌 Integrations (Entegrasyonlar)

**HTTP & Webhooks:**
- `http` - HTTP istekleri
- `webhook_call` - Webhook çağrıları
- `rest_api` - REST API entegrasyonu
- `graphql` - GraphQL sorguları

**Database:**
- `db_query` - Veritabanı sorgulama
- `db_insert` - Veri ekleme
- `db_update` - Veri güncelleme
- `db_delete` - Veri silme

**Google Servisleri:**
- `google_sheets` - Google Sheets
- `google_drive` - Google Drive
- `google_calendar` - Google Calendar
- `google_gmail` - Gmail
- `google_analytics` - Google Analytics
- `google_cloud_storage` - Cloud Storage

**İletişim:**
- `slack` - Slack entegrasyonu
- `discord` - Discord entegrasyonu
- `telegram` - Telegram entegrasyonu
- `whatsapp` - WhatsApp entegrasyonu
- `sms` - SMS gönderimi

**Cloud Storage:**
- `aws_s3` - Amazon S3
- `azure_blob` - Azure Blob Storage
- `dropbox` - Dropbox

**Productivity:**
- `notion` - Notion
- `airtable` - Airtable
- `trello` - Trello
- `asana` - Asana
- `jira` - Jira

**E-commerce:**
- `shopify` - Shopify
- `woocommerce` - WooCommerce
- `stripe` - Stripe
- `paypal` - PayPal

**Social Media:**
- `twitter` - Twitter/X
- `facebook` - Facebook
- `instagram` - Instagram
- `linkedin` - LinkedIn
- `youtube` - YouTube

**CRM:**
- `salesforce` - Salesforce
- `hubspot` - HubSpot
- `zoho` - Zoho

#### 🛠️ Data & Utils (Veri İşleme)
- `transform` - Veri dönüştürme
- `filter` - Veri filtreleme
- `map_fields` - Alan eşleştirme
- `log` - Loglama
- `set_variable` - Değişken atama
- `get_variable` - Değişken okuma
- `json_parse` / `json_stringify` - JSON işlemleri
- `csv_parse` / `csv_generate` - CSV işlemleri
- `xml_parse` - XML işlemleri
- `base64_encode` / `base64_decode` - Base64 işlemleri
- `hash` - Hash oluşturma
- `encrypt` / `decrypt` - Şifreleme

#### 📤 Outputs (Çıktılar)
- `output` - Çıktı oluşturma
- `notify` - Bildirim gönderme
- `email_send` - Email gönderme
- `file_write` - Dosya yazma
- `file_download` - Dosya indirme

### 🤖 AI Asistanı
- **Doğal Dil İşleme**: Türkçe ve İngilizce destekli AI asistanı
- **Otomatik Workflow Oluşturma**: Doğal dilde istek yazarak workflow oluşturma
- **Akıllı Node Önerileri**: AI'ın uygun node'ları önermesi
- **Chat Arayüzü**: Kullanıcı dostu sohbet paneli

### 💾 State Yönetimi
- **Zustand Store**: Merkezi state yönetimi
- **Workflow CRUD**: Oluşturma, okuma, güncelleme, silme
- **Workflow Metadata**: Ad, açıklama ve aktif/pasif durumu güncelleme
- **Node Yönetimi**: Node ekleme, güncelleme, silme
- **Edge Yönetimi**: Bağlantı yönetimi
- **Real-time Sync**: Canvas ve store arasında anlık senkronizasyon
- **Kaydetme Sistemi**: Workflow adı, açıklaması, nodes ve edges birlikte kaydetme

### 🔗 Backend Entegrasyonu
- **REST API**: Tam RESTful API entegrasyonu
- **Hata Yönetimi**: Kapsamlı hata yakalama ve gösterimi
- **Veri Normalizasyonu**: Backend (snake_case) ↔ Frontend (camelCase) dönüşümü
- **Workflow Kaydetme**: Ad, açıklama, aktif/pasif durumu ve graph yapısını birlikte kaydetme
- **API Endpoints**: GET, POST, PUT, DELETE işlemleri ile tam CRUD desteği
- **Veri Senkronizasyonu**: Workflow adı, açıklaması ve graph yapısının backend ile senkronizasyonu

### 🎛️ UI Bileşenleri
- **WorkflowMetaPanel**: Workflow bilgileri, ad, açıklama, aktif/pasif durumu - ad ve açıklama değişikliklerini kaydetme
- **NodePalette**: Kategorize edilmiş node listesi, arama özelliği
- **WorkflowCanvas**: Ana editör canvas, ReactFlow entegrasyonu
- **NodeSettingsPanel**: Seçili node'un ayarlarını düzenleme
- **AIChatPanel**: AI asistanı ile sohbet paneli
- **RunLogPanel**: Workflow çalıştırma logları ve sonuçları

## 🛠️ Teknolojiler

- **Next.js 16** - App Router ile modern React framework
- **React 18** - UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **TailwindCSS** - Utility-first CSS framework
- **ReactFlow** - Görsel workflow editörü
- **Zustand** - Hafif state management
- **Lucide React** - Modern ikon kütüphanesi

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📁 Proje Yapısı

```
├── app/
│   ├── page.tsx                    # Ana sayfa (Dashboard)
│   ├── workflow/[id]/
│   │   └── page.tsx                # Workflow editör sayfası
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global stiller
├── components/
│   ├── ui/                         # Temel UI bileşenleri
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Textarea.tsx
│   └── workflow/                   # Workflow özel bileşenleri
│       ├── NodeTypes.tsx           # Custom node tipleri ve render
│       ├── NodePalette.tsx         # Node ekleme paneli
│       ├── WorkflowCanvas.tsx      # ReactFlow canvas
│       ├── NodeSettingsPanel.tsx   # Node ayarları paneli
│       ├── AIChatPanel.tsx         # AI asistan paneli
│       ├── RunLogPanel.tsx         # Çalıştırma logları paneli
│       └── WorkflowMetaPanel.tsx   # Workflow meta bilgileri paneli
├── store/
│   └── workflowStore.ts            # Zustand state management
├── types/
│   ├── workflow.ts                 # Workflow TypeScript tipleri
│   └── nodes.ts                    # Node tipleri ve metadata
├── lib/
│   ├── api.ts                      # Backend API entegrasyonu
│   └── utils.ts                    # Yardımcı fonksiyonlar
└── package.json                    # Proje bağımlılıkları
```

## 🚀 Kullanım

### Yeni Workflow Oluşturma

1. Ana sayfada **"Yeni Workflow"** butonuna tıklayın
2. Otomatik olarak editör sayfasına yönlendirilirsiniz
3. Üst panelden (WorkflowMetaPanel) workflow **adı** ve **açıklamasını** düzenleyin
4. Sol panelden (NodePalette) istediğiniz node'u seçin
5. Node'u canvas'a sürükleyin veya tıklayarak ekleyin
6. Node'ları birbirine bağlamak için output portundan input portuna sürükleyin
7. Node'a tıklayarak sağ panelden (NodeSettingsPanel) ayarlarını düzenleyin
8. **"Kaydet"** butonuna tıklayarak workflow adı, açıklaması, nodes ve edges'i birlikte kaydedin

> **Not**: Workflow adı ve açıklaması değişiklikleri kaydetmek için **"Kaydet"** butonuna tıklamanız gerekir. Kaydet butonu, workflow'un tüm bilgilerini (ad, açıklama, aktif/pasif durumu, nodes, edges) backend'e gönderir.

### AI ile Workflow Oluşturma

1. Workflow editör sayfasında sağ paneldeki **AI Chat** sekmesine gidin
2. Doğal dilde workflow isteğinizi yazın (örn: "Bir email al, AI ile analiz et, sonucu Slack'e gönder")
3. **"Akışı Öner"** butonuna tıklayın
4. AI otomatik olarak uygun node'ları ve bağlantıları oluşturacak
5. Oluşturulan workflow'u düzenleyebilir ve özelleştirebilirsiniz

### Node Ayarlarını Düzenleme

1. Canvas üzerinde bir node'a tıklayın
2. Sağ panelde (NodeSettingsPanel) node'un ayarları görünecektir
3. Node'un label'ını, config parametrelerini düzenleyin
4. Değişiklikler anlık olarak uygulanır

### Workflow Çalıştırma

1. Workflow'u tasarlayın ve kaydedin
2. Üst paneldeki **"Çalıştır"** butonuna tıklayın
3. Alt panelde (RunLogPanel) çalıştırma logları görünecektir
4. Her node'un durumunu (başarılı, hata, çalışıyor) görebilirsiniz
5. Node'lara tıklayarak payload ve hata detaylarını inceleyebilirsiniz

### Workflow Yönetimi

- **Dashboard**: Ana sayfada tüm workflow'larınızı görüntüleyin
- **Düzenleme**: Workflow kartına tıklayarak editöre gidin
- **Ad/Açıklama Güncelleme**: Üst panelde workflow adı ve açıklamasını düzenleyip **"Kaydet"** butonuna tıklayın
- **Silme**: Workflow kartındaki çöp kutusu ikonuna tıklayın veya üst paneldeki **"Sil"** butonunu kullanın
- **Aktif/Pasif**: Workflow'un aktif/pasif durumunu üst panelden **"Aktifleştir/Pasifleştir"** butonu ile değiştirin
- **Kaydetme**: Workflow adı, açıklaması, nodes ve edges değişikliklerini kaydetmek için **"Kaydet"** butonunu kullanın

## 🔧 Geliştirme

### Linting

```bash
npm run lint
```

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## 🌐 API Entegrasyonu

Proje, backend API ile entegre çalışmaktadır. API base URL'i `lib/api.ts` dosyasında tanımlanmıştır:

```typescript
const API_BASE = "https://flowmind-ai-flowmind-core-api.hf.space/api";
```

### API Endpoints

- `GET /workflows/` - Tüm workflow'ları listele
- `GET /workflows/:id` - Tek bir workflow getir
- `POST /workflows/` - Yeni workflow oluştur
- `PUT /workflows/:id` - Workflow güncelle (ad, açıklama, aktif/pasif durumu, graphJson)
- `DELETE /workflows/:id` - Workflow sil

### API Veri Formatı

**Backend'e gönderilen format (snake_case):**
```json
{
  "name": "Workflow Adı",
  "description": "Workflow Açıklaması",
  "is_active": true,
  "graph_json": {
    "nodes": [...],
    "edges": [...]
  }
}
```

**Backend'den gelen format (snake_case → camelCase):**
```json
{
  "id": "workflow-id",
  "name": "Workflow Adı",
  "description": "Workflow Açıklaması",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "graphJson": {
    "nodes": [...],
    "edges": [...]
  }
}
```

Veri normalizasyonu `lib/api.ts` dosyasında otomatik olarak yapılmaktadır.

## 📝 Önemli Notlar

### Workflow Kaydetme
- **Workflow adı ve açıklaması** değişikliklerini kaydetmek için **"Kaydet"** butonuna tıklamanız gerekir
- Kaydet butonu, workflow'un tüm bilgilerini (ad, açıklama, aktif/pasif durumu, nodes, edges) backend'e gönderir
- Workflow adı, açıklaması ve graph yapısı (nodes, edges) birlikte kaydedilir
- Aktif/pasif durumu ayrı olarak **"Aktifleştir/Pasifleştir"** butonu ile güncellenebilir

### Node Yönetimi
- Tüm node'lar kategorize edilmiştir ve NodePalette'de gruplar halinde gösterilir
- Node ayarları, her node tipine özel config schema'ya göre dinamik olarak oluşturulur
- Node değişiklikleri anlık olarak store'a kaydedilir
- Workflow kaydedildiğinde tüm node'lar ve bağlantılar backend'e gönderilir

### Backend Entegrasyonu
- Workflow'lar JSON formatında backend'e kaydedilir (graphJson)
- Backend snake_case formatı kullanır, frontend camelCase formatı kullanır
- Veri normalizasyonu otomatik olarak yapılır
- API hataları kullanıcıya gösterilir

### State Yönetimi
- Canvas ve store arasında iki yönlü senkronizasyon vardır
- Workflow adı ve açıklaması local state'te tutulur, kaydet butonuna tıklandığında backend'e gönderilir
- Nodes ve edges değişiklikleri anlık olarak store'a kaydedilir

### AI Asistanı
- AI asistanı şu anda simüle edilmiş yanıtlar üretmektedir (gerçek API entegrasyonu için güncellenebilir)

## 📄 Lisans

MIT

