
document.addEventListener("DOMContentLoaded", initRender());

async function initRender() {
  let initFavorite = new Set();
  for (let id of favorites) {
    initFavorite.add(id);
  }
  for (let item of cart) {
    initFavorite.add(item.id);
  }
  let productsFeatched = await fetch("https://fakestoreapi.com/products");
  let products = await productsFeatched.json();
  localStorage.setItem("allProducts", JSON.stringify(products));
  console.log(allProducts);

  let favoriteProducts = products.filter((product) =>
    initFavorite.has(product.id)
  );

  if (favoriteProducts.length < 6) {
    let topProducts = Array.from(
      products.filter((product) => !initFavorite.has(product.id))
    );
    favoriteProducts.push(...topProducts);
  }
  favoriteProducts = favoriteProducts.slice(0, 6);
  console.log(favoriteProducts);
  
  renderProducts(favoriteProducts, "featured-products");
}
