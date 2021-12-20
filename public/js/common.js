import {
  deleteDataFromDb,
  getDataFromDb,
  postDataToDb,
  replaceDataInDb,
  updateDataInDb,
} from "./apiCalls.js";
import {
  addProdToCartInLS,
  updateBadge,
  updateCart,
  updateTotalPrice,
  deletingCartItemAnimation,
} from "./cart.js";

import { CustomFooter } from "./footer.js";
import { getDataFromLS, setDataToLS } from "./localStorage.js";

const cartKey = "TASTE_OF_DECOR_CART";

const getCartID = async (targetId) => {
  const [cart] = await getDataFromDb(
    "viewcart",
    JSON.parse(localStorage.getItem("access"))
  );
  const cartProducts = cart.cartproduct;
  console.log(cartProducts, targetId);
  const id = cartProducts.find(
    (cartProduct) => cartProduct.product.id.toString() === targetId
  ).id;
  return id;
};

// hamburger
const hamburgerBtn = document.querySelector(".hamburger");
hamburgerBtn.addEventListener("click", function () {
  hamburgerBtn.classList.toggle("menu-active");
});

// Log Out
const LogOut = document.querySelector("#log_out");
LogOut.addEventListener("click", function () {
  // JSON.parse(localStorage.removeItem("access"));
  JSON.parse(localStorage.clear());
  window.location.href = "http://127.0.0.1:5500/public/authentication.html";
});

// Login
const login = document.querySelector("#log_in");
login.addEventListener("click", function () {
  const accessToken = JSON.parse(localStorage.getItem("access")) || undefined;
  if (!accessToken) {
    window.location.href = `http://127.0.0.1:5500/public/authentication.html`;
  } else {
    alert("You are Already Logged In !");
  }
});

// scroll activated navbar
const body = document.body;
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (window.pageYOffset > 80) {
    // at top
    if (currentScroll <= 0) {
      body.classList.remove("scroll-up");
    }
    // going down
    if (currentScroll > lastScroll && !body.classList.contains("scroll-down")) {
      body.classList.remove("scroll-up");
      body.classList.add("scroll-down");
    }
    //going up
    if (currentScroll < lastScroll && body.classList.contains("scroll-down")) {
      body.classList.remove("scroll-down");
      body.classList.add("scroll-up");
    }
  }
  lastScroll = currentScroll;
});

/* profile dropdown */
const profileImage = document.querySelector(".profile-wrapper");
profileImage.addEventListener("click", () => toggleProfileDropdown());

const toggleProfileDropdown = () => {
  const profileDropdown = document.querySelector(".profile-dropdown");
  if (profileDropdown.classList.contains("active")) {
    profileDropdown.classList.remove("active");
  } else {
    profileDropdown.classList.add("active");
  }
};

/* Cart */
const cartIcon = document.querySelector(".cart-icon");
const cartContainer = document.querySelector(".cart-container");

// open cart
cartIcon.addEventListener("click", () => {
  cartContainer.classList.add("cart-open");
  document.body.style = "overflow: hidden";
});

//close cart
cartContainer.querySelector(".close").addEventListener("click", () => {
  cartContainer.classList.remove("cart-open");
  document.body.style = "";
});

// Cards interaction
const ids = ["index", "collection", "prod-detail"];
if (ids.includes(body.id)) {
  const prodContainer =
    document.querySelector(".product-container") ||
    document.querySelector(".products") ||
    document.querySelector(".similar-products .flex");

  prodContainer.addEventListener("click", (e) => {
    const targetCard = e.target.closest(".card");
    if (!targetCard) return;
    const addToCartBtn = targetCard.querySelector(".buy");
    const removeBtn = targetCard.querySelector(".remove");
    if (e.target.parentElement === addToCartBtn) {
      targetCard.querySelector(".bottom").classList.add("clicked");
      // adding prod to cart in data base
      sendProductToCart(targetCard);
    } else if (e.target.parentElement === removeBtn) {
      targetCard.querySelector(".bottom").classList.remove("clicked");
    }
  });
}

/* Init Function */
const initCart = async () => {
  const auth = JSON.parse(localStorage.getItem("access")) || null;
  const [cart] = auth ? await getDataFromDb("viewcart", auth) : [{}];
  const cartProducts = cart?.cartproduct || [];
  const cartItems = cartProducts.map((prod, index) => ({
    id: index + 1,
    prodId: prod.product.id,
    name: prod.product.name,
    price: prod.product.price,
    imgSrc: `http://127.0.0.1:8000${prod.product.primary_image}`,
    qty: prod.quantity,
  }));
  setDataToLS(cartKey, cartItems);
  updateCart();
  updateBadge();
};

document.addEventListener("DOMContentLoaded", initCart);

const sendProductToCart = (card) => {
  addProdToCartInLS(card);
  updateBadge();
  updateCart();
};

/* Cart Interactions */

const cart = document.querySelector(".cart-container");
cart.addEventListener("click", (e) => {
  const target =
    e.target.closest(".delete-item") ||
    e.target.closest(".increament") ||
    e.target.closest(".decreament") ||
    e.target.closest(".remove-all");

  if (!target) return;
  switch (target.className) {
    case "delete-item":
      deleteItem(e);
      break;
    case "increament":
      changeProdQty(e, "increase");
      break;
    case "decreament":
      changeProdQty(e, "decrease");
      break;
    case "remove-all":
      removeAll(e);
      break;
  }
});

const deleteItem = async (e) => {
  // return alert("Dont use me....");
  const cartItems = getDataFromLS(cartKey);
  const targetCard = e.target.closest(".item");
  const targetId = targetCard.getAttribute("data-id");
  const newCartItems = cartItems.filter((item) => item.id !== +targetId);
  setDataToLS(cartKey, newCartItems);
  deletingCartItemAnimation(targetCard);
  setTimeout(() => {
    if (document.querySelector(".cart-items > *")) updateTotalPrice();
    else updateCart();
    updateBadge();
  }, 2000);
};

const changeProdQty = async (e, mode) => {
  const cartItems = getDataFromLS(cartKey);
  const targetCard = e.target.closest(".item");
  const targetId = targetCard.getAttribute("data-id");
  let prodQty = targetCard.querySelector(".item__qty");
  let updatedCartItems;
  if (mode === "increase") {
    updatedCartItems = cartItems.map((item) =>
      item.id == targetId
        ? { ...item, qty: parseInt(prodQty.textContent) + 1 }
        : item
    );
    const id = await getCartID(targetCard.dataset.prodId);
    await postDataToDb(
      "addtocart",
      { id: targetCard.dataset.prodId },
      JSON.parse(localStorage.getItem("access"))
    );
  } else {
    const id = await getCartID(targetCard.dataset.prodId);
    if (parseInt(prodQty.textContent) == 1) {
      deleteItem(e);
      await deleteDataFromDb(
        "removefromcart",
        { id },
        JSON.parse(localStorage.getItem("access"))
      );
      return;
    } else {
      updatedCartItems = cartItems.map((item) =>
        item.id == targetId
          ? { ...item, qty: parseInt(prodQty.textContent) - 1 }
          : item
      );
      await replaceDataInDb(
        "removefromcart",
        { id },
        JSON.parse(localStorage.getItem("access"))
      );
    }
  }
  setDataToLS(cartKey, updatedCartItems);
  updateBadge();
  updateCart();
};

const removeAll = async (e) => {
  return alert("Dont use me....");
  const cartItems = e.target.closest(".cart-head").nextElementSibling;
  const items = Array.from(cartItems.children);
  items.forEach((item) => {
    deletingCartItemAnimation(item);
  });
  setTimeout(() => {
    setDataToLS(cartKey, []);
    updateCart();
    updateBadge();
  }, 2000);
};
