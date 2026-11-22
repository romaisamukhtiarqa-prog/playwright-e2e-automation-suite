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
```text
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
