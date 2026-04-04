# 🌾 Seed Inspection System
## Full Stack Project Plan (React + Node + Express + MySQL)

> ⚠️ This is no longer a "MERN" stack. MongoDB has been replaced with MySQL + Drizzle ORM.

---

## 📌 Project Overview

A **mobile-first, fullstack web application** for field quality assurance of agricultural seeds.
Field inspectors use this app to:
- Log in with their Inspector ID and Password
- Select the crop type and production method
- Register field details (farmer info, GPS location)
- Walk through stage-by-stage growth inspections (Vegetative → Flowering → Pre-Harvest)
- Generate a final inspection report with a pass/fail verdict
- Export the report as a PDF and submit it to the authority

---

## 🎯 App Type
**Progressive Web App (PWA)** — Mobile-first, installable on Android/iOS from the browser.
This is a **field tool**, not a marketing website.

---

## 🛠️ Tech Stack

### Frontend — React (Vite) + Tailwind CSS
| Tool | Purpose |
|------|---------|
| **React 18 + Vite** | Core frontend framework |
| **React Router v6** | SPA page routing |
| **Tailwind CSS v4** | Utility-first styling — mobile-first layout |
| **Framer Motion** | Page transitions & micro-animations |
| **React Hook Form** | Form state management (inspection forms) |
| **Axios** | API requests to the backend |
| **Lucide React** | Clean, consistent icon library |
| **react-leaflet** | GPS map (drop pin or draw field boundary) |
| **jsPDF + html2canvas** | Export inspection report as PDF |
| **Vite PWA Plugin** | Service worker for installable PWA |

> 💡 **Why Tailwind v4?** It integrates directly with Vite via `@tailwindcss/vite` — no PostCSS or `tailwind.config.js` file needed. Cleaner setup.

### Backend — Node.js + Express + TypeScript
| Tool | Purpose |
|------|---------|
| **Node.js + Express** | REST API server |
| **TypeScript** | Type safety — essential for Drizzle ORM to work properly |
| **Drizzle ORM** | SQL-first ORM with type-safe queries |
| **MySQL2** | MySQL database driver |
| **drizzle-kit** | Migration generation and management |
| **JWT + bcryptjs** | Authentication — Inspector login |
| **Multer + Cloudinary** | Upload field photos (plant images) |
| **Nodemailer** | Email report to authority on submission |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin requests from frontend |
| **zod** | Input validation/sanitization (TypeScript-native) |

> 💡 **Why TypeScript for the server?** Drizzle ORM's biggest strength is type-safe SQL queries and autocomplete — this only works with TypeScript. Without it, you lose ~80% of the benefit.

> 💡 **Why MySQL over MongoDB?** Your data is naturally relational: one inspector → many inspections → many stages → one report. Relational tables handle this much better than documents.

### Dev Tools
| Tool | Purpose |
|------|---------|
| **ts-node-dev** | Auto-restart TS backend on changes (replaces Nodemon) |
| **Concurrently** | Run frontend + backend simultaneously from root |
| **ESLint + Prettier** | Code quality & formatting |
| **Postman / Thunder Client** | Test API endpoints |
| **TablePlus / DBeaver** | MySQL GUI — view your database visually |

---

## 📁 Folder Structure

```
Seed Inspection Project/
│
├── client/                          # React Frontend (Vite + Tailwind)
│   ├── public/
│   │   ├── favicon.ico
│   │   └── manifest.json            # PWA manifest
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/              # Crop icons, logos
│   │   │
│   │   ├── components/              # Reusable UI Components
│   │   │   ├── Navbar.jsx           # Top green header bar
│   │   │   ├── BottomNav.jsx        # Home, Inspection, Reports, Settings
│   │   │   ├── StatCard.jsx         # Pending/Completed/Rejected cards
│   │   │   ├── CropCard.jsx         # Crop type selection card
│   │   │   ├── StageCard.jsx        # Inspection stage row item
│   │   │   ├── ToggleSwitch.jsx     # iOS-style toggle for disease checks
│   │   │   ├── RangeSlider.jsx      # Custom green slider (uniformity %)
│   │   │   ├── FieldMap.jsx         # react-leaflet map component
│   │   │   ├── ProtectedRoute.jsx   # Redirect to login if not authenticated
│   │   │   └── Loader.jsx           # Spinner / loading state
│   │   │
│   │   ├── pages/                   # Route-level screens
│   │   │   ├── Login.jsx            # Inspector ID + Password login
│   │   │   ├── Register.jsx         # New inspector registration
│   │   │   ├── Dashboard.jsx        # Stats + Start/Resume/Reports buttons
│   │   │   ├── SelectCrop.jsx       # 2x grid of 5 crop type cards
│   │   │   ├── ProductionType.jsx   # Hybrid (4 stages) / Non-Hybrid (3)
│   │   │   ├── FieldRegistration.jsx # Farmer info + GPS pin/boundary
│   │   │   ├── InspectionStages.jsx # Stage list with status badges
│   │   │   ├── InspectionForm.jsx   # Per-stage form (sliders, toggles)
│   │   │   ├── FinalReport.jsx      # Verdict + PDF export + submit button
│   │   │   ├── Reports.jsx          # History of all inspections
│   │   │   └── Settings.jsx         # Profile, logout, preferences
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # JWT token + inspector user state
│   │   │   └── InspectionContext.jsx # Current multi-step inspection state
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # login/logout/register logic
│   │   │   ├── useInspection.js     # Current inspection flow helpers
│   │   │   └── useGeolocation.js    # Capture GPS coordinates hook
│   │   │
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + all API call functions
│   │   │
│   │   ├── utils/
│   │   │   ├── generatePDF.js       # jsPDF report generation logic
│   │   │   └── constants.js         # Crop types, stage names, disease lists
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── routes.jsx
│   │   └── index.css                # Tailwind base import + custom CSS vars
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Express Backend (TypeScript)
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts             # Drizzle + mysql2 connection setup
│   │   │   ├── schema.ts            # ALL table definitions (Drizzle schema)
│   │   │   └── migrations/          # Auto-generated by drizzle-kit
│   │   │
│   │   ├── config/
│   │   │   └── cloudinary.ts        # Cloudinary SDK setup
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts      # register, login, getMe
│   │   │   ├── inspection.controller.ts # CRUD for inspections
│   │   │   ├── stage.controller.ts     # Stage form submit/update
│   │   │   ├── report.controller.ts    # Generate & fetch reports
│   │   │   └── upload.controller.ts    # Cloudinary image uploads
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # JWT token verification
│   │   │   ├── upload.middleware.ts  # Multer config for file uploads
│   │   │   └── error.middleware.ts   # Global error handler
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── inspection.routes.ts
│   │   │   ├── stage.routes.ts
│   │   │   ├── report.routes.ts
│   │   │   └── upload.routes.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── generateToken.ts     # JWT sign + verify helpers
│   │   │   ├── generateInspectorId.ts # Auto-generate INS-2026-001 format
│   │   │   └── sendEmail.ts         # Nodemailer — report submission email
│   │   │
│   │   └── server.ts                # App entry point
│   │
│   ├── drizzle.config.ts            # Drizzle Kit configuration
│   ├── tsconfig.json                # TypeScript config
│   ├── .env                         # Environment variables (never commit)
│   └── package.json
│
├── .gitignore
├── README.md
└── ProjectPlan.md                   # This file
```

---

## 🖥️ Screens / Pages (Based on Figma)

| Screen | Route | Description |
|--------|-------|-------------|
| Login | `/login` | Inspector ID + Password |
| Register | `/register` | New inspector account creation |
| Dashboard | `/dashboard` | Stats (Pending/Completed/Rejected) + Actions |
| Select Crop | `/inspection/crop` | 2-column grid of 5 crop types |
| Production Type | `/inspection/production` | Hybrid (4 stages) vs Non-Hybrid (3 stages) |
| Field Registration | `/inspection/field` | Farmer info + GPS map pin |
| Inspection Stages | `/inspection/stages` | Stage checklist with status badges |
| Inspection Form | `/inspection/stage/:stageId` | Per-stage form — sliders, toggles, photos |
| Final Report | `/inspection/report` | Verdict + PDF export + submit to authority |
| Reports List | `/reports` | History of all completed inspections |
| Settings | `/settings` | Profile info, logout |

---

## 🗄️ Database Schema (MySQL + Drizzle ORM)

> All schemas are defined in a single file: `server/src/db/schema.ts`

### `inspectors` table
```ts
export const inspectors = mysqlTable('inspectors', {
  id:           int('id').autoincrement().primaryKey(),
  inspectorId:  varchar('inspector_id', { length: 20 }).notNull().unique(), // "INS-2026-001"
  name:         varchar('name', { length: 100 }).notNull(),
  email:        varchar('email', { length: 100 }).notNull().unique(),
  password:     varchar('password', { length: 255 }).notNull(),  // bcrypt hashed
  phone:        varchar('phone', { length: 15 }),
  designation:  varchar('designation', { length: 100 }),
  region:       varchar('region', { length: 100 }),
  role:         mysqlEnum('role', ['inspector', 'admin']).default('inspector'), // 🔮 future admin panel
  createdAt:    timestamp('created_at').defaultNow(),
})
```

### `inspections` table
```ts
export const inspections = mysqlTable('inspections', {
  id:             int('id').autoincrement().primaryKey(),
  inspectorId:    int('inspector_id').references(() => inspectors.id),
  cropType:       mysqlEnum('crop_type', ['Wheat', 'Rice', 'Maize', 'Sorghum', 'Sunflower']).notNull(),
  productionType: mysqlEnum('production_type', ['Hybrid', 'Non-Hybrid']).notNull(),
  totalStages:    int('total_stages').notNull(),  // 4 = Hybrid, 3 = Non-Hybrid
  status:         mysqlEnum('status', ['In Progress', 'Completed', 'Rejected']).default('In Progress'),
  createdAt:      timestamp('created_at').defaultNow(),
  updatedAt:      timestamp('updated_at').onUpdateNow(),
})
```

### `field_registrations` table
```ts
export const fieldRegistrations = mysqlTable('field_registrations', {
  id:            int('id').autoincrement().primaryKey(),
  inspectionId:  int('inspection_id').references(() => inspections.id),
  farmerName:    varchar('farmer_name', { length: 100 }),
  farmerContact: varchar('farmer_contact', { length: 15 }),
  fieldLocation: varchar('field_location', { length: 255 }),
  latitude:      decimal('latitude', { precision: 10, scale: 8 }),   // GPS pin
  longitude:     decimal('longitude', { precision: 11, scale: 8 }),  // GPS pin
  fieldBoundary: json('field_boundary'),   // Array of [lng, lat] — polygon (optional)
  documentUrl:   varchar('document_url', { length: 500 }),  // Cloudinary URL
})
```

### `stage_data` table
```ts
export const stageData = mysqlTable('stage_data', {
  id:                   int('id').autoincrement().primaryKey(),
  inspectionId:         int('inspection_id').references(() => inspections.id),
  stageNumber:          int('stage_number').notNull(),       // 1, 2, 3 (or 4 for Hybrid)
  stageName:            varchar('stage_name', { length: 100 }),
  status:               mysqlEnum('status', ['Not Started', 'In Progress', 'Completed']).default('Not Started'),
  uniformityPercentage: decimal('uniformity_percentage', { precision: 5, scale: 2 }),
  maturityUniformity:   decimal('maturity_uniformity', { precision: 5, scale: 2 }),
  moistureEstimation:   decimal('moisture_estimation', { precision: 5, scale: 2 }), // manual entry
  offTypePercentage:    decimal('off_type_percentage', { precision: 5, scale: 2 }),  // manual, AI-ready later
  diseases:             json('diseases'),         // { rust: bool, smut: bool, blight: bool }
  additionalChecks:     json('additional_checks'),// { harvestEquipmentCleaned, yieldEstimation, etc }
  notes:                text('notes'),
  completedAt:          timestamp('completed_at'),
})
```

### `stage_photos` table
```ts
export const stagePhotos = mysqlTable('stage_photos', {
  id:          int('id').autoincrement().primaryKey(),
  stageDataId: int('stage_data_id').references(() => stageData.id),
  photoUrl:    varchar('photo_url', { length: 500 }),  // Cloudinary URL
  uploadedAt:  timestamp('uploaded_at').defaultNow(),
})
```

### `reports` table
```ts
export const reports = mysqlTable('reports', {
  id:                    int('id').autoincrement().primaryKey(),
  inspectionId:          int('inspection_id').references(() => inspections.id),
  verdict:               mysqlEnum('verdict', ['Approved', 'Provisional Approval', 'Rejected']),
  summaryNotes:          text('summary_notes'),
  pdfUrl:                varchar('pdf_url', { length: 500 }),  // Cloudinary PDF URL
  submittedToAuthority:  boolean('submitted_to_authority').default(false),
  submittedAt:           timestamp('submitted_at'),
  createdAt:             timestamp('created_at').defaultNow(),
})
```

### Relationships Diagram
```
inspectors
    │
    └──< inspections (inspector_id → inspectors.id)
              │
              ├──  field_registrations (inspection_id → inspections.id)  [1:1]
              │
              └──< stage_data (inspection_id → inspections.id)           [1:many]
              │         │
              │         └──< stage_photos (stage_data_id → stage_data.id)
              │
              └──  reports (inspection_id → inspections.id)              [1:1]
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new inspector (auto-generates Inspector ID) |
| POST | `/api/auth/login` | ❌ | Login → returns JWT token |
| GET | `/api/auth/me` | ✅ | Get currently logged-in inspector |

### Inspections
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/inspections` | ✅ | Create new inspection |
| GET | `/api/inspections` | ✅ | Get all inspections for logged-in inspector |
| GET | `/api/inspections/:id` | ✅ | Get single inspection with all stages |
| PATCH | `/api/inspections/:id` | ✅ | Update inspection status |
| DELETE | `/api/inspections/:id` | ✅ | Delete inspection |

### Field Registration
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/inspections/:id/field` | ✅ | Save field registration data |
| GET | `/api/inspections/:id/field` | ✅ | Get field registration for an inspection |

### Stages
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/inspections/:id/stages` | ✅ | Submit a stage's form data |
| GET | `/api/inspections/:id/stages` | ✅ | Get all stages for an inspection |
| PATCH | `/api/inspections/:id/stages/:stageId` | ✅ | Update a stage |

### Reports
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reports` | ✅ | Generate final inspection report |
| GET | `/api/reports` | ✅ | Get all reports for the logged-in inspector |
| GET | `/api/reports/:id` | ✅ | Get single report detail |
| POST | `/api/reports/:id/submit` | ✅ | Submit report to authority (sends email) |

### Uploads
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload/image` | ✅ | Upload field/plant photo → Cloudinary |
| POST | `/api/upload/document` | ✅ | Upload farmer document → Cloudinary |

---

## 🎨 Design System (Based on Figma)

### Tailwind Custom Colors (`index.css`)
```css
@import "tailwindcss";

@theme {
  /* Primary Green */
  --color-primary:       #0B8D3F;
  --color-primary-dark:  #076B30;
  --color-primary-light: #E8F5EE;

  /* Status */
  --color-pending:       #FF9800;
  --color-pending-bg:    #FFF3E0;
  --color-success:       #4CAF50;
  --color-success-bg:    #E8F5E9;
  --color-danger:        #F44336;
  --color-danger-bg:     #FFEBEE;
  --color-info:          #2F6BFF;

  /* Surfaces */
  --color-bg:            #F5F5F5;
  --color-surface:       #FFFFFF;
  --color-border:        #E0E0E0;

  /* Text */
  --color-text-primary:   #1A1A1A;
  --color-text-secondary: #6B7280;
  --color-text-muted:     #9CA3AF;
}
```

> 💡 In Tailwind v4, custom colors defined in `@theme {}` become usable as `bg-primary`, `text-danger`, `border-pending`, etc. — no config file needed.

### Typography
- **Font:** `Inter` from Google Fonts (add to `index.html`)
- **Headings:** `font-bold text-2xl text-text-primary`
- **Labels:** `text-sm font-medium text-text-secondary`
- **Muted:** `text-xs text-text-muted`

### Key UI Component Classes (Tailwind)
```
Header Bar:      bg-primary text-white px-4 py-3 flex items-center justify-between
Bottom Nav:      fixed bottom-0 w-full bg-white border-t border-border flex justify-around py-2
Primary Button:  w-full bg-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2
Secondary Button:w-full border border-primary text-primary font-semibold py-3 rounded-xl
Stat Card:       bg-pending-bg rounded-xl p-4 flex flex-col items-center
Crop Card:       bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm border border-border
Stage Card:      bg-white rounded-xl p-4 flex items-center justify-between shadow-sm
```

---

## 🗺️ User Flow & Navigation

```
/login  (or /register for new accounts)
  └── /dashboard
        ├── Start New Inspection
        │     ├── /inspection/crop        → Select Crop Type
        │     ├── /inspection/production  → Hybrid or Non-Hybrid
        │     ├── /inspection/field       → Farmer Info + GPS
        │     ├── /inspection/stages      → Stage Checklist
        │     │     ├── /inspection/stage/1  → Stage Form
        │     │     ├── /inspection/stage/2  → Stage Form
        │     │     ├── /inspection/stage/3  → Stage Form
        │     │     └── /inspection/stage/4  → (Hybrid only)
        │     └── /inspection/report      → Verdict + PDF + Submit
        │
        ├── Resume Inspection  → /inspection/stages (last active)
        └── View Reports       → /reports → /reports/:id
```

---

## 📋 Inspection Form Fields (Per Stage)

### Stage 1: Vegetative / Pre-Flowering
- Plant Stand Uniformity (Range Slider 0–100%)
- Off-Type Plants count (Number input)
- Off-Type Percentage (Manual % input — AI-ready field)
- Disease checks: Rust, Smut, Blight (Toggle switches)
- General observations (Textarea)
- Photo upload (up to 3 photos)

### Stage 2: Flowering
- Anthesis Uniformity (Range Slider %)
- Pollen Shed Observation (Toggle)
- Cross-Pollination Risk (Toggle)
- Off-Type count + Percentage (Number)
- Disease checks (Toggles)
- Notes + Photos

### Stage 3: Post-Flowering / Pre-Harvest
- Maturity Uniformity (Range Slider %)
- Moisture Estimation — Manual entry in % (sensor reading)
- Maturity Verdict — Inspector's judgment (Suitable / Not Suitable toggle)
- Harvest Equipment Cleaned (Toggle)
- Separate Threshing Advised (Toggle)
- Yield Estimation in kg/hectare (Number input)
- Notes + Photos

### Stage 4 (Hybrid only): Final Seed Check
- Seed Quality Visual Assessment (Textarea)
- Inert Matter % (Number input)
- Germination Estimate % (Number input)
- Sample Photo upload
- Final Notes

---

## 🚀 Development Phases

### Phase 1 — Project Setup & Foundation
- [ ] Create folder structure (`/client`, `/server`) in project root
- [ ] Initialize Vite + React in `/client`
- [ ] Initialize Node + TypeScript Express in `/server`
- [ ] Set up MySQL database (local)
- [ ] Configure Drizzle ORM (`schema.ts` + `drizzle.config.ts`)
- [ ] Run first Drizzle migration (create all tables)
- [ ] Set up Tailwind CSS v4 in client
- [ ] Build `Navbar` + `BottomNav` components
- [ ] Set up React Router with all routes in `routes.jsx`

### Phase 2 — Authentication
- [ ] Backend: `inspectors` schema + `auth.controller.ts`
- [ ] Backend: `POST /auth/register` — hash password + auto-generate Inspector ID
- [ ] Backend: `POST /auth/login` — verify password + return JWT
- [ ] Backend: `GET /auth/me` — protected route
- [ ] Backend: JWT middleware (`auth.middleware.ts`)
- [ ] Frontend: Login page UI (Figma match)
- [ ] Frontend: Register page UI
- [ ] Frontend: `AuthContext` — store JWT + inspector info
- [ ] Frontend: `ProtectedRoute` component
> 🔮 Future: Add `admin` role to `inspectors.role` field → build Admin Panel as separate `/admin` routes

### Phase 3 — Dashboard
- [ ] Backend: Stats endpoint (count pending/completed/rejected for logged-in inspector)
- [ ] Frontend: Dashboard page — `StatCard` components + action buttons

### Phase 4 — Inspection Flow (Frontend)
- [ ] Select Crop page
- [ ] Production Type page
- [ ] Field Registration page (form + Leaflet GPS pin)
- [ ] Inspection Stages list page
- [ ] Inspection Form page (sliders, toggles, photo upload per stage)
- [ ] `InspectionContext` — hold all multi-step state across pages

### Phase 5 — Inspection Flow (Backend)
- [ ] `inspections` + `field_registrations` + `stage_data` + `stage_photos` routes & controllers
- [ ] Cloudinary integration (image uploads)
- [ ] GPS coordinates stored in `field_registrations`

### Phase 6 — Reports
- [ ] Final Report page (verdict, summary, PDF preview)
- [ ] PDF generation (`jsPDF + html2canvas`)
- [ ] Backend: `reports` routes & controller
- [ ] Report submission — Nodemailer (send report PDF to authority email)
- [ ] Reports list + detail pages (`/reports`)

### Phase 7 — Polish & PWA
- [ ] Framer Motion page transitions
- [ ] Full mobile responsiveness check on all pages
- [ ] Settings page (profile info, logout)
- [ ] Vite PWA plugin (`manifest.json` + service worker)
- [ ] Error boundaries + loading skeletons

### Phase 8 — Deployment
- [ ] Frontend → **Vercel**
- [ ] Backend → **Railway** (supports both Node.js + MySQL in one place)
- [ ] MySQL → **Railway MySQL** or **PlanetScale** (serverless MySQL)
- [ ] Cloudinary → Media storage
- [ ] Set environment variables on hosting dashboards

---

## ⚙️ Environment Variables

### Server `.env`
```env
PORT=5000
DATABASE_URL=mysql://root:password@localhost:3306/seed_inspection

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
AUTHORITY_EMAIL=authority@seedboard.gov.in

CLIENT_URL=http://localhost:5173
```

### Client `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Package Installation Commands

### Client (React + Vite + Tailwind)
```bash
npm create vite@latest client -- --template react
cd client
npm install react-router-dom axios framer-motion react-hook-form lucide-react react-leaflet jspdf html2canvas vite-plugin-pwa
npm install tailwindcss @tailwindcss/vite
```

**`vite.config.js`** — add Tailwind plugin:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**`src/index.css`** — only one line needed:
```css
@import "tailwindcss";
```

### Server (Express + TypeScript + Drizzle)
```bash
mkdir server && cd server
npm init -y
npm install express drizzle-orm mysql2 bcryptjs jsonwebtoken dotenv cors multer cloudinary nodemailer zod
npm install --save-dev typescript ts-node-dev @types/express @types/node @types/bcryptjs @types/jsonwebtoken @types/cors @types/multer @types/nodemailer drizzle-kit
```

**`drizzle.config.ts`:**
```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

**Migration commands:**
```bash
npx drizzle-kit generate   # generate migration files from schema
npx drizzle-kit migrate    # apply migrations to the database
npx drizzle-kit studio     # open Drizzle Studio (GUI to view DB in browser)
```

### Root (run both together)
```bash
# In root /Seed Inspection Project/
npm init -y
npm install concurrently --save-dev
```

**Root `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix client\" \"npm run dev --prefix server\""
  }
}
```

---

## ✅ Decisions Made

| # | Question | Decision |
|---|----------|----------|
| 1 | Biometric Auth | ❌ Removed — Login is Inspector ID + Password only |
| 2 | AI Detection % | ❌ No AI for now — `offTypePercentage` is manual entry, column is AI-ready |
| 3 | Inspector Accounts | ✅ Self-registration, auto-generated Inspector ID. Future: admin role |
| 4 | Frontend Styling | ✅ Tailwind CSS v4 |
| 5 | Database | ✅ MySQL + Drizzle ORM (TypeScript backend) |
| 6 | Stack Name | ✅ Full Stack JS (React + Node + Express + MySQL) — not "MERN" anymore |

## ❓ Still To Decide (When Ready)

7. **GPS field boundary** — Draw polygon on map, or just drop a single pin?
8. **Report submission email** — Fixed authority email in `.env`, or configurable per inspector?
9. **Offline support** — Full offline PWA with sync, or internet always available?
10. **Disease list per crop** — Same diseases for all crops, or different per crop type?
11. **Language** — English only, or Hindi + regional language support?
12. **TypeScript for frontend?** — Keep React in JS, or switch to TSX too?

---

## 🗓️ 4-Day Fast-Track Strategy (Vanilla JS Backend)

This outlines the exact step-by-step workflow to complete the backend within the tight 4-6 day deadline using pure JavaScript instead of TypeScript.

**Phase 1: Backend Setup**
- Initialize the Node.js project.
- Configure `package.json` for ES modules and nodemon.
- Install all necessary dependencies (`express`, `mysql2`, `drizzle-orm`, auth packages, etc).
- Create basic folder structure (`src/controllers`, `src/routes`, `src/db`).

**Phase 2: Verification**
- Create `server.js`.
- Add basic Express configuration and a `/api/health` testing endpoint.
- Verify the server starts correctly on the local port.

**Phase 3: DB Setup with Drizzle & Schema (Local Mode)**
- Define MySQL tables using JavaScript in `src/db/schema.js`.
- Create a database connection pool inside `src/db/index.js` reading local `.env` values.
- Make the `drizzle.config.js` file.
- Run `npm run db:generate` and `npm run db:migrate` to push tables to the local MySQL server.
- Verify tables exist using Drizzle Studio.

**Phase 4: Authentication & Authorisation**
- Build the register and login controllers.
- Generate inspector IDs automatically.
- Issue JWT tokens upon successful login.
- Create an `auth.middleware.js` to protect future routes.

**Phase 5: Core Inspection Endpoints (CRUD)**
- Create routes to start a new inspection.
- Build endpoints to save and retrieve multi-page "Field Registration" data.
- Build endpoints to save and retrieve data for "Inspection Stages" (1, 2, 3, 4).

**Phase 6: Image Uploads**
- Set up `multer` middleware to intercept binary files.
- Send the intercepted files directly to Cloudinary.
- Store the returned image URLs in the `stage_photos` database table.

**Phase 7: Reports and Emailing**
- Build the final endpoint to fetch all data for a complete inspection.
- Set up NodeMailer to send emails directly to the authority when a report is completed.

**✅ Your Backend Part is Complete!**

**Phase 8: Production Deployment Preparation**
- **Database Deployment**: Pick a free/cloud MySQL provider (like Aiven or Railway). Create the cloud database and swap your local `DATABASE_URL` for the cloud URL in your `.env`. Run your Drizzle migrations once more to push the schema to the cloud.
- **Backend Deployment**: Push your Node server to a hosting service (Render or Railway). Add all environment variables (like your new cloud DB URL and Cloudinary secrets) to their deployment dashboard.
- **Frontend Deployment**: Change your React app's `VITE_API_URL` to point to your shiny new deployed backend URL. Deploy the Vite React app to Vercel or Netlify.

---

*Last Updated: March 2026 | Revised Stack: React + Node.js + Express + MySQL + Drizzle ORM (Vanilla JS)*
