document.addEventListener("DOMContentLoaded", initProductPage);
function initProductPage() {
  main();
  loadProducts();
  document
    .getElementById("search-input")
    .addEventListener("input", filterBySearch);

  document
    .getElementById("category-filter")
    .addEventListener("change", filterByCategory);
}

function filterBySearch() {
  let search = document.getElementById("search-input").value.toLowerCase();
  let productsFiltered = [];
  for (let i = 0; i < allProducts[i].length; i++) {
    if (search === "" || allProducts[i].title.toLowerCase().includes(search)) {
      productsFiltered.push(allProducts[i]);
    }
  }
  renderProducts(productsFiltered, "products-container");
}

function filterByCategory() {
  const category = document.getElementById("category-filter").value;
  let productsFiltered = [];
  for (let i = 0; i < allProducts.length; i++) {
    if (category === "" || allProducts[i].category === category) {
      productsFiltered.push(allProducts[i]);
    }
  }

  renderProducts(productsFiltered, "products-container");
}

function loadProducts() {
  renderProducts(allProducts, "products-container");
  createDropDownList(allProducts);
}

function createDropDownList(products) {
  let categoryFilter = document.getElementById("category-filter");

  // Get unique categories with Set
  const categories = new Set();
  for (let i = 0; i < products.length; i++) {
    categories.add(products[i].category);
  }

  let cartona = `<option value="">All Categories</option>`;
  for (let category of categories) {
    cartona += `<option value="${category}">${category}</option>`;
  }

  categoryFilter.innerHTML = cartona;
}
