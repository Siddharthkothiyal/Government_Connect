# SchemeWise AI – Intelligent Government Benefits Discovery Platform

A responsive React + TypeScript + Tailwind frontend that helps rural and semi-urban citizens
discover government schemes they're eligible for, with AI-explained results in English and Hindi.

## Tech Stack
- React 18 + Vite + TypeScript
- Tailwind CSS (custom blue/green/white government theme)
- React Router v6
- Zustand (with localStorage persistence) for global state
- Axios for API calls (with mock-data fallback so the UI works without a backend)
- Lucide React icons, Framer Motion animations

## Getting Started
```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev
```

## Folder Structure
```
src/
  components/
    layout/       Navbar, Footer, Layout shell
    ui/           Button, Card, ProgressBar, LanguageToggle, DarkModeToggle
    scheme/       SchemeCard
    chat/         (reserved for chat-specific sub-components)
  pages/
    Landing.tsx        Hero, how-it-works, trust section
    UserInputForm.tsx  4-step eligibility wizard with validation
    Results.tsx        AI summary + eligible scheme cards
    SchemeDetail.tsx   Full scheme info, documents, steps, FAQ
    Chat.tsx           AI assistant chat (+ voice input)
    Profile.tsx        Profile, saved schemes, search history
    NotFound.tsx
  context/
    useAppStore.ts     Zustand store: profile, results, chat, history, language, dark mode
  services/
    api.ts             Axios client + mock fallbacks for all 4 backend endpoints
  types/index.ts        Shared TypeScript interfaces
  utils/i18n.ts          EN/HI translation dictionary + hook
  lib/utils.ts           cn() class merge helper
```

## Backend Endpoints Expected
- `POST /api/eligibility` → `{ schemes: Scheme[], aiSummaryEn, aiSummaryHi }`
- `POST /api/ai/explain` → `{ en: string, hi: string }`
- `GET  /api/schemes/:id` → `Scheme`
- `POST /api/chat` → `{ reply: string }`

If these endpoints are unreachable, the app automatically falls back to realistic mock data
(PM-KISAN, Ayushman Bharat, PM Awas Yojana) so the UI is always demoable.

## Implemented Features
- Multi-step wizard form with progress bar, validation, and localStorage persistence
- AI-style results page with bilingual summary, scheme cards, "why you're eligible" reasoning
- Scheme detail page: criteria, documents, application steps, FAQ accordion, official link
- Chat assistant with simple-language responses and Web Speech API voice input
- Profile page with saved schemes and search history
- EN/HI language toggle and dark mode toggle, both persisted
- Downloadable plain-text eligibility report (bonus)
- Fully responsive, mobile-first layout throughout

## Next Steps for Production
- Wire `VITE_API_BASE_URL` to a real backend and remove/keep mocks as fallback only
- Add proper auth (if needed) and replace localStorage-only profile with server-synced profile
- Add shadcn/ui primitives if a design system upgrade is wanted (current Button/Card are lightweight equivalents)
- Add PDF export (e.g. via jsPDF) instead of the current .txt report download
- Add automated tests (Vitest + React Testing Library)
