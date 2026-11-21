# GreenLeaf Grocers — Postman API Test Execution Summary

- **Environment:** `GreenLeaf-Local` (`http://localhost:3000`)
- **Total Requests Executed:** 12 (`TC-API-01` to `TC-API-12`)
- **Total Assertions Executed:** 24 (`24/24 Passed`, `0 Failed`)
- **Evidence Screenshot:** `postman_collection_run.png`

| Test ID | Method & Endpoint | Scenario | Expected Status | Actual Status | Result |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `TC-API-01` | `GET /api/products` | Retrieve full product catalog | `200 OK` | `200 OK` | PASS |
| `TC-API-02` | `GET /api/products?id=p-apples` | Retrieve single valid product | `200 OK` | `200 OK` | PASS |
| `TC-API-03` | `GET /api/products?id=p-unknown-999` | Non-existent product lookup | `404 Not Found` | `404 Not Found` | PASS |
| `TC-API-04` | `POST /api/promos/validate` | Valid promo code (`WELCOME10`) | `200 OK` | `200 OK` | PASS |
| `TC-API-05` | `POST /api/promos/validate` | Expired promo code (`EXPIRED20`) | `400 Bad Request` | `400 Bad Request` | PASS |
| `TC-API-06` | `POST /api/promos/validate` | Non-existent promo code (`FAKE99`) | `404 Not Found` | `404 Not Found` | PASS |
| `TC-API-07` | `POST /api/promos/validate` | Missing promo code field (`{}`) | `400 Bad Request` | `400 Bad Request` | PASS |
| `TC-API-08` | `POST /api/orders` | Valid guest checkout order with `WELCOME10` | `201 Created` | `201 Created` | PASS |
| `TC-API-09` | `POST /api/orders` | Missing required `email` field | `400 Bad Request` | `400 Bad Request` | PASS |
| `TC-API-10` | `POST /api/orders` | Boundary value test (`quantity: 0`) | `400 Bad Request` | `400 Bad Request` | PASS |
| `TC-API-11` | `POST /api/orders` | Invalid data type (`quantity: "five"`) | `400 Bad Request` | `400 Bad Request` | PASS |
| `TC-API-12` | `POST /api/orders` | Duplicate order submission (`ORD-TEST-08`) | `409 Conflict` | `409 Conflict` | PASS |