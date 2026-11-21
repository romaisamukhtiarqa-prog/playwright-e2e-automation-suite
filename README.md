# GreenLeaf Grocers — Multi-Layer QA Automation & Backend Validation Portfolio

End-to-end Quality Assurance portfolio demonstrating **Page Object Model (POM)** UI automation, **Mobile Viewport Layout Testing**, **REST API Contract & Negative Testing**, **SQLite Relational Database Validation**, and **GitHub Actions CI/CD**.

---

## Tech Stack & Tools
- **UI & API Automation:** Playwright (`@playwright/test`), JavaScript (Node.js)
- **Architecture:** Page Object Model (`Pages/CheckoutPage.js`)
- **API Testing:** Postman Collection Runner (`12 requests`, `24/24 assertions passed`)
- **Database Validation:** SQLite (`node:sqlite`, relational `JOIN`, aggregate audit, and orphan record checks)
- **CI/CD & Traceability:** GitHub Actions (`.github/workflows/playwright.yml`), Jira Cloud, Zephyr Scale

---

## Test Coverage Summary
| Layer | Test ID / Suite | Coverage & Assertions | Status |
| :--- | :--- | :--- | :---: |
| **E2E UI + DB** | `TC-E2E-01` | Guest checkout happy path + direct SQLite `orders`/`users` persistence check | PASS |
| **Mobile UI** | `TC-MOB-02` | Mobile viewport (`390x844`) bounding-box collision check for checkout controls | PASS |
| **API Contract** | `TC-API-03` | `POST /api/promos/validate` (`WELCOME10` -> `200 OK`, `EXPIRED20` -> `400 Bad Request`) | PASS |
| **Postman Suite** | `TC-API-01` – `12` | Catalog lookup, boundary values (`quantity: 0`), type checks, and `409 Conflict` idempotency | PASS (`24/24`) |
| **SQLite Audit** | `queries.sql` | Relational `JOIN` accuracy, revenue/discount totals, and `0` orphan foreign-key records | PASS |

---

## How to Run Locally
```bash
# 1. Install dependencies & Playwright browsers
npm install
npx playwright install

# 2. Start the GreenLeaf Grocers server (Terminal 1)
node app.js

# 3. Execute the multi-layer Playwright test suite (Terminal 2)
npx playwright test tests/checkout.spec.js

# 4. Run SQLite backend validation queries
node Database-validation/run_queries.js