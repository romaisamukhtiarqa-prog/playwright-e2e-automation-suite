const http = require('http');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// 1. Real SQLite Database setup inside database-validation/greenleaf.db
const dbPath = path.join(__dirname, 'database-validation', 'greenleaf.db');
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    promo_code TEXT,
    discount REAL DEFAULT 0,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );
`);

// Seed initial user & order if empty
const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
if (userCount === 0) {
  db.prepare('INSERT INTO users (name, email, address) VALUES (?, ?, ?)').run(
    'Sarah Jenkins', 'sarah.j@example.com', '45 Maple Street, Lahore'
  );
  db.prepare('INSERT INTO orders (order_code, user_id, promo_code, discount, total, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    'ORD-1001', 1, 'WELCOME10', 1.45, 13.05, 'Confirmed', '2026-11-14 10:15:00'
  );
  db.prepare('INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price) VALUES (?, ?, ?, ?, ?)').run(
    1, 'p-apples', 'Organic Gala Apples', 3, 4.99
  );
}

const PRODUCTS = [
  { id: 'p-apples', name: 'Organic Gala Apples', category: 'Fruits', price: 4.99, stock: 50 },
  { id: 'p-milk', name: 'Farm Fresh Almond Milk', category: 'Dairy', price: 3.50, stock: 30 },
  { id: 'p-bread', name: 'Whole Grain Sourdough', category: 'Bakery', price: 5.25, stock: 20 }
];

const html = `<!DOCTYPE html>
<html>
<head><title>GreenLeaf Grocers</title></head>
<body style="font-family:Segoe UI,sans-serif;max-width:600px;margin:30px auto;">
  <h1>GreenLeaf Grocers — Storefront</h1>
  <div data-testid="catalog-section">
    <p>Organic Gala Apples — $4.99</p>
    <button data-testid="add-to-cart-btn-p-apples" onclick="document.getElementById('cart-count').innerText='1'">Add to Cart</button>
    <button data-testid="nav-cart" onclick="document.getElementById('cart-sec').style.display='block'">Cart (<span id="cart-count">0</span>)</button>
  </div>
  <div id="cart-sec" style="display:none;margin-top:20px;">
    <h3>Your Cart: Organic Gala Apples ($4.99)</h3>
    <button data-testid="proceed-to-checkout-btn" onclick="document.getElementById('checkout-sec').style.display='block'">Proceed to Checkout</button>
  </div>
  <div id="checkout-sec" style="display:none;margin-top:20px;">
    <h3>Guest Checkout</h3>
    <input data-testid="checkout-name-input" id="name" placeholder="Full Name" /><br/><br/>
    <input data-testid="checkout-email-input" id="email" placeholder="Email" /><br/><br/>
    <input data-testid="checkout-address-input" id="addr" placeholder="Delivery Address" /><br/><br/>
    <button data-testid="checkout-submit-btn" onclick="submitOrder()">Submit Order</button>
  </div>
  <div data-testid="success-section" id="success-sec" style="display:none;margin-top:20px;padding:15px;background:#dcfce7;border-radius:8px;">
    <h3>Order Confirmed!</h3>
    <p>Order ID: <strong data-testid="success-order-id" id="oid"></strong></p>
  </div>
  <script>
    async function submitOrder() {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          address: document.getElementById('addr').value,
          product_id: 'p-apples',
          quantity: 1
        })
      });
      const data = await res.json();
      document.getElementById('oid').innerText = data.order_id;
      document.getElementById('success-sec').style.display = 'block';
    }
  </script>
</body>
</html>`;

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');

  // GET /api/products
  if (req.method === 'GET' && url.pathname === '/api/products') {
    const id = url.searchParams.get('id');
    if (id) {
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return sendJson(res, 404, { error: 'Product not found' });
      return sendJson(res, 200, { product });
    }
    return sendJson(res, 200, { count: PRODUCTS.length, products: PRODUCTS });
  }

  // POST /api/promos/validate
  if (req.method === 'POST' && url.pathname === '/api/promos/validate') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (!data.code || typeof data.code !== 'string') {
          return sendJson(res, 400, { valid: false, error: 'Promo code is required as a string' });
        }
        const code = data.code.trim().toUpperCase();
        if (code === 'EXPIRED20') {
          return sendJson(res, 400, { valid: false, code, error: 'Promo code EXPIRED20 has expired' });
        }
        if (code === 'WELCOME10') {
          return sendJson(res, 200, { valid: true, code, discount_percent: 10 });
        }
        return sendJson(res, 404, { valid: false, code, error: 'Promo code not found' });
      } catch {
        return sendJson(res, 400, { valid: false, error: 'Malformed JSON payload' });
      }
    });
    return;
  }

  // POST /api/orders
  if (req.method === 'POST' && url.pathname === '/api/orders') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const { name, email, address, product_id = 'p-apples', quantity = 1, promo_code = null, idempotency_key = null } = JSON.parse(body || '{}');
        if (!name || !email || !address) {
          return sendJson(res, 400, { error: 'Missing required fields: name, email, and address are required' });
        }
        if (typeof quantity !== 'number' || quantity < 1 || quantity > 50) {
          return sendJson(res, 400, { error: 'Quantity must be a number between 1 and 50' });
        }
        const product = PRODUCTS.find(p => p.id === product_id);
        if (!product) {
          return sendJson(res, 404, { error: 'Selected product does not exist' });
        }
        if (idempotency_key) {
          const existing = db.prepare('SELECT order_code FROM orders WHERE order_code = ?').get(idempotency_key);
          if (existing) {
            return sendJson(res, 409, { error: 'Duplicate order submission detected', order_id: existing.order_code });
          }
        }

        let user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (!user) {
          const info = db.prepare('INSERT INTO users (name, email, address) VALUES (?, ?, ?)').run(name, email, address);
          user = { id: Number(info.lastInsertRowid) };
        }

        const discount = promo_code === 'WELCOME10' ? Number((product.price * quantity * 0.10).toFixed(2)) : 0;
        const total = Number((product.price * quantity - discount).toFixed(2));
        const orderCode = idempotency_key || ('ORD-' + (1001 + db.prepare('SELECT COUNT(*) AS c FROM orders').get().c));
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

        const orderInfo = db.prepare(
          'INSERT INTO orders (order_code, user_id, promo_code, discount, total, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).run(orderCode, user.id, promo_code, discount, total, 'Confirmed', now);

        db.prepare(
          'INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price) VALUES (?, ?, ?, ?, ?)'
        ).run(Number(orderInfo.lastInsertRowid), product.id, product.name, quantity, product.price);

        return sendJson(res, 201, {
          order_id: orderCode,
          customer: email,
          product: product.name,
          quantity,
          discount,
          total,
          status: 'Confirmed'
        });
      } catch {
        return sendJson(res, 400, { error: 'Invalid JSON request body' });
      }
    });
    return;
  }

  // Storefront HTML
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}).listen(3000, () => console.log('GreenLeaf Storefront + SQLite API running on http://localhost:3000'));