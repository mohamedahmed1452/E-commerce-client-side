let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  let cartona = "";
  for (let i = 0; i < products.length; i++) {
    let activeFavorites = "";
    let activeCart = "";
    if (favorites.includes(products[i].id)) activeFavorites = "active";
    for (let j = 0; j < cart.length; j++) {
      if (products[i].id === cart[j].id) {
        activeCart = "active";
        break;
      }
    }
    cartona += `<div class="product-card">
  <img src="${products[i].image}" alt="${products[i].title}" class="product-image">

  <div class="product-info">
    <h3 class="product-title">${products[i].title}</h3>
    <div class="product-price">$${products[i].price}</div>
    <div class="product-category">${products[i].category}</div>

    <div class="product-actions">
      <button onclick="toggleCart(${products[i].id},this)" class="btn-cart ${activeCart}">
        <i class="fas fa-shopping-cart"></i>
      </button>
      <button onclick="toggleFavorite(${products[i].id},this)" class="btn-favorite ${activeFavorites}">
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
  const mobileMenuBtn = document.querySelector(".mobile-menu .bn");
  const navLinks = document.querySelector(".nav-bar .links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.onclick = () => navLinks.classList.toggle("show");
  }
}
function updateFavoritesCount() {
  let favoritesCount = document.getElementById("favorites-count");
  favoritesCount.innerHTML = favorites.length;
}
function updateCartCount() {
  let cartCount = document.getElementById("cart-count");
  let count = 0;
  for (let i = 0; i < cart.length; i++) {
    count += cart[i].quantity;
  }

  cartCount.innerHTML = count;
}



function toggleFavorite(productId, button) {
  if (favorites.includes(productId)) {
    favorites = favorites.filter((id) => id !== productId);
    showNotification("Removed successfully", false);
  } else {
    favorites.push(productId);
    showNotification("Added successfully", true);
  }

  button.classList.toggle("active", favorites.includes(productId));
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesCount();

  if (location.pathname.includes("favorites.html")) {
    loadFavorites();
  }
}
function toggleCart(productId, button) {
  console.log(cart);
  let flag = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      console.log("Hello");
      cart.splice(i, 1);
      showNotification("Removed successfully", false);
      flag = true;
      break;
    }
  }
  if (!flag) {
    let newItem = { id: productId, quantity: 1 };
    cart.push(newItem);
    showNotification("Added successfully", true);
  }
  button.classList.toggle("active", !flag);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}




function showNotification(message, flag) {
  let notification = document.getElementById("notification");
  if (flag) {
    notification.classList.add("add");
    notification.classList.remove("remove");
  } else {
    notification.classList.add("remove");
    notification.classList.remove("add");
  }
  notification.innerHTML = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

function main() {
  mobileMenu();
  updateCartCount();
  updateFavoritesCount();
}
