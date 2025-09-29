// Home page specific script
document.addEventListener("DOMContentLoaded", function () {
  // Load featured products
  fetch("https://fakestoreapi.com/products?limit=6")
    .then((res) => res.json())
    .then((products) => {
      document.querySelector(".loading").style.display = "none";
      renderProducts(products, "featured-products");
    })
    .catch((error) => {
      console.error("Error loading featured products:", error);
      document.querySelector(".loading").innerHTML =
        "<p>Error loading products. Please try again later.</p>";
    });
});
