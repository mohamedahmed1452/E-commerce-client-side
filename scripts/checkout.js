document.addEventListener('DOMContentLoaded', function () {
  main();
  loadCheckout();

  let form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // stop page refresh
      processOrder();
    });
  }
});

function loadCheckout() {
  const checkoutEmpty = document.getElementById('checkout-empty');
  const checkoutContent = document.getElementById('checkout-content');

  if (cart.length === 0) {
    checkoutEmpty.style.display = 'block';
    checkoutContent.style.display = 'none';
  } else {
    checkoutEmpty.style.display = 'none';
    checkoutContent.style.display = 'block';
    renderCheckoutSummary(cart, allProducts);
  }
}

function renderCheckoutSummary(cart, products) {
  const container = document.getElementById('checkout-summary');
  let cartona = '';
  let subtotal = 0;

  for (let item of cart) {
    for (let product of products) {
      if (item.id == product.id) {
        subtotal += product.price * item.quantity;
        cartona += `<div class ="summary-item">
<span>${product.title} ===> ${item.quantity}</span>
<span>${product.price} X ${item.quantity}</span>
        </div>`;
      }
    }
  }

  let total = subtotal + 10.99;

  cartona += `
        <div class="summary-item">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Shipping</span>
            <span>$10.99</span>
        </div>
        <div class="summary-item summary-total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;

  container.innerHTML = cartona;
}

function processOrder() {
  localStorage.removeItem('cart');
  document.getElementById('checkout-content').style.display = 'none';
  document.getElementById('order-success').style.display = 'block';

  updateCartCount();
}
