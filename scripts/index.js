document.addEventListener("DOMContentLoaded", initRender());

async function initRender() {
  main();
  let initFavorite = new Set();
  for (let id of favorites) {
    initFavorite.add(id);
  }
  for (let item of cart) {
    initFavorite.add(item.id);
  }
  if (allProducts.length == 0) {
    let productsFeatched = await fetch("https://fakestoreapi.com/products");
    allProducts = await productsFeatched.json();
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
  }

  let favoriteProducts = allProducts.filter((product) =>
    initFavorite.has(product.id)
  );

  if (favoriteProducts.length < 6) {
    let topProducts = Array.from(
      allProducts.filter((product) => !initFavorite.has(product.id))
    );
    favoriteProducts.push(...topProducts);
  }
  favoriteProducts = favoriteProducts.slice(0, 6);

  renderProducts(favoriteProducts, "featured-products");
}
