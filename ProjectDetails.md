# 🌾 Seed Inspection System — Project Review

> Last reviewed: 2026-05-03 | Stack: React 19 + Vite + TailwindCSS v4 + Express 5 + Drizzle ORM + MySQL

---

## 📁 Project Structure Overview

```
Seed Inspection Project/
├── Client/          # React 19 + Vite + TailwindCSS v4 Frontend
└── Server/          # Express 5 + Drizzle ORM + MySQL Backend
```

---

## 🖥️ Frontend (Client)

### Tech Stack

| Tool              | Version    | Notes                                               |
|-------------------|------------|-----------------------------------------------------|
| React             | ^19.2.4    | Latest                                              |
| Vite              | ^8.0.1     | Build tool                                          |
| TailwindCSS       | ^4.2.2     | v4 (utility-first CSS)                              |
| React Router DOM  | ^7.13.2    | Client-side routing                                 |
| Axios             | ^1.14.0    | HTTP client with interceptors                       |
| React Hook Form   | ^7.72.0    | (available but NOT used — forms are manual useState)|
| React Leaflet     | ^5.0.0     | Map (available but NOT used yet)                    |
| Lucide React      | ^1.7.0     | Icons                                               |
| jsPDF + html2canvas | latest   | PDF report generation                               |
| Framer Motion     | ^12.38.0   | Animations (available, limited use)                 |

### Page & Route Map

| Route                                      | Component               | Status       |
|--------------------------------------------|-------------------------|--------------|
| `/`                                        | `LandingPage.jsx`       | ✅ Complete  |
| `/login`                                   | `Login.jsx`             | ✅ Complete  |
| `/register`                                | `Register.jsx`          | ✅ Complete  |
| `/dashboard`                               | `Dashboard.jsx`         | ✅ Complete  |
| `/profile`                                 | `Profile.jsx`           | ✅ Complete  |
| `/settings`                                | `Settings.jsx`          | ✅ Complete  |
| `/reports`                                 | `Reports.jsx`           | ✅ Complete  |
| `/inspection/:id/field`                    | `FieldRegistration.jsx` | ✅ Complete  |
| `/inspection/:id/crop`                     | `SelectCrop.jsx`        | ✅ Complete  |
| `/inspection/:id/production`               | `ProductionType.jsx`    | ✅ Complete  |
| `/inspection/:id/:crop/:type/stages`       | `StagesOverview.jsx`    | ✅ Complete  |
| `/inspection/:id/:crop/:type/stage/:n`     | `InspectionForm.jsx`    | ✅ Complete  |
| `/inspection/:id/:crop/:type/report`       | `Report.jsx`            | ✅ Complete  |

### Inspection Flow (User Journey)

```
Dashboard → Field Registration → Crop Selection → Production Type
         → Stages Overview → Stage 1...N (Forms) → Final Report → Reports Page
```

### Key Frontend Observations

**✅ Strengths:**
- `AuthContext` + `InspectionContext` cleanly separate auth and inspection concerns
- Dual-token auth (access + refresh) with **silent refresh interceptor** in `api.js` — solid implementation
- `localStorage` persistence of active inspection draft — good UX for field work
- Responsive design with mobile `BottomNav` and desktop `Navbar` in `AppLayout`
- Ownership verification at every API call level
- `startNewInspection()` immediately creates a DB shell — avoids orphan data

**⚠️ Issues / Gaps:**
1. **`react-hook-form` is installed but unused** — all forms use manual `useState` (inconsistency)
2. **`react-leaflet` is installed but unused** — GPS coordinates captured but no map rendered anywhere
3. **Stage `timestamp` vs `completedAt`**: `Reports.jsx` L210 uses `stage.timestamp` but the DB schema stores `completedAt`. This will render `Invalid Date` in the detail overlay.
4. **`stage.data` vs `stage.formData`**: `Reports.jsx` L217 reads `stage.data` but schema & backend store it as `formData`. Stage detail breakdown won't render.
5. **Hardcoded inspector info**: `Reports.jsx` L186 — `'Satish Raut'` and `'Lead Seed Auditor'` are hardcoded strings instead of using the `user` object.
6. **`seedProducer` field in `FieldRegistration.jsx`** (L92) is captured locally but the **`fieldRegistrationSchema` (server-side) and `fieldRegistrations` DB table have no `seedProducer` column** — it's silently dropped.
7. **`notes` field** in FieldRegistration is captured in local state but not in the server validation schema.
8. **No loading spinner** shown on Dashboard's `fetchInspections()` initial load — just silent loading.
9. **`InspectionForm.jsx`** dispatcher (`/pages/inspection/InspectionForm.jsx`) — needs review (very small at 1945 bytes, likely just a router/dispatcher to crop-specific forms).

---

## 🗄️ Backend (Server)

### Tech Stack

| Tool         | Version   | Notes                          |
|--------------|-----------|--------------------------------|
| Express      | ^5.2.1    | Latest v5                      |
| Drizzle ORM  | ^0.45.2   | MySQL ORM                      |
| MySQL2       | ^3.20.0   | DB driver                      |
| Argon2       | ^0.44.0   | Password hashing               |
| bcryptjs     | ^3.0.3    | Also present (redundant with Argon2) |
| JWT          | ^9.0.3    | Access + refresh tokens        |
| Cloudinary   | ^2.9.0    | Image uploads                  |
| Zod          | ^4.3.6    | Validation                     |
| cookie-parser| ^1.4.7    | httpOnly cookie management     |

### Database Schema (6 Tables)

```
inspectors          → users/auth table
inspections         → one per inspection session
field_registrations → one per inspection (farmer + field info)
stage_data          → multiple per inspection (one per stage)
stage_photos        → multiple per stage (photo uploads)
reports             → final certificate per inspection
```

**Relationships:**
- Inspector → Inspections (1:M)
- Inspection → FieldRegistration (1:1)
- Inspection → StageData (1:M)
- StageData → StagePhotos (1:M)
- Inspection → Report (1:1)

### API Endpoints

| Method | Route                                    | Controller              | Auth    |
|--------|------------------------------------------|-------------------------|---------|
| POST   | `/api/auth/register`                     | `auth.controller`       | Public  |
| POST   | `/api/auth/login`                        | `auth.controller`       | Public  |
| POST   | `/api/auth/refresh`                      | `auth.controller`       | Public  |
| POST   | `/api/auth/logout`                       | `auth.controller`       | Public  |
| GET    | `/api/auth/me`                           | `auth.controller`       | 🔒      |
| POST   | `/api/inspections`                       | `inspection.controller` | 🔒      |
| PUT    | `/api/inspections/:id`                   | `inspection.controller` | 🔒      |
| GET    | `/api/inspections`                       | `inspection.controller` | 🔒      |
| GET    | `/api/inspections/:id`                   | `inspection.controller` | 🔒      |
| POST   | `/api/inspections/:id/field`             | `inspection.controller` | 🔒      |
| POST   | `/api/inspections/:id/stages`            | `stage.controller`      | 🔒      |
| PATCH  | `/api/inspections/:id/stages/:stageId`   | `stage.controller`      | 🔒      |
| POST   | `/api/reports`                           | `report.controller`     | 🔒      |
| GET    | `/api/reports`                           | `report.controller`     | 🔒      |
| POST   | `/api/reports/:id/submit`                | `report.controller`     | 🔒      |

### Key Backend Observations

**✅ Strengths:**
- Clean MVC separation: Routes → Controllers → Models → Schema
- Drizzle relational queries are clean and typed
- Ownership verification (`inspectorId !== req.user.id`) done properly in every mutating endpoint
- Zod validation on all inputs with good error forwarding
- Dual-token auth with token rotation on refresh
- Cloudinary integration for Base64 → CDN URL conversion in field/stage uploads
- `upsertFieldRegistration` properly handles create-or-update logic

**⚠️ Issues / Gaps:**
1. **`bcryptjs` is a dead dependency** — Argon2 is used everywhere (`hash.js`). `bcryptjs` should be removed.
2. **`stage.routes.js` and `upload.routes.js`** are empty files (0 bytes). Stage routes are registered inside `inspection.routes.js` which is correct, but these empty files are confusing.
3. **`error.middleware.js` and `upload.middleware.js`** are empty (0 bytes) — not implemented yet.
4. **`generateToken.js`** exists alongside `generateTokens.js` — one appears to be an old/unused file.
5. **`sendEmail.js`** is an empty placeholder — `submitReportToAuthority` only does a `console.log` mock currently.
6. **`report.controller.js` `getAllReports`**: If inspector role, it filters by `inspectorId` — but `getAllReportsDb` does NOT include `stageData` in its query, only `fieldRegistration` and `inspector`. Stages would be missing in the reports list.
7. **`reports` table has no `fieldRegistrationsRelation`** — the `reportsRelations` is not defined in `schema.js`, which means `db.query.reports.findMany({ with: { inspection: true } })` works but `report.inspection.stageData` is not accessible unless you add `stageData` to the query.
8. **`query.js`** in the Server root seems to be an ad-hoc test/debug file — should be cleaned up or removed before production.
9. **No `DELETE` route for inspections** — once created, inspections cannot be deleted from the frontend.
10. **Inspection status `'Completed'`** is set when a report is created with non-Rejected verdict — but the `updateInspection` endpoint doesn't restrict updates to `Completed` inspections. An inspector could re-edit a finalized inspection's shell data.

---

## 🔐 Auth Flow Summary

```
Register/Login → accessToken (localStorage) + refreshToken (httpOnly cookie)
Request        → Bearer accessToken in Authorization header
401 error      → Silent refresh via /api/auth/refresh → new accessToken stored
Logout         → Cookie cleared + DB token nulled
```

---

## 📋 Empty / Stub Files

| File                                            | Status                      |
|-------------------------------------------------|-----------------------------|
| `Server/src/routes/stage.routes.js`             | Empty (0 bytes)             |
| `Server/src/routes/upload.routes.js`            | Empty (0 bytes)             |
| `Server/src/middleware/error.middleware.js`      | Empty (0 bytes)             |
| `Server/src/middleware/upload.middleware.js`     | Empty (0 bytes)             |
| `Server/src/utils/generateToken.js`             | Empty (possible duplicate)  |
| `Server/src/utils/sendEmail.js`                 | Empty (not implemented)     |

---

## 🐛 Known Bugs Summary

| # | Location              | Bug                                                                           |
|---|-----------------------|-------------------------------------------------------------------------------|
| 1 | `Reports.jsx:210`     | Uses `stage.timestamp` → should be `stage.completedAt`                        |
| 2 | `Reports.jsx:217`     | Uses `stage.data` → should be `stage.formData`                                |
| 3 | `Reports.jsx:186`     | Hardcoded `'Satish Raut'` instead of `user.name`                              |
| 4 | `FieldRegistration.jsx` | `seedProducer` + `notes` captured but not in DB schema — silently dropped   |
| 5 | `Server/package.json` | `bcryptjs` is unused dead dependency                                          |
| 6 | `report.controller.js`| `getAllReports` lacks `stageData` in query — stages not returned in report list|

---

## 🗺️ What's Complete vs Pending

### ✅ Fully Working
- Authentication (register, login, logout, token refresh)
- Inspection lifecycle (create shell → field → crop → production → stages → report)
- Dashboard with stats and recent inspections
- Stage data submission with Cloudinary image uploads
- PDF report generation via jsPDF (client-side)
- Reports list with detail overlay
- Mobile-responsive layout

### 🚧 Partially Working / Incomplete
- Report detail page (stage data doesn't render due to `stage.data` vs `stage.formData` bug)
- Email submission to authority (mock only)
- Map integration (`react-leaflet` installed but no map rendered)
- Error middleware (empty, unimplemented)

### ❌ Not Yet Built
- Admin dashboard/panel (schema has `role: admin` but no admin routes)
- Image gallery per stage (photos table exists but no UI to browse photos)
- Inspection deletion
- Pagination for inspections/reports list
- Real email notifications (`sendEmail.js` is empty)
