/* Imports */
import { CustomFooter } from "./footer.js";

import { displayMsg, numberWithCommas, throwError } from "./dataFunctions.js";

import { getDataFromLS, setDataToLS } from "./localStorage.js";

import { getDataFromDb, postDataToDb } from "./apiCalls.js";

import {
  validateName,
  validateEmail,
  validateAddress,
  validatePhoneNumber,
} from "./formValidations.js";

/* Main Code */
const cartKey = "TASTE_OF_DECOR_CART";

document.addEventListener("DOMContentLoaded", () => {
  fetchingData();
  document
    .querySelector(".go-back")
    .addEventListener("click", () => window.history.go(-1));
});

const fetchingData = () => {
  const items = getDataFromLS(cartKey);
  injectProductCards(items);
  updatePrices(items);
  updateFormFields();
  placeorder(items);
};

const updateFormFields = async () => {
  const user = await getDataFromDb(
    "getuser",
    JSON.parse(localStorage.getItem("access"))
  );
  console.log(user);
  document.querySelector("#name").value = user.username;
  document.querySelector("#email").value = user.email;
  document.querySelector("#address").value = user.profile.city;
  document.querySelector("#phone").value = user.profile?.phoneno;
};

const injectProductCards = (items) => {
  const cardContainer = document.querySelector(".products");
  const cardTemplate = document.getElementById("checkout-card");
  items.forEach((item) => {
    // grabbing UI fields
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const img = card.querySelector(".prod__image img");
    const imgBadge = card.querySelector(".prod__qty");
    const name = card.querySelector(".prod__name");
    const price = card.querySelector(".prod__price");
    // Setting values
    card.setAttribute("data-cart-item-id", item.id);
    img.src = item.imgSrc;
    imgBadge.textContent = item.qty;
    name.textContent = item.name;
    price.textContent = `Rs: ${numberWithCommas(item.price)}`;
    // inserting card to DOM
    cardContainer.appendChild(card);
  });
};

const updatePrices = async (items) => {
  const total = document.querySelector(".total__amount");
  const priceArr = items.map((item) => {
    return parseInt(item.price) * parseInt(item.qty);
  });
  const totalPrice = priceArr.reduce((total, price) => {
    return (total += price);
  }, 0);
  total.textContent = `Rs: ${numberWithCommas(parseInt(totalPrice))}`;
};

const placeorder = async (items) => {
  const placeorderForm = document.querySelector(".customer__detail__form");
  placeorderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // make orderObj and send it to db
    const cart = await getDataFromDb(
      "viewcart",
      JSON.parse(localStorage.getItem("access"))
    );
    await postDataToDb(
      "placeorder",
      { cart },
      JSON.parse(localStorage.getItem("access"))
    );
    emptyCart();
    // add animation
    addPostInteractivity();
  });
};

const emptyCart = () => {
  setDataToLS(cartKey, []);
};

const addPostInteractivity = () => {
  document.body.style.overflow = "hidden";
  document.querySelector("main.checkout").classList.add("blur");
  // grabbing templates
  let loader = document
    .getElementById("loading")
    .content.firstElementChild.cloneNode(true);
  let checkoutMsg = document
    .getElementById("checkout-msg-template")
    .content.firstElementChild.cloneNode(true);
  // adding post loader
  document.body.appendChild(loader);
  // removing post loader and adding checkout msg
  const container = document.querySelector(".overlay");
  setTimeout(() => {
    container.replaceChild(
      checkoutMsg,
      document.querySelector(".checkout-animation")
    );
  }, 4000);

  container.addEventListener("click", (e) => {
    const target = e.target.closest(".close__checkout-msg");
    if (!target) return;
    document.querySelector(".overlay").style.transform = `scale(0)`;
    setTimeout(() => {
      window.location.href = `http://127.0.0.1:5500/public`;
    }, 1500);
  });
};
