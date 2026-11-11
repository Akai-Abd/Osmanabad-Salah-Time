<p align="center">
  <img src="public/icons/icon-192.png" alt="Osmanabad Salah Time Icon" width="128" height="128" style="border-radius: 24px;" />
</p>

<h1 align="center">Osmanabad Salah Time</h1>

<p align="center">
  <strong>مواقيت الصلاة لعثمان آباد | उस्मानाबाद नमाज़ का समय | Osmanabad District Prayer Times</strong>
</p>

<p align="center">
  A lightweight, offline-first Progressive Web App (PWA) and Android APK providing accurate daily Islamic prayer times, prohibited prayer intervals, Hijri calendar tracking, and monthly timetable cards for Osmanabad District.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/Flutter-Android_APK-02569B?logo=flutter&logoColor=white" alt="Flutter Android" />
  <img src="https://img.shields.io/badge/Languages-English%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80%20%7C%20%D8%A7%D8%B1%D8%AF%D9%88-success" alt="Multi-language" />
  <img src="https://img.shields.io/badge/Cloudflare_Pages-Deployment-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Pages" />
</p>

---

## ✨ Features

- **⏱️ Accurate Daily Prayer Timings**: Live clock, next prayer countdown, and start times for Fajr, Dhuhr, Asr, Maghrib, and Isha calculated specifically for Osmanabad.
- **🚫 Forbidden / Makruh Prayer Indicators**: Real-time warnings and countdowns during sunrise (Tulu), solar noon (Zawal), and sunset (Ghurub).
- **📍 Village & Taluka Offset Support**: Instant minute adjustments (-2 to +2 min) for 15 towns and villages across Osmanabad district.
- **🌙 Dual Gregorian & Hijri Calendar**: Seamless Hijri month calculations with local moon-sighting alignments and Umalqura astronomical fallback.
- **📅 Monthly Timetable Cards & PDFs**: Full high-resolution timetable images per language with pinch-to-zoom modal viewer and downloadable print-ready PDFs.
- **🌐 Trilingual & Native RTL**: Full support for English, Hindi (हिन्दी), and Urdu (اردو) with right-to-left layout adjustments.
- **📶 Offline First (PWA)**: Built-in service worker caches core assets and timetable images for 100% offline access.
- **📱 Android APK Packaging**: Ready-to-build Flutter WebView wrapper bundling the app as a native standalone Android APK.

---

## 📍 Covered Localities & Village Offsets

Timings adapt automatically based on verified district offsets from Osmanabad city:

| Village / Town | Urdu | Hindi | Offset |
| :--- | :--- | :--- | :--- |
| **Osmanabad (City)** | عثمان آباد | उस्मानाबाद | **0 min** |
| **Umarga** | عمرگا | उमरगा | **-2 min** |
| **Dalimb** | ڈالمب | डालिंब | **-2 min** |
| **Murum** | مروم | मुरूम | **-2 min** |
| **Naldurg** | نلدرگ | नलदुर्ग | **-1 min** |
| **Itkal** | اٹکل | इटकल | **-1 min** |
| **Masla** | مسلہ | मसला | **-1 min** |
| **Karjkheda** | کرجکھیڑا | करजखेडा | **-1 min** |
| **Lohara** | لوہارہ | लोहारा | **-1 min** |
| **Shiradhon** | شیراڈھون | शिराढोण | **+1 min** |
| **Kalamb** | کلمب | कलंब | **+1 min** |
| **Terkheda** | ترکھیڑا | तेरखेडा | **+1 min** |
| **Washi** | واشی | वाशी | **+1 min** |
| **Bhoom** | بھوم | भूम | **+2 min** |
| **Paranda** | پرنڈا | परंडा | **+2 min** |

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **Icons & UI**: [Lucide React](https://lucide.dev/), Tailwind-like CSS utilities
- **PWA**: Service Worker (`sw.js`) & Web App Manifest
- **Mobile Wrapper**: [Flutter](https://flutter.dev/) (`webview_flutter`)
- **Hosting / Edge**: [Cloudflare Pages](https://pages.cloudflare.com/) via [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

---

## 📂 Project Structure

```text
├── flutter_app/          # Flutter Android project (local WebView shell)
├── public/
│   ├── icons/            # App icons (192px, 512px, maskable, apple-touch)
│   ├── timetable/        # Monthly timetable cards (en, hi, ur) & PDF files
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service worker for offline caching
├── src/
│   ├── components/       # UI components (PrayerCard, Calendar, Images, Settings)
│   ├── data/             # Prayer schedules, village offsets, translations
│   ├── pages/            # Home dashboard
│   ├── utils/            # Time calculations, Hijri date logic, storage helpers
│   ├── App.jsx           # App root & language context provider
│   ├── index.css         # Styling & responsive design system
│   └── main.jsx          # Entry point & PWA registration
├── Salah-Timing.md       # Product requirement document & architecture specs
└── package.json          # NPM scripts & dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- *(Optional for APK)* [Flutter SDK](https://docs.flutter.dev/get-started/install) & Android Studio

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/osmanabad-salah-time.git
cd osmanabad-salah-time

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open the displayed URL (usually `http://localhost:5173`) in your browser.

---

## 📦 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR |
| `npm run build` | Compiles and bundles production web assets into `dist/` |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs ESLint checks |
| `npm run deploy` | Builds the app and publishes it to Cloudflare Pages |
| `npm run build:apk` | Syncs `dist/` to Flutter assets and builds a release Android APK |

---

## 📱 Building the Android APK

To generate an offline-bundled Android APK:

```bash
npm run build:apk
```

The APK will be generated at:
`flutter_app/build/app/outputs/flutter-apk/app-release.apk`

---


This project is licensed under the [MIT License](LICENSE).
