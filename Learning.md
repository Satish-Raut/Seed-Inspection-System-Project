# 🧠 Seed Inspection - Learning & Revision Notes

This file serves as a central hub for new concepts, technical reminders, and architectural decisions made during the backend development phase. Use this for quick revision and to understand the "Why" behind the "How".

---

## 🛡️ Authentication Concepts

### 1. 🔑 Bcrypt Password Hashing
Storing plain-text passwords in a database is a major security risk. We use **Bcrypt** because:
*   **Salting**: It adds a random string (the salt) to the password before hashing, preventing "Rainbow Table" attacks.
*   **Cost Factor**: It is a "slow" hashing algorithm. If a hacker tries to "Brute Force" it, the delay makes it impractical.
*   **Key Function**: `bcryptjs.hash(password, 10)` — the `10` is the "cost factor" or salt rounds.

### 2. 🎟️ JWT (JSON Web Tokens)
JWT allows for **Stateless Authentication**. This means the server doesn't need to save session data in a database; all the info is inside the token.
*   **Structure**: `Header.Payload.Signature`
*   **Stored**: Usually in the frontend's `localStorage` (as we did in our `useAuth` hook).
*   **Injected**: Every API request will now include this token in the `Authorization` header (`Bearer <token>`).

---

## 🗄️ Database & ORM (Drizzle)

### 1. 🔗 Drizzle Query Patterns
*   **Insert**: `db.insert(table).values({ field: 'value' })`
*   **Select with Filter**: `db.select().from(table).where(eq(table.id, 1))` — Note that `eq()` must be imported from `drizzle-orm`.
*   **Cascading**: We added `{ onDelete: 'cascade' }` to our foreign keys so that deleting an inspection cleans up all its related logs automatically.

### 2. ⚡ Environment Variables (`.env`)
Never hardcode sensitive data like database passwords or JWT secrets.
*   **Security**: Keeps secrets out of GitHub.
*   **Flexibility**: Allows different settings for "Local" vs "Production" without changing the code.

---

## 🏗️ Backend Design Patterns

### 1. 📂 Modular Architecture
We separate logic into distinct layers:
*   **Routes**: Defines the URL endpoints.
*   **Controllers**: Contains the "Business Logic" (what actually happens).
*   **Middleware**: Intercepts requests (e.g., "Is this user logged in?").
*   **Utils**: Reusable helper functions (e.g., "Generate a token").

### 2. ✅ Input Validation (Zod)
Instead of manually checking `if (!email)`, we use **Zod** to define a schema.
*   **Benefit**: Automatically returns clean error messages to the frontend if the user sends invalid data (e.g., a too-short password).

---

## 🌉 Frontend Synchronization

### 1. 🍪 Axios `withCredentials`
Since our **Refresh Token** is now an `httpOnly` cookie, browsers will block it from being sent to our API by default.
*   **Fix**: We added `withCredentials: true` to the global Axios instance. This tells the browser: "It's okay to bring the cookies along for the ride."

### 2. 🔄 Silent Refresh Interceptor
This is the "Magic" that keeps your session alive.
*   **The Logic**: If an API call fails with a **401 Unauthorized** error (meaning your Access Token expired), the interceptor catches it *before* it breaks the app.
*   **The Action**: It automatically calls `/api/auth/refresh`, gets a new token, updates `localStorage`, and retries the original failed request. 
*   **Result**: The user never sees a login screen unless they are inactive for many days.

---

> [!TIP]
> **Revision Tip:** Before starting any new controller, quickly look at the `Drizzle Query Patterns` section above to remind yourself of the syntax.
