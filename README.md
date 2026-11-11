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
  <img src="https://img.shields.io/badge/Version-1.0.2-blue" alt="Version 1.0.2" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/Flutter-Android_APK-02569B?logo=flutter&logoColor=white" alt="Flutter Android" />
  <img src="https://img.shields.io/badge/Languages-English%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80%20%7C%20%D8%A7%D8%B1%D8%AF%D9%88-success" alt="Multi-language" />
  <img src="https://img.shields.io/badge/Cloudflare_Workers-Static_Assets-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
</p>

---

## ✨ Features

- **⏱️ Daily Prayer Timings**: Live clock, active period status, next prayer countdown, day navigation with date picker, and Friday Jumu'ah timing for Fajr, Sunrise, Zuhr, Asr, Maghrib, and Isha.
- **🚫 Forbidden / Makruh & Nafl Indicators**: Real-time warnings during sunrise (Tulu), solar noon (Zawal), and sunset (Ghurub), plus Ishraq / Chasht start guidance.
- **📍 Village & Taluka Offset Support**: Instant minute adjustments (-2 to +2 min) for 15 towns and villages across Osmanabad district.
- **🌙 Dual Gregorian & Hijri Calendar**: Hijri calendar powered by local moon-sighting month starts with `islamic-umalqura` fallback.
- **📅 Monthly Timetable (Table, Poster & PDFs)**: Village-adjusted monthly table (with today auto-scroll and leap-year Feb 29 support), language-specific poster images with pinch/wheel zoom viewer, and downloadable PDFs.
- **🎨 7 Built-in Themes**: 3 light themes (Classic Blue, Emerald Green, Desert Gold) and 4 dark themes (Midnight Dark, Emerald Dark, Desert Gold Dark, Classic Maroon Dark) persisted locally.
- **🌐 Trilingual & Native RTL**: Full support for English, Hindi (हिन्दी), and Urdu (اردو) with RTL layout and LTR-isolated time formatting.
- **📶 Offline First (PWA) & Web Update Check**: Service worker caches core assets and timetable posters for offline use, with manual update checking in Settings via `version.json`.
- **📱 Android APK & OTA Updates**: Flutter WebView wrapper serving bundled web assets over a fixed-port local HTTP server (`127.0.0.1:48753`) to preserve `localStorage`, plus automatic and manual in-app APK updates via GitHub Releases.

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
| **Bhum** | بھوم | भूम | **+2 min** |
| **Paranda** | پرنڈا | परंडा | **+2 min** |

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **Icons & Styling**: [Lucide React](https://lucide.dev/), custom CSS with CSS variables (`data-theme` theming)
- **PWA**: Service Worker (`public/sw.js`) & Web App Manifest (`public/manifest.json`)
- **Mobile Wrapper**: [Flutter](https://flutter.dev/) (`webview_flutter`, `ota_update`, `package_info_plus`, `http`)
- **Hosting / Edge**: [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) Static Assets via [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

---

## 📂 Project Structure

```text
├── flutter_app/          # Flutter Android wrapper (local WebView server & OTA updater)
│   ├── lib/              # main.dart (HTTP server + JS bridge), updater.dart (OTA updates)
│   ├── test/             # Widget & updater unit tests
│   └── pubspec.yaml      # Flutter dependencies & app version (1.0.2+3)
├── public/
│   ├── icons/            # App icons (192px, 512px, maskable, apple-touch)
│   ├── timetable/        # Monthly timetable posters (en, hi, ur) & PDF files
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service worker for offline caching
├── src/
│   ├── components/       # UI components (PrayerCard, Calendar, Images, Settings)
│   ├── data/             # Prayer schedules, Hijri month starts, village offsets, translations, config
│   ├── pages/            # Home dashboard
│   ├── utils/            # Time calculations, periods, Hijri date logic, settings & i18n
│   ├── App.jsx           # App root, tab navigation & language picker
│   ├── index.css         # Themes & responsive styling
│   └── main.jsx          # Entry point & PWA service worker registration
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML entry template
├── package.json          # NPM scripts & dependencies
├── Salah-Timing.md       # Product requirement document & architecture specs
├── version.json          # Shared release metadata for Web & Android OTA update checks
├── vite.config.js        # Vite configuration
└── wrangler.jsonc        # Cloudflare Workers static assets configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.19+ or v22.13+)
- [npm](https://www.npmjs.com/) (v9 or higher)
- *(Optional for APK)* [Flutter SDK](https://docs.flutter.dev/get-started/install) & Android Studio

### Installation

```bash
# Clone the repository
git clone https://github.com/Akai-Abd/Osmanabad-Salah-Time.git
cd Osmanabad-Salah-Time

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
| `npm run deploy` | Builds the app and deploys static assets to Cloudflare Workers |
| `npm run build:apk` | Syncs `dist/` to Flutter assets and builds a release Android APK |

---

## 📱 Android APK & Releases

To generate an offline-bundled Android APK:

```bash
npm run build:apk
```

The APK will be generated at:
`flutter_app/build/app/outputs/flutter-apk/app-release.apk`

Run Flutter tests with:

```bash
cd flutter_app && flutter test
```

Release metadata for both web and Android OTA updates is tracked in [`version.json`](version.json) and `flutter_app/pubspec.yaml`.

---
[MIT License](LICENSE).
