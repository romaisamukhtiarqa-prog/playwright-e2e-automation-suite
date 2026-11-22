# GreenLeaf Grocers — k6 Performance & Load Test Report

- **Tool:** Grafana k6 (`v2.4.0`)
- **Target Endpoints:** `GET /api/products` & `POST /api/promos/validate`
- **Load Profile:** 3-stage ramp-up to **20 Virtual Users (VUs)** over `35s` (`790` iterations / `1,580` requests)
- **SLA Thresholds:** `p(95) < 500ms` | `http_req_failed < 1.00%`

## Execution Metrics
| Metric | Measured Value | Threshold | Status |
| :--- | :---: | :---: | :---: |
| **Total HTTP Requests** | `1,580` (`44.81 req/s`) | — | PASS |
| **p(95) Response Latency** | `1.15 ms` | `< 500 ms` | PASS |
| **Average Response Time** | `0.57 ms` | — | PASS |
| **HTTP Error Rate** | `0.00%` (`0 / 1,580`) | `< 1.00%` | PASS |
| **Functional Check Pass Rate** | `100.00%` (`1,580 / 1,580`) | `100%` | PASS |

## Engineering Notes
Executed locally against the Node.js + SQLite backend (`localhost:3000`) to establish a zero-network-latency baseline and verify API stability under concurrent load.
