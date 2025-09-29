// Products page specific script
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the app
  initApp();

  // Load all products
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((products) => {
      window.allProducts = products;
      document.querySelector(".loading").style.display = "none";
      renderProducts(products, "products-container");
      populateCategories(products);
    })
    .catch((error) => {
      console.error("Error loading products:", error);
      document.querySelector(".loading").innerHTML =
        "<p>Error loading products. Please try again later.</p>";
    });

  // Set up search and filter
  document
    .getElementById("search-input")
    .addEventListener("input", filterProducts);
  document
    .getElementById("category-filter")
    .addEventListener("change", filterProducts);
});

function filterProducts() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const category = document.getElementById("category-filter").value;

  let filteredProducts = window.allProducts;

  if (searchTerm) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm)
    );
  }

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  renderProducts(filteredProducts, "products-container");
}

function populateCategories(products) {
  const categories = [...new Set(products.map((p) => p.category))];
  const categoryFilter = document.getElementById("category-filter");

  // Clear existing options except the first one
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });
}
