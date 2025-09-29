// Checkout page specific script
document.addEventListener("DOMContentLoaded", function () {
  loadCheckout();

  document
    .getElementById("checkout-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      processOrder();
    });
});
