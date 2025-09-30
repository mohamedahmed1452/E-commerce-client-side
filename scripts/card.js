document.addEventListener("DOMContentLoaded", function () {
  main();
  loadCart();
});

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification("removed successfully", false);
  loadCart();
}

function loadCart() {
  const cartEmpty = document.getElementById("cart-empty");
  const cartContent = document.getElementById("cart-content");

  if (cart.length === 0) {
    cartEmpty.style.display = "block";
    cartContent.style.display = "none";
  } else {
    cartEmpty.style.display = "none";
    cartContent.style.display = "block";

    let products = JSON.parse(localStorage.getItem("allProducts"));
    renderCartItems(cart, products);
    updateCartTotals(cart, products);
  }
}

function renderCartItems(cart, products) {
  const container = document.getElementById("cart-items-container");
  if (!container) return;

  container.innerHTML = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return "";

      return `
      <div class="cart-item">
        <img src="${product.image}" alt="${
        product.title
      }" class="cart-item-image">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${product.title}</h3>
          <div class="cart-item-actions">
            <div class="cart-item-price">$${(
              product.price * item.quantity
            ).toFixed(2)}</div>
            <div class="quantity-control">
              <button class="quantity-btn" onclick="changeQuantity(${
                product.id
              }, -1)">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" onclick="changeQuantity(${
                product.id
              }, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${product.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function changeQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity < 1) {
    removeFromCart(productId);
    return;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  loadCart();
}

function updateCartTotals(cart, products) {
  const cartSubtotal = document.getElementById("cart-subtotal");
  const cartTotal = document.getElementById("cart-total");

  if (!cartSubtotal || !cartTotal) return;

  let subtotal = 0;
  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) subtotal += product.price * item.quantity;
  });

  const shipping = 5.0;
  const total = subtotal + shipping;

  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}
