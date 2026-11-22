# GreenLeaf Grocers — Multi-Layer QA Automation, Performance & Backend Validation Portfolio

End-to-end Quality Assurance portfolio demonstrating **Page Object Model (POM)** UI automation, **Mobile Viewport Layout Testing**, **REST API Contract & Negative Testing**, **SQLite Relational Database Validation**, **Grafana k6 Performance & Load Testing**, and **GitHub Actions CI/CD**.

---

## Tech Stack & Tools
- **UI & API Automation:** Playwright (`@playwright/test`), JavaScript (Node.js)
- **Architecture:** Page Object Model (`Pages/CheckoutPage.js`)
- **Performance & Load Testing:** Grafana k6 (`v2.4.0` — 20 Virtual Users, `p(95)` SLA thresholds)
- **API Testing:** Postman Collection Runner (`12 requests`, `24/24 assertions passed`)
- **Database Validation:** SQLite (`node:sqlite`, relational `JOIN`, aggregate audit, and orphan record checks)
- **CI/CD & Traceability:** GitHub Actions (`.github/workflows/playwright.yml`), Jira Cloud, Zephyr Scale

---

## Project Structure
├── .github/workflows/
│   └── playwright.yml            # Automated CI pipeline running Playwright on push & PR
├── Api-testing/
│   ├── api_test_cases.md         # 12 Postman API scenarios (200, 201, 400, 404, 409 Conflict)
│   └── postman_collection_run.png
├── Database-validation/
│   ├── greenleaf.db              # Relational SQLite database (users, orders, order_items)
│   ├── queries.sql               # SQL JOIN, revenue audit & referential integrity queries
│   ├── run_queries.js            # Automated SQL audit runner
│   └── sqlite_validation.png
├── Pages/
│   └── CheckoutPage.js           # Page Object Model encapsulating checkout locators & mobile geometry checks
├── performance/
│   ├── load_test.js              # k6 3-stage load test (up to 20 VUs over 35s)
│   ├── performance_summary.md    # Executive p(95) latency & throughput report
│   └── k6_load_report.png        # Terminal execution proof (1,580 requests, 0.00% errors)
├── tests/
│   └── checkout.spec.js          # Multi-layer Playwright test suite (E2E + DB + Mobile + API)
├── app.js                        # Local GreenLeaf Grocers storefront, REST API & SQLite backend
└── playwright_pom_report.png     # 9/9 cross-browser Playwright execution report

---

## Test Coverage Summary
| Layer | Test ID / Suite | Coverage & Assertions | Status |
| :--- | :--- | :--- | :---: |
| **E2E UI + DB** | `TC-E2E-01` | Guest checkout happy path + direct SQLite `orders`/`users` persistence check | PASS |
| **Mobile UI** | `TC-MOB-02` | Mobile viewport (`390x844`) bounding-box collision check for checkout controls | PASS |
| **API Contract** | `TC-API-03` | `POST /api/promos/validate` (`WELCOME10` -> `200 OK`, `EXPIRED20` -> `400 Bad Request`) | PASS |
| **Postman Suite** | `TC-API-01` – `12` | Catalog lookup, boundary values (`quantity: 0`), type checks, and `409 Conflict` idempotency | PASS (`24/24`) |
| **SQLite Audit** | `queries.sql` | Relational `JOIN` accuracy, revenue/discount totals, and `0` orphan foreign-key records | PASS |
| **Performance / Load** | `k6` Load Suite | 20 concurrent VUs (`35s`), `1,580` requests (`44.81 req/s`), `p(95) = 1.15ms`, `0.00%` error rate | PASS |

---

## How to Run Locally
1. Install dependencies & Playwright browsers: `npm install && npx playwright install`
2. Start the GreenLeaf Grocers server (Terminal 1): `node app.js`
3. Execute the multi-layer Playwright test suite (Terminal 2): `npx playwright test tests/checkout.spec.js`
4. Run SQLite backend validation queries: `node Database-validation/run_queries.js`
5. Run Grafana k6 performance & load test (while `app.js` is running): `k6 run performance/load_test.js`
