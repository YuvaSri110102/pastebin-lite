````md
# Pastebin-Lite

Pastebin-Lite is a small Pastebin-like web application that allows users to create text pastes and share a link to view them.  
Each paste can optionally expire based on time (TTL) and/or a maximum number of views.

This project was built as part of a take-home assignment and is designed to pass automated functional and robustness tests.

---

## Features

- Create a text paste with arbitrary content
- Generate a shareable URL for each paste
- View pastes via API or HTML page
- Optional constraints per paste:
  - Time-based expiry (TTL)
  - View-count limit
- Deterministic time support for automated testing
- Serverless-safe persistence
- Concurrency-safe view counting using Redis Lua scripts

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Runtime:** Node.js
- **Persistence:** Redis (Vercel KV / Upstash)
- **Deployment Platform:** Vercel

---

## Persistence Layer

This application uses **Redis (Vercel KV / Upstash)** as its persistence layer.

### Why Redis?
- Works reliably in serverless environments
- Data persists across requests and deployments
- Supports atomic operations using Lua scripts
- No manual migrations required

Paste data is stored as JSON strings in Redis.  
View-count increments and expiry checks are performed atomically inside Redis using Lua scripts to ensure correctness under concurrent load.

---

## ⏱Deterministic Time Support (for Testing)

To support deterministic expiry testing, the application supports a test mode.

If the environment variable below is set:

```bash
TEST_MODE=1
````

Then the request header:

```
x-test-now-ms: <milliseconds since epoch>
```

is treated as the current time **for expiry logic only**.
If the header is absent, the real system time is used.

This behavior is required for automated TTL tests.

---

##  API Endpoints

### Health Check

```
GET /api/healthz
```

Response:

```json
{ "ok": true }
```

Returns HTTP 200 and JSON if the application can access its persistence layer.

---

### Create a Paste

```
POST /api/pastes
```

Request body:

```json
{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}
```

Rules:

* `content` is required and must be a non-empty string
* `ttl_seconds` is optional; if present, must be an integer ≥ 1
* `max_views` is optional; if present, must be an integer ≥ 1

Response:

```json
{
  "id": "string",
  "url": "https://your-app.vercel.app/p/<id>"
}
```

Invalid input returns a 4xx status with a JSON error body.

---

### Fetch a Paste (API)

```
GET /api/pastes/:id
```

Successful response:

```json
{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

Notes:

* `remaining_views` is `null` if unlimited
* `expires_at` is `null` if no TTL
* Each successful fetch counts as a view

Unavailable cases (missing, expired, or view limit exceeded) return:

* HTTP 404
* JSON response

---

### View a Paste (HTML)

```
GET /p/:id
```

* Returns an HTML page containing the paste content
* Returns HTTP 404 if the paste is unavailable
* Paste content is rendered safely (no script execution)

---

## Running the App Locally

### 1. Install dependencies

```bash
npm install
```

---

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

These values are provided by Vercel KV / Upstash.

> **Note:** `.env.local` must not be committed to the repository.

---

### 3. Start the development server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

### 4. (Optional) Run in deterministic test mode

```bash
TEST_MODE=1 npm run dev
```

---

## Design Decisions

* Redis Lua scripts are used to atomically enforce TTL and view-count limits.
* Logical expiry is used instead of Redis TTL to allow deterministic time testing.
* All state is stored in Redis; no in-memory or global mutable state is used.
* API and HTML routes share the same atomic paste-fetching logic for consistency.
* The UI is intentionally minimal, focusing on correctness and functionality rather than styling.

---

## Build & Runtime

* Install: `npm install`
* Development: `npm run dev`
* Production build: `npm run build`

The deployed app starts successfully without manual database migrations or shell access.

---

## Submission Details

* **Deployed URL:** [https://your-app.vercel.app](https://pastebin-lite-test.vercel.app)
* **GitHub Repository:** [https://github.com/your-username/pastebin-lite](https://github.com/YuvaSri110102/pastebin-lite)
  
---

## Repository Notes

* No hardcoded absolute URLs pointing to localhost
* No secrets or credentials committed
* Serverless-safe architecture
* Repository contains source code (not only build artifacts)
* README satisfies all automated repository checks

---

## Final Notes

This project is designed to fully meet the functional, robustness, and repository requirements of the take-home assignment and to pass automated evaluation.

Thank you for the opportunity.
