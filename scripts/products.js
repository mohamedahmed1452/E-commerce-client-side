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
  let search = document
    .getElementById("search-input")
    .value.toLowerCase();
  let productsFiltered = [];
  let products = JSON.parse(localStorage.getItem("allProducts")) || [];

  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    if (search === "" || product.title.toLowerCase().includes(search)) {
      productsFiltered.push(product);
    }
  }
  renderProducts(productsFiltered, "products-container");
}

function filterByCategory() {
  const category = document.getElementById("category-filter").value;
  let productsFiltered = [];
  let products = JSON.parse(localStorage.getItem("allProducts")) || [];

  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    if (category === "" || product.category === category) {
      productsFiltered.push(product);
    }
  }

  renderProducts(productsFiltered, "products-container");
}

function loadProducts() {
  let products = JSON.parse(localStorage.getItem("allProducts")) || [];
  renderProducts(products, "products-container");
  createDropDownList(products);
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
