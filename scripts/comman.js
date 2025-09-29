let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  let cartona = '';
  for (let i = 0; i < products.length; i++) {
    let active = '';
    if (favorites.includes(products[i].id)) active = 'active';
    cartona += `<div class="product-card">
  <img src="${products[i].image}" alt="${products[i].title}" class="product-image">

  <div class="product-info">
    <h3 class="product-title">${products[i].title}</h3>
    <div class="product-price">$${products[i].price}</div>
    <div class="product-category">${products[i].category}</div>

    <div class="product-actions">
      <button onclick="toggleCart(${products[i].id},this)" class="btn-cart">
        <i class="fas fa-shopping-cart"></i>
      </button>
      <button onclick="toggleFavorite(${products[i].id},this)" class="btn-favorite ${active}">
        <i class="fas fa-heart"></i>
      </button>
    </div>
  </div>
</div>

`;
  }

  container.innerHTML = cartona;
}

function mobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu .bn');
  const navLinks = document.querySelector('.nav-bar .links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.onclick = () => navLinks.classList.toggle('show');
  }
}

function updateFavoritesCount() {
  let favoritesCount = document.getElementById('favorites-count');
  favoritesCount.innerHTML = favorites.length;
}

function toggleFavorite(productId, button) {
  if (favorites.includes(productId)) {
    favorites = favorites.filter((id) => id !== productId);
    showNotification('Removed successfully', false);
  } else {
    favorites.push(productId);
    showNotification('Added successfully', true);
  }

  button.classList.toggle('active', favorites.includes(productId));
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesCount();

  if (location.pathname.includes('favorites.html')) {
    loadFavorites();
  }
}
function toggleCart(productId, button) {
  console.log(cart);
  let flag = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      console.log('Hello');
      cart.splice(i, 1);
      showNotification('Removed successfully', false);
      flag = true;
      break;
    }
  }
  if (!flag) {
    let newItem = { id: productId, quantity: 1 };
    cart.push(newItem);
    showNotification('Added successfully', true);
  }
  button.classList.toggle('active', !flag);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  let cartCount = document.getElementById('cart-count');
  let count = 0;
  for (let i = 0; i < cart.length; i++) {
    count += cart[i].quantity;
  }

  cartCount.innerHTML = count;
}

function showNotification(message, flag) {
  let notification = document.getElementById('notification');
  if (flag) {
    notification.classList.add('add');
    notification.classList.remove('remove');
  } else {
    notification.classList.add('remove');
    notification.classList.remove('add');
  }
  notification.innerHTML = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification('removed successfully', false);

  if (location.pathname.includes('cart.html')) loadCart();
}

function loadFavorites() {
  const favoritesContainer = document.getElementById('favorites-container');
  const favoritesEmpty = document.getElementById('favorites-empty');

  if (favorites.length === 0) {
    if (favoritesEmpty) favoritesEmpty.style.display = 'block';
    favoritesContainer.style.display = 'none';
    return;
  }

  if (favoritesEmpty) favoritesEmpty.style.display = 'none';
  favoritesContainer.style.display = 'flex';
  let products = Array.from(JSON.parse(localStorage.getItem('allProducts')));

  let favoriteProducts = [];
  for (let product of products) {
    if (favorites.includes(product.id)) {
      favoriteProducts.push(product);
    }
  }

  renderProducts(favoriteProducts, 'favorites-container');
}

function loadCart() {
  const cartEmpty = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartContent.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartContent.style.display = 'block';

    let products = JSON.parse(localStorage.getItem('allProducts'));
    renderCartItems(cart, products);
    updateCartTotals(cart, products);
  }
}

function renderCartItems(cart, products) {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  container.innerHTML = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return '';

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
    .join('');
}

// Simple quantity change
function changeQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity < 1) {
    removeFromCart(productId);
    return;
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  loadCart();
}

// Simple totals calculation
function updateCartTotals(cart, products) {
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');

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

function main() {
  mobileMenu();
  updateCartCount();
  updateFavoritesCount();
}

document.addEventListener('DOMContentLoaded', main);
