// Global variables
let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Utility Functions
function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.left = "50%";
  notification.style.transform = "translateX(-50%)";
  notification.style.padding = "10px 20px";
  notification.style.borderRadius = "4px";
  notification.style.zIndex = "1000";
  notification.style.color = "white";
  notification.style.backgroundColor =
    type === "success" ? "#28a745" : "#dc3545";
  notification.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";

  // Add to page
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.5s";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

function updateFavoritesCount() {
  const favoritesCount = document.getElementById("favorites-count");
  if (favoritesCount) {
    favoritesCount.textContent = favorites.length;
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const themeToggle = document.querySelector(".theme-toggle");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggle) {
      const icon = themeToggle.querySelector("i");
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    }
  }

  // Add event listener to theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  const icon = document.querySelector(".theme-toggle i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    localStorage.setItem("theme", "light");
  }
}

// Product Functions
function renderProducts(products, containerId, isFavoritesPage = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<p class="empty-state">No products found.</p>';
    return;
  }

  container.innerHTML = products
    .map((product) => {
      const isFavorite = favorites.includes(product.id);

      return `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${
        product.title
      }" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">$${product.price}</div>
                    <span class="product-category">${product.category}</span>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart">Add to Cart</button>
                        <button class="btn btn-icon btn-favorite ${
                          isFavorite ? "active" : ""
                        }">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  // Add event listeners to the product buttons
  container.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(
        this.closest(".product-card").getAttribute("data-id")
      );
      addToCart(productId);
    });
  });

  container.querySelectorAll(".btn-favorite").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(
        this.closest(".product-card").getAttribute("data-id")
      );
      toggleFavorite(productId);
    });
  });
}

function toggleFavorite(productId) {
  if (favorites.includes(productId)) {
    favorites = favorites.filter((id) => id !== productId);
    showNotification("Removed from favorites!");
  } else {
    favorites.push(productId);
    showNotification("Added to favorites!");
  }

  // Save to localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Update UI
  updateFavoritesCount();

  // Update favorite buttons on product cards
  document.querySelectorAll(".product-card").forEach((card) => {
    const id = parseInt(card.getAttribute("data-id"));
    const favoriteBtn = card.querySelector(".btn-favorite");

    if (favorites.includes(id)) {
      favoriteBtn.classList.add("active");
    } else {
      favoriteBtn.classList.remove("active");
    }
  });

  // If we're on the favorites page, reload favorites
  if (window.location.pathname.endsWith("favorites.html")) {
    loadFavorites();
  }
}

// Cart Functions
function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1,
    });
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update UI
  updateCartCount();

  // Show notification
  showNotification("Product added to cart!");
}

function updateCartItemQuantity(productId, change, newQuantity = null) {
  const item = cart.find((item) => item.id === productId);

  if (!item) return;

  if (newQuantity !== null) {
    item.quantity = newQuantity;
  } else {
    item.quantity += change;
  }

  if (item.quantity < 1) {
    removeFromCart(productId);
    return;
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update UI
  updateCartCount();

  // If we're on the cart page, reload cart
  if (window.location.pathname.endsWith("cart.html")) {
    loadCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update UI
  updateCartCount();

  // If we're on the cart page, reload cart
  if (window.location.pathname.endsWith("cart.html")) {
    loadCart();
  }

  // Show notification
  showNotification("Product removed from cart!");
}

function loadCart() {
  const cartContainer = document.getElementById("cart-items-container");
  const cartEmpty = document.getElementById("cart-empty");
  const cartContent = document.getElementById("cart-content");

  if (!cartContainer || !cartEmpty || !cartContent) return;

  updateCartCount();

  if (cart.length === 0) {
    cartEmpty.style.display = "block";
    cartContent.style.display = "none";
    return;
  }

  cartEmpty.style.display = "none";
  cartContent.style.display = "block";

  // Fetch all products and render cart
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((products) => {
      renderCartItems(cart, products);
      updateCartTotals(cart, products);
    })
    .catch((error) => {
      console.error("Error loading cart:", error);
    });
}

function renderCartItems(cart, products) {
  const container = document.getElementById("cart-items-container");
  if (!container) return;

  container.innerHTML = "";

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
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
                        <button class="quantity-btn decrease" data-id="${
                          product.id
                        }">-</button>
                        <input type="number" class="quantity-input" value="${
                          item.quantity
                        }" min="1" data-id="${product.id}">
                        <button class="quantity-btn increase" data-id="${
                          product.id
                        }">+</button>
                    </div>
                    <button class="remove-btn" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

    container.appendChild(cartItem);
  });

  // Add event listeners
  container.querySelectorAll(".decrease").forEach((btn) => {
    btn.addEventListener("click", function () {
      updateCartItemQuantity(parseInt(this.dataset.id), -1);
    });
  });

  container.querySelectorAll(".increase").forEach((btn) => {
    btn.addEventListener("click", function () {
      updateCartItemQuantity(parseInt(this.dataset.id), 1);
    });
  });

  container.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      updateCartItemQuantity(
        parseInt(this.dataset.id),
        0,
        parseInt(this.value)
      );
    });
  });

  container.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      removeFromCart(parseInt(this.dataset.id));
    });
  });
}

function updateCartTotals(cart, products) {
  const cartSubtotal = document.getElementById("cart-subtotal");
  const cartTotal = document.getElementById("cart-total");

  if (!cartSubtotal || !cartTotal) return;

  let subtotal = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  const shipping = 5.0;
  const total = subtotal + shipping;

  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Favorites Functions
function loadFavorites() {
  const favoritesContainer = document.getElementById("favorites-container");
  const favoritesEmpty = document.getElementById("favorites-empty");

  if (!favoritesContainer || !favoritesEmpty) return;

  updateFavoritesCount();

  if (favorites.length === 0) {
    favoritesEmpty.style.display = "block";
    favoritesContainer.style.display = "none";
    return;
  }

  favoritesEmpty.style.display = "none";
  favoritesContainer.style.display = "grid";

  // Fetch all products and filter by favorites
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((products) => {
      const favoriteProducts = products.filter((product) =>
        favorites.includes(product.id)
      );
      renderProducts(favoriteProducts, "favorites-container", true);
    })
    .catch((error) => {
      console.error("Error loading favorites:", error);
    });
}

// Checkout Functions
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

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("show");
    });
  }
}

// Initialize the application
function initApp() {
  initTheme();
  initMobileMenu();
  updateCartCount();
  updateFavoritesCount();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
