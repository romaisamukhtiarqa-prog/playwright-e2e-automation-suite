-- Query 1: Verify API-created order (ORD-TEST-08) across users, orders, and order_items
SELECT
    o.order_code,
    u.name AS customer_name,
    u.email,
    oi.product_name,
    oi.quantity,
    o.promo_code,
    o.discount,
    o.total,
    o.status
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON oi.order_id = o.id
WHERE o.order_code = 'ORD-TEST-08';

-- Query 2: Aggregate Order & Revenue Audit
SELECT
    COUNT(*) AS total_orders,
    ROUND(SUM(total), 2) AS total_revenue,
    ROUND(SUM(discount), 2) AS total_discounts
FROM orders;

-- Query 3: Referential Integrity / Orphan Record Check (Must return 0 rows)
SELECT o.id AS orphan_order_id, o.order_code
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
WHERE u.id IS NULL;