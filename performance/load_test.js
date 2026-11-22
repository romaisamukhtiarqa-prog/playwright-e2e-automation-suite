import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp up to 10 virtual users
    { duration: '20s', target: 20 }, // Hold steady load at 20 virtual users
    { duration: '5s', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must finish under 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% error rate
  },
};

export default function () {
  // 1. Catalog Read Load (GET)
  const catalogRes = http.get('http://localhost:3000/api/products');
  check(catalogRes, {
    'GET /api/products status is 200': (r) => r.status === 200,
  });

  // 2. Promo Validation Load (POST)
  const payload = JSON.stringify({ code: 'WELCOME10' });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const promoRes = http.post('http://localhost:3000/api/promos/validate', payload, params);
  check(promoRes, {
    'POST /api/promos/validate status is 200': (r) => r.status === 200,
  });

  sleep(0.5);
}
