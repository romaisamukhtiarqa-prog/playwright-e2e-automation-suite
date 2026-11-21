const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('database-validation/greenleaf.db');

console.log('=== 1. Order Verification (ORD-TEST-08) ===');
console.table(db.prepare("SELECT o.order_code, u.email, oi.quantity, o.promo_code, o.discount, o.total, o.status FROM orders o JOIN users u ON o.user_id=u.id JOIN order_items oi ON oi.order_id=o.id WHERE o.order_code='ORD-TEST-08'").all());

console.log('=== 2. Revenue & Discount Audit ===');
console.table(db.prepare("SELECT COUNT(*) AS total_orders, ROUND(SUM(total),2) AS total_revenue, ROUND(SUM(discount),2) AS total_discounts FROM orders").all());

console.log('=== 3. Orphan Records Check (Must be 0) ===');
console.table(db.prepare("SELECT o.id FROM orders o LEFT JOIN users u ON o.user_id=u.id WHERE u.id IS NULL").all());
