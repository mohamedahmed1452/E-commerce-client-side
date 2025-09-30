// Favorites page specific script
document.addEventListener("DOMContentLoaded", function () {
  main();
  loadFavorites();
});

function loadFavorites() {
  const favoritesContainer = document.getElementById("favorites-container");
  const favoritesEmpty = document.getElementById("favorites-empty");

  if (favorites.length === 0) {
    if (favoritesEmpty) favoritesEmpty.style.display = "block";
    favoritesContainer.style.display = "none";
    return;
  }

  if (favoritesEmpty) favoritesEmpty.style.display = "none";
  favoritesContainer.style.display = "flex";
  let products = Array.from(JSON.parse(localStorage.getItem("allProducts")));

  let favoriteProducts = [];
  for (let product of products) {
    if (favorites.includes(product.id)) {
      favoriteProducts.push(product);
    }
  }

  renderProducts(favoriteProducts, "favorites-container");
}
