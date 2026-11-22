# GreenLeaf Grocers — Performance & Load Test Report (k6 + Apache JMeter)

## 1. Grafana k6 Load Test (`v2.4.0`)
- **Target Endpoints:** `GET /api/products` & `POST /api/promos/validate`
- **Load Profile:** 3-stage ramp-up to **20 Virtual Users (VUs)** over `35s` (`790` iterations / `1,580` requests)
- **SLA Thresholds:** `p(95) < 500ms` | `http_req_failed < 1.00%`

| Metric | Measured Value | Threshold | Status |
| :--- | :---: | :---: | :---: |
| **Total HTTP Requests** | `1,580` (`44.81 req/s`) | — | PASS |
| **p(95) Response Latency** | `1.15 ms` | `< 500 ms` | PASS |
| **Average Response Time** | `0.57 ms` | — | PASS |
| **HTTP Error Rate** | `0.00%` (`0 / 1,580`) | `< 1.00%` | PASS |
| **Functional Check Pass Rate** | `100.00%` (`1,580 / 1,580`) | `100%` | PASS |

## 2. Apache JMeter Load Test (`20 Threads × 25 Loops = 1,000 Samples`)
| Sampler / Endpoint | Samples | Average (ms) | Max (ms) | Error % | Throughput (req/s) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `GET /api/products` | `500` | `3.28 ms` | `72 ms` | `0.00%` | `472.0 / sec` | PASS |
| `POST /api/promos/validate` | `500` | `0.74 ms` | `9 ms` | `0.00%` | `229.0 / sec` | PASS |
| **TOTAL** | **`1,000`** | **`2.38 ms`** | **`72 ms`** | **`0.00%`** | **`350.5 / sec`** | **PASS** |
