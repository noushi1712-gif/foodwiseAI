# FoodWise AI - Predict Less. Waste Less. Feed More.

FoodWise AI is an institutional food waste reduction system powered by Google Gemini AI and PostgreSQL. It replaces kitchen guesswork with predictive demand forecasting, consumption reconciliation, waste analytics, and surplus redistribution logistics.

## Architecture Overview

```
codeHER/
├── backend/

│   ├── config/
│   │   └── db.js            # PostgreSQL connection pool (pg)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── predictionController.js
│   │   ├── consumptionController.js
│   │   ├── analyticsController.js
│   │   └── surplusController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js # JWT verification & user_id extraction
│   │   └── validate.js       # Zod schema validation middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── predictionRoutes.js
│   │   ├── consumptionRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── surplusRoutes.js
│   ├── services/
│   │   └── geminiService.js  # Server-side @google/genai SDK integration
│   ├── schema.sql            # Production PostgreSQL schema & seed data
│   ├── package.json
│   └── server.js             # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── components/       # MetricCard, PredictionForm, AIRecommendationCard, etc.
│   │   ├── pages/            # Login, Register, Dashboard, Predict, History, Analytics, Surplus
│   │   ├── services/         # Axios API client with JWT interceptor
│   │   ├── App.jsx           # React Router DOM configuration
│   │   ├── main.jsx
│   │   └── index.css         # Tailwind & custom design tokens
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── .env.example
```

## Quick Start (Phase 1 Setup)

1. Copy `.env.example` to `backend/.env` and `frontend/.env`.
2. Run database migration in Supabase SQL editor using `backend/schema.sql`.
3. Install dependencies in backend and frontend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
