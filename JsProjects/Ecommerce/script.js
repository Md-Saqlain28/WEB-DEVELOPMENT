document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: 1, name: "Product 1", price: 29.99 },
    { id: 2, name: "Product 2", price: 19.99 },
    { id: 3, name: "Product 3", price: 59.999 },
  ];

  let cart = [];

  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart");
  const cartTotalMessage = document.getElementById("cart-total");
  const totalPriceDisplay = document.getElementById("total-price");
  const checkOutBtn = document.getElementById("checkout-btn");

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
    <span>${product.name} - $${product.price.toFixed(2)}</span>
    <button data-id="${product.id}">Add to cart</button>
    `;
    productList.appendChild(productDiv);
  });

  productList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const productId = parseInt(e.target.getAttribute("data-id"));
      const product = products.find((p) => p.id === productId);
      addToCart(product);
    }
  });

  // load persisted cart from localStorage
  cart = loadCart() || [];
  renderCart();

  function addToCart(product) {
    cart.push(product);
    saveCart();
    renderCart();
  }

  function renderCart() {
    cartItems.innerText = "";
    let totalPrice = 0;

    if (cart.length > 0) {
      emptyCartMessage.classList.add("hidden");
      cartTotalMessage.classList.remove("hidden");
      cart.forEach((item, index) => {
        totalPrice += item.price;
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
        ${item.name} - $${item.price.toFixed(2)}
        `;
        cartItem.innerHTML += `<button data-index="${index}" style="margin-left: 150px; background-color: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 5px;">Remove</button>`;
        cartItems.appendChild(cartItem);
        totalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
      });
    } else {
      emptyCartMessage.classList.remove("hidden");
      totalPriceDisplay.textContent = `$0.00`;
    }
  }

  checkOutBtn.addEventListener("click", () => {
    cart.length = 0;
    saveCart();
    alert("Checkout successfully");
    renderCart();
  });

  cartItems.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const index = parseInt(e.target.getAttribute("data-index"));
      cart.splice(index, 1);
      saveCart();
      renderCart();
    }
  });

  // persist cart to localStorage
  function saveCart() {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }

  function loadCart() {
    try {
      const data = localStorage.getItem("cart");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load cart:", e);
      return [];
    }
  }
});
