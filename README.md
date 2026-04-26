# 🇮🇳 BHARAT ResourceOS

**AI-powered fiscal intelligence platform for transparent, equitable, and data-driven government resource allocation across India.**

![Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange) ![Cloud Run](https://img.shields.io/badge/Deployed-Cloud%20Run-blue)

## 🚀 Live Demo

**[https://bharat-resource-os-m6ub34k7iq-el.a.run.app](https://bharat-resource-os-m6ub34k7iq-el.a.run.app)**

## 📋 Overview

BHARAT ResourceOS is a comprehensive government fiscal management dashboard that provides:

- **Command Center Dashboard** — Real-time budget tracking with allocation vs utilization trends
- **Data Upload** — Bulk CSV/Excel ingestion for fiscal data
- **AI Allocation Engine** — Gemini-powered budget optimization recommendations
- **3D GeoView** — Interactive geographic visualization of resource distribution
- **Analytics** — Deep-dive charts, sector comparisons, and state performance metrics
- **Anomaly Detection** — AI forensic scanner for overspending, duplicates, and suspicious patterns
- **Approvals Workflow** — Multi-tier approval pipeline with audit trails
- **Reports** — Automated report generation and export
- **Transparency Portal** — Public-facing dashboard for citizen access

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | CSS3 with custom design system |
| **Charts** | Recharts |
| **3D/Maps** | Three.js, React Three Fiber |
| **State** | Zustand |
| **Auth** | Firebase Authentication (Google + Email/Password) |
| **Database** | Cloud Firestore |
| **AI** | Google Gemini 2.0 Flash |
| **Deployment** | Google Cloud Run (asia-south1) |

## 🏗️ Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Auth and Firestore enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/nithishkumar-ui/BHARAT-RESOURCE-OS.git
cd BHARAT-RESOURCE-OS

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your Firebase credentials

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/         # Sidebar, Header
│   └── dashboard/      # Dashboard widgets & cards
├── pages/              # Route pages (Dashboard, Analytics, etc.)
├── store/              # Zustand state management
├── lib/                # Firebase config & Firestore services
├── data/               # Mock data & constants
└── App.tsx             # Router & layout
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Deploy to Cloud Run
gcloud run deploy bharat-resource-os \
  --source ./dist \
  --region asia-south1 \
  --allow-unauthenticated
```

## 📄 License

MIT License — Built for India 🇮🇳
