const { test, expect } = require('@playwright/test');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { DatabaseSync } = require('node:sqlite');

test.describe('GreenLeaf Grocers — POM E2E, Mobile & API Suite', () => {
  test('TC-E2E-01: Guest checkout happy path persists order in SQLite DB', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const guestEmail = `pom.guest.${Date.now()}@example.test`;

    await checkoutPage.gotoCheckoutWithApple();
    await checkoutPage.fillCustomerDetails({
      name: 'Romaisa QA',
      email: guestEmail,
      address: '45 Model Town, Lahore',
    });
    await checkoutPage.submitOrder();

    await expect(checkoutPage.confirmationBanner).toBeVisible();

    const db = new DatabaseSync('database-validation/greenleaf.db');
    const row = db
      .prepare('SELECT o.order_code, o.status, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email = ?')
      .get(guestEmail);

    expect(row).toBeTruthy();
    expect(row.status).toBe('Confirmed');
  });

  test('TC-MOB-02: Mobile viewport (390x844) renders checkout controls without overlap', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.gotoCheckoutWithApple();
    const isLayoutClean = await checkoutPage.checkMobileLayoutClean();

    expect(isLayoutClean).toBe(true);
  });

  test('TC-API-03: Promo validation API returns 200 for WELCOME10 and 400 for EXPIRED20', async ({ request }) => {
    const validRes = await request.post('http://localhost:3000/api/promos/validate', {
      data: { code: 'WELCOME10' },
    });
    expect(validRes.status()).toBe(200);
    const validBody = await validRes.json();
    expect(validBody.valid).toBe(true);
    expect(validBody.discount_percent ?? validBody.discount ?? validBody.percent).toBe(10);

    const expiredRes = await request.post('http://localhost:3000/api/promos/validate', {
      data: { code: 'EXPIRED20' },
    });
    expect(expiredRes.status()).toBe(400);
    const expiredBody = await expiredRes.json();
    expect(expiredBody.valid).toBe(false);
  });
});