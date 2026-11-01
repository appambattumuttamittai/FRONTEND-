# Frontend — Build & Dev Notes

This is the Next.js 14 (App Router) frontend for Appambattu Mutta Mittai.

## Key files
- `src/app/page.tsx` — Home page (all sections assembled)
- `src/app/order/page.tsx` — Multi-step order checkout (Name → OTP → Quantity → Pickup → Payment)
- `src/app/order/success/page.tsx` — Order confirmation page
- `src/app/adminPanel/page.tsx` — Admin dashboard (login-gated, NOT linked publicly)
- `src/components/` — All reusable UI components
- `src/context/LanguageContext.tsx` — English/Tamil i18n + cookie persistence
- `src/lib/api.ts` — Type-safe API client

## Environment Variables
Copy `.env.example` → `.env.local` and fill in values for local dev.

## Deployment
Deploy to Vercel. See `../docs/DEPLOYMENT.md`.
