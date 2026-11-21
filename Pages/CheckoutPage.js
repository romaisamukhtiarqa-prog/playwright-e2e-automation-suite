class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.catalogSection = page.getByTestId('catalog-section');
    this.addAppleBtn = page.getByTestId('add-to-cart-btn-p-apples');
    this.navCart = page.getByTestId('nav-cart');
    this.proceedCheckoutBtn = page.getByTestId('proceed-to-checkout-btn');

    this.nameInput = page.getByTestId('checkout-name-input');
    this.emailInput = page.getByTestId('checkout-email-input');
    this.addressInput = page.getByTestId('checkout-address-input');
    this.submitOrderButton = page.getByTestId('checkout-submit-btn');
    this.confirmationBanner = page.getByTestId('success-section');
  }

  async gotoCheckoutWithApple() {
    await this.page.goto('http://localhost:3000/');
    await this.addAppleBtn.click();
    await this.navCart.click();
    await this.proceedCheckoutBtn.click();
  }

  async fillCustomerDetails({ name, email, address }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.addressInput.fill(address);
  }

  async submitOrder() {
    await this.submitOrderButton.click();
  }

  async checkMobileLayoutClean() {
    const addressBox = await this.addressInput.boundingBox();
    const submitBox = await this.submitOrderButton.boundingBox();

    if (!addressBox || !submitBox) {
      throw new Error('Could not read checkout element bounding boxes');
    }

    const overlapsHorizontally =
      addressBox.x < submitBox.x + submitBox.width &&
      addressBox.x + addressBox.width > submitBox.x;

    const overlapsVertically =
      addressBox.y < submitBox.y + submitBox.height &&
      addressBox.y + addressBox.height > submitBox.y;

    return !(overlapsHorizontally && overlapsVertically);
  }
}

module.exports = { CheckoutPage };