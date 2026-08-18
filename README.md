# Ecommerce API — Secured

Backend REST API built with Node.js, Express, and Neon PostgreSQL, hardened
according to the *Web Security Fundamentals* training task (BATMAN TECHNOLOGY).

This version adds Authentication (JWT), Authorization (role-based),
Input Validation (Zod), SQL Injection prevention, password hashing (bcrypt),
Helmet security headers, restricted CORS, Rate Limiting, centralized error
handling, and safe security event logging on top of the original functional
API (products / categories / users).

---

## 1. Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```
   PORT=3000
   DATABASE_URL=<your Neon connection string>
   JWT_SECRET=<a long random string — never commit this>
   JWT_EXPIRES_IN=1h
   CORS_ORIGINS=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   LOGIN_RATE_LIMIT_WINDOW_MS=900000
   LOGIN_RATE_LIMIT_MAX=5
   NODE_ENV=development
   ```

   Generate a strong `JWT_SECRET` with:
   ```
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

3. Make sure your Neon database already has the schema from
   `01_create_tables.sql` and (optionally) sample data from
   `02_insert_sample_data.sql` applied.

4. Run the development server:
   ```
   npm run dev
   ```
   or in production mode:
   ```
   npm start
   ```

5. Server runs on http://localhost:3000

---

## 2. Authentication & Authorization

All write operations (and some read operations) now require a valid JWT
sent as `Authorization: Bearer <token>`.

Roles: `customer` (default on self-registration) and `admin`.

| Resource | Public | Customer | Admin |
|---|---|---|---|
| Browse products/categories | ✅ | ✅ | ✅ |
| Register / Login | ✅ | – | – |
| View own profile (`/me`, `/users/:id` own) | – | ✅ | ✅ |
| View any user (`/users`, `/users/:id` any) | – | ❌ | ✅ |
| Create/update products & categories | – | ❌ | ✅ |
| Change user role/status | – | ❌ | ✅ |

---

## 3. Endpoints

### Auth
- `POST /api/auth/register` — public, creates a `customer` account
- `POST /api/auth/login` — public, rate-limited (5 attempts / 15 min)
- `GET  /api/auth/me` — requires token

### Products
- `GET /api/products` — public
- `GET /api/products/:id` — public
- `POST /api/products` — admin only
- `PUT /api/products/:id` — admin only
- `PATCH /api/products/:id/deactivate` — admin only

### Categories
- `GET /api/categories` — public
- `GET /api/categories/:id` — public
- `POST /api/categories` — admin only
- `PUT /api/categories/:id` — admin only

### Users
- `GET /api/users` — admin only
- `GET /api/users/:id` — self or admin (IDOR protected)
- `POST /api/users` — admin only (creates a user with any role)
- `PATCH /api/users/:id/status` — admin only
- `PATCH /api/users/:id/role` — admin only

---

## 4. Security Measures Implemented

| Task | Implementation |
|---|---|
| Initial security review | `SECURITY_REVIEW.md` |
| Secrets management | `.env` (gitignored) + `.env.example` |
| Input validation | `zod` schemas in `src/validators/`, enforced via `validate()` middleware |
| SQL Injection prevention | 100% parameterized queries (`$1, $2, ...`) via `pg` |
| Password protection | `bcrypt` (12 salt rounds); `password`/`password_hash` never returned in any response |
| Authentication | JWT (`src/controllers/authController.js`, `src/middleware/authenticate.js`) |
| Authorization | Role-based `authorize()` middleware |
| IDOR prevention | Ownership check (`req.user.id` vs `:id`) in `usersController.getUserById` |
| Security headers | `helmet()` |
| CORS | Explicit allow-list via `CORS_ORIGINS` env var |
| Rate limiting | `express-rate-limit`: general + strict login limiter |
| Error handling | Centralized `errorHandler` + `notFound`; no stack traces / SQL / file paths ever sent to the client |
| XSS mitigation | Product description length-capped, stored as plain data; frontend must output-encode it (documented, not executed server-side) |
| Safe logging | `src/utils/securityLogger.js` logs only non-sensitive identifiers (never passwords/hashes/tokens/DATABASE_URL) |

---

## 5. Testing

All endpoints were tested with both `curl` (manual verification against a live
database) and an automated Postman collection run via `newman`.

- Postman collection: `Ecommerce API.postman_collection.json` (41 requests / 46 assertions)
- Automated HTML test report: `postman/results/test-report.html`
- Full write-up with before/after evidence: `Web_Security_Testing_Report.md`

Run the collection yourself:
```
npx newman run "Ecommerce API.postman_collection.json"
```

---

## 6. Notes

- Registration always creates `customer` accounts. Promoting a user to
  `admin` must be done by an existing admin via `PATCH /api/users/:id/role`.
- `orders` and `payments` tables exist in the schema but are not yet exposed
  via API routes in this iteration; the same auth/authorization/IDOR
  patterns established here should be reused when those routes are added.
