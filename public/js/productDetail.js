/* imports */
import { getDataFromDb, updateDataInDb } from "./apiCalls.js";

import {
  addProdToCartInLS,
  updateBadge,
  updateCart,
  sendProdToCart,
} from "./cart.js";

import {
  emptyContainer,
  addLoadingAnimation,
  injectProducts,
  numberWithCommas,
  getNameInitials,
  getRandomNumber,
  getFutureDate,
  shuffleArray,
} from "./dataFunctions.js";

import { clearFields, validateEmail } from "./formValidations.js";

const IMAGE_BASE_URL = "http://127.0.0.1:8000";

/* getting id and categoryId from URL to update the page content accordingly */
const productId = new URLSearchParams(window.location.search).get("id");
const categoryId = new URLSearchParams(window.location.search).get(
  "categoryId"
);

/* Functions to be run at init */
const init = async () => {
  const products = await getDataFromDb(`categories/${categoryId}/products`);
  let currProduct = products.find((prod) => prod.id === +productId);
  currProduct = { ...currProduct, reviews: [] };
  updatePageTitle(currProduct.name);
  injectProductDetails(currProduct);
  changePrimaryImage();
  populateSimilarProducts(products);
  buyProduct();
};

/* Initializing App on Page Load */
document.addEventListener("DOMContentLoaded", init);

/* Update page title */
const updatePageTitle = async (prodName) => {
  document.title = `Taste of Décor | ${prodName}`;
};

/* injecting prod details */
const injectProductDetails = async (productObj) => {
  // grabbing UI elements
  console.log(productObj);
  const prodContainer = document.querySelector("main.product .container");
  emptyContainer(prodContainer);
  const prodTemplate = document.getElementById("prod-detail-template");
  // grabbing reqd fields from product template
  const product = prodTemplate.content.firstElementChild.cloneNode(true);
  const imageGrid = product.querySelector(".image-grid");
  const primaryImage = product.querySelector(".primary__image");
  const prodName = product.querySelector(".product__name");
  const prodPrice = product.querySelector(".product__price");
  const ratings = product.querySelector(".stars-inner");
  const reviewsNumber = product.querySelector(".reviews-number");
  const productDescription = product.querySelector(".product__description");
  const buyNow = product.querySelector(".buy-now");
  const deliveryDetails = product.querySelector(".delivery__details p span");
  // assigning values
  product.setAttribute("data-id", productObj.id);
  primaryImage.src = `${IMAGE_BASE_URL}${productObj.primary_image}`;
  imageGrid.appendChild(primaryImage);
  const imageList = injectAllImages(productObj.img);
  imageList.forEach((image) => imageGrid.appendChild(image));
  prodName.textContent = productObj.name;
  prodPrice.textContent = `Rs. ${numberWithCommas(productObj.price)}`;
  addRatingInfo(reviewsNumber, ratings, productObj);
  productDescription.textContent = productObj.description;
  setButtonState(buyNow);
  addDeliveryDetails(deliveryDetails);
  prodContainer.appendChild(product);
};

/* necessary functions for product detail section */
const injectAllImages = (imgs) => {
  const imageList = [];
  console.log(imgs);
  imgs.forEach((img) => {
    const imageElement = document.createElement("img");
    imageElement.classList.add("prod-image");
    imageElement.src = `${IMAGE_BASE_URL}${img.url}`;
    imageList.push(imageElement);
  });
  imageList[0].classList.add("active");
  return imageList;
};

const getRatingsInfo = (reviews) => {
  const totalRatings = reviews.reduce((total, review) => {
    return total + parseInt(review.ratings);
  }, 0);
  const avgRating = totalRatings / reviews.length;
  let starPercentage = totalRatings / (reviews.length * 5);
  starPercentage = `${Math.round(starPercentage * 100)}%`;
  return [starPercentage, avgRating.toFixed(1)];
};

const addRatingInfo = (reviewsNumber, ratings, productObj) => {
  if (productObj.reviews.length) {
    const [starsWidth, avgRating] = getRatingsInfo(productObj.reviews);
    reviewsNumber.textContent = `${productObj.reviews.length} reviews (${avgRating} avg. ratings)`;
    ratings.style.width = starsWidth;
  } else {
    reviewsNumber.textContent = `No reviews`;
  }
};

const setButtonState = (buyNow) => {
  const cartItems = document.querySelector(".cart-items > *");
  if (cartItems) {
    buyNow.setAttribute("disabled", "");
  } else {
    buyNow.removeAttribute("disabled");
  }
};

const addDeliveryDetails = (deliveryDetails) => {
  const { date, month, day } = getFutureDate(3);
  deliveryDetails.textContent = `Delivered by ${date} ${month}, ${day} | Sale`;
};

// image interaction
const changePrimaryImage = () => {
  const container = document.querySelector(".product .container");
  container.addEventListener("click", (e) => {
    const target = e.target.closest(".prod-image");
    if (!target) return;
    const primaryImage = document.querySelector("img.primary__image");
    const activeImage = document.querySelector("img.active");
    if (target === activeImage) return;
    activeImage.classList.remove("active");
    target.classList.add("active");
    primaryImage.src = target.src;
  });
};

const buyProduct = async () => {
  const container = document.querySelector(".product .container");
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn.buy-now");
    if (!btn) return;
    sendProdToCart(document.querySelector(".product .grid"), productId);
    setTimeout(() => {
      window.location.href = `http://localhost:5500/checkout.html`;
    }, 500);
  });
};

/* Add prod to cart from prod details */
const prodContainer = document.querySelector("main.product .container");
prodContainer.addEventListener("click", (e) => {
  const cardBtn = e.target.closest(".add-to-cart");
  if (!cardBtn) return;
  const card = prodContainer.querySelector("[data-prod-card]");
  cartFunctions(card);
});

const cartFunctions = (card) => {
  addProdToCartInLS(card);
  updateBadge();
  updateCart();
};

/* populate Similar Products */
const populateSimilarProducts = (products) => {
  products = products.filter((product) => product.id != productId);
  products = shuffleArray(products);
  products.length = 4;
  // getting UI elements
  const cardTemplate = document.getElementById("card-template");
  const container = document.querySelector(".similar-products .flex");
  // inject prod to DOM
  injectProducts(cardTemplate, products, container);
};

/* Populate Reviews If Any */
const reviewsContainer = document.querySelector(".reviews");
const populateReviews = async () => {
  const products = await getDataFromDb(`categories/${categoryId}/products`);
  let [currProduct] = products.filter((prod) => prod.id === +productId);
  currProduct = { ...currProduct, reviews: [] };
  const { reviews } = currProduct;
  addLoadingAnimation(reviewsContainer);
  setTimeout(() => {
    emptyContainer(reviewsContainer);
    if (!reviews.length) {
      let elem = document.getElementById("no-reviews");
      elem = document.importNode(elem.content, true);
      reviewsContainer.appendChild(elem);
    } else {
      // grabbing elements
      const reviewTemplate = document.getElementById("review-template");
      reviews.forEach((review) => {
        const reviewElement = document.importNode(reviewTemplate.content, true);
        const userName = reviewElement.querySelector(".user-name");
        const userEmail = reviewElement.querySelector(".user-email");
        const userImg = reviewElement.querySelector(".user-image");
        const userRatings = reviewElement.querySelector(".stars-inner");
        const reviewBody = reviewElement.querySelector(".review__body p");
        // inserting values
        userName.textContent = review.name;
        userEmail.textContent = review.email;
        userImg.textContent = `${getNameInitials(review.name)}`;
        userImg.style.backgroundColor = `hsl(${getRandomNumber()}, 50%, 50%)`;
        userRatings.style.width = `${(review.ratings / 5) * 100}%`;
        reviewBody.textContent = review.description;
        reviewsContainer.appendChild(reviewElement);
      });
    }
  }, 1000);
};
/* Populating Reviews when in viewport */
const observer = new IntersectionObserver(
  function (entries) {
    if (entries[0].isIntersecting && window.scrollY > 0) {
      populateReviews();
      observer.unobserve(entries[0].target);
    }
  },
  { threshold: 1 }
);
observer.observe(reviewsContainer);

/* Review Form */

let reviewObj = {};

// get UI elements
const formsContainer = document.querySelector(".review-form");
const form1 = document.querySelector(".form1");
const form2 = document.querySelector(".form2");
const ratingsContainer = document.querySelector(".review-form .ratings");

// 1st form
form1.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const userName = name.value;
  const userEmail = email.value;
  if (userName && validateEmail(userEmail)) {
    reviewObj.name = userName;
    reviewObj.email = userEmail;
    formsContainer.style.animation = `slideIn 2000ms ease-out forwards`;
    clearFields(name, email);
  } else {
    window.alert("Fill the fields correctly");
  }
});

// rate the prod
ratingsContainer.addEventListener("click", (e) => {
  const target = e.target.closest("i.far");
  if (!target) return;
  const stars = Array.from(ratingsContainer.children);
  stars.forEach((star) => {
    if (star.classList.contains("active")) star.classList.remove("active");
  });
  target.classList.add("active");
});

// 2nd Form
form2.addEventListener("submit", (e) => {
  e.preventDefault();
  const review = document.getElementById("review");
  const rating = ratingsContainer
    .querySelector(".active")
    .getAttribute("data-rating");
  if (!rating) return window.alert("please rate the prod");
  const userReview = review.value;
  reviewObj.ratings = rating;
  reviewObj.description = userReview;
  postReview(reviewObj);
  formsContainer.style.animation = `slideOut 2000ms ease-out forwards`;
  clearFields(review);
  ratingsContainer.querySelector(".active").classList.remove("active");
});

// Make reqd changes and post review to db
const postReview = async (reviewObj) => {
  let url = `products/${productId}`;
  let { reviews: prodReviews } = await getDataFromDb(url);
  reviewObj.id = prodReviews.length + 1;
  prodReviews = [...prodReviews, reviewObj];
  const data = { reviews: prodReviews };
  updateDataInDb(`products/${productId}`, data);
};
