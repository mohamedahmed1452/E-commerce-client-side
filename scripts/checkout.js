
document.addEventListener("DOMContentLoaded", function () {
  main();
  loadCheckout();

  document
    .getElementById("checkout-form")
    .addEventListener("submit", processOrder);
});





function loadCheckout() {
  const checkoutEmpty = document.getElementById("checkout-empty");
  const checkoutContent = document.getElementById("checkout-content");

  if (!checkoutEmpty || !checkoutContent) return;

  if (cart.length === 0) {
    checkoutEmpty.style.display = "block";
    checkoutContent.style.display = "none";
    return;
  }

  checkoutEmpty.style.display = "none";
  checkoutContent.style.display = "block";

  // Fetch all products and render checkout summary
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((products) => {
      renderCheckoutSummary(cart, products);
    })
    .catch((error) => {
      console.error("Error loading checkout:", error);
    });
}



function renderCheckoutSummary(cart, products) {
  const container = document.getElementById("checkout-summary");
  if (!container) return;

  let html = "";

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return;

    html += `
            <div class="summary-item">
                <span>${product.title} x${item.quantity}</span>
                <span>$${(product.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
  });

  // Calculate totals
  let subtotal = 0;
  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  const shipping = 5.0;
  const total = subtotal + shipping;

  html += `
        <div class="summary-item">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Shipping</span>
            <span>$${shipping.toFixed(2)}</span>
        </div>
        <div class="summary-item summary-total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;

  container.innerHTML = html;
}



function processOrder() {
  // Basic form validation
  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const email = document.getElementById("email");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const zipcode = document.getElementById("zipcode");

  if (!firstName || !lastName || !email || !address || !city || !zipcode) {
    showNotification("Please fill in all fields!", "error");
    return;
  }

  if (
    !firstName.value ||
    !lastName.value ||
    !email.value ||
    !address.value ||
    !city.value ||
    !zipcode.value
  ) {
    showNotification("Please fill in all fields!", "error");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    showNotification("Please enter a valid email address!", "error");
    return;
  }

  // Simulate order processing
  setTimeout(() => {
    // Clear the cart
    cart = [];
    localStorage.removeItem("cart");

    // Show success message
    document.getElementById("checkout-content").style.display = "none";
    document.getElementById("order-success").style.display = "block";

    // Update cart count
    updateCartCount();
  }, 1000);
}
