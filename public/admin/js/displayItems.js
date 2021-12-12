import { getDataFromDb } from "../../js/apiCalls.js";
import { emptyContainer, numberWithCommas } from "../../js/dataFunctions.js";

export const updateHeader = (title) => {
  const resourceTitle = document.querySelector(
    ".resources__details__header h1"
  );
  resourceTitle.textContent = title;
  const container = document.querySelector(".resources__details__header");
  const btn = container.querySelector("a") || null;
  if (btn) container.removeChild(container.lastChild);
  if (title === "Inventory" || title === "categories") {
    const addBtn = document.createElement("a");
    addBtn.classList.add("add-item");
    addBtn.textContent = `Add ${title}`;
    if (title === "Inventory") addBtn.href = "./addProduct.html";
    if (title === "categories") addBtn.href = "./addCategory.html";
    container.appendChild(addBtn);
  }
};

export const showProducts = async () => {
  // grabbing data
  const products = await getDataFromDb("products");
  // Grabbing UI Elements
  const productsContainer = document.querySelector(".app");
  const headerTemplate = document.querySelector("[data-resource-item-header]");
  const header = headerTemplate.content.firstElementChild.cloneNode(true);
  const itemTemplate = document.querySelector("[data-resource-item]");
  const ul = document.createElement("ul");
  ul.classList.add("resource__table");
  // clearing the div
  emptyContainer(productsContainer);
  // injecting header
  productsContainer.appendChild(header);
  // injecting product items
  for (const product of products) {
    const resourceItem = itemTemplate.content.firstElementChild.cloneNode(true);
    resourceItem.setAttribute("data-product-id", product.id);
    resourceItem.querySelector(".resource__item__id").textContent = product.id;
    resourceItem.querySelector(".resource__item__name").textContent =
      product.name;
    resourceItem.querySelector(
      ".resource__item__price"
    ).textContent = `Rs. ${numberWithCommas(product.price)}`;
    resourceItem.querySelector(".resource__item__stock").textContent =
      product.in_stock;
    resourceItem.querySelector(
      ".resource__item__view"
    ).href = `./viewProduct.html?id=${product.id}`;
    resourceItem.querySelector(
      ".resource__item__edit"
    ).href = `./editProduct.html?id=${product.id}`;
    ul.appendChild(resourceItem);
  }
  productsContainer.appendChild(ul);
};

export const showCategories = async () => {
  const categories = await getDataFromDb("");
  const products = await getDataFromDb("products");
  const productsQuantity = products.reduce((temp, prod) => {
    if (temp[prod.categoryId])
      temp[prod.categoryId] = temp[prod.categoryId] + 1;
    else temp[prod.categoryId] = 1;
    return temp;
  }, {});
  // Grabbing UI Elements
  const categoriesContainer = document.querySelector(".app");
  const headerTemplate = document.querySelector("[data-category-header]");
  const header = headerTemplate.content.firstElementChild.cloneNode(true);
  const itemTemplate = document.querySelector("[data-category]");
  const ul = document.createElement("ul");
  ul.classList.add("categories");
  // clearing the div
  emptyContainer(categoriesContainer);
  // injecting header
  categoriesContainer.appendChild(header);
  // inject categories
  for (const category of categories) {
    const item = itemTemplate.content.firstElementChild.cloneNode(true);
    item.setAttribute("data-category-id", category.id);
    item.querySelector(".category__id").textContent = category.id;
    item.querySelector(".category__name").textContent = category.name;
    item.querySelector(".category__items").textContent =
      productsQuantity[category.id];
    item.querySelector(
      ".resource__item__edit"
    ).href = `./editCategory.html?id=${category.id}`;
    ul.appendChild(item);
  }
  categoriesContainer.appendChild(ul);
};

export const showOrder = async () => {
  let orders = await getDataFromDb(
    "vieworder",
    JSON.parse(localStorage.getItem("access"))
  );
  const ordersContainer = document.querySelector(".app");
  const headerTemplate = document.querySelector("[data-order-header]");
  const header = headerTemplate.content.firstElementChild.cloneNode(true);
  const itemTemplate = document.querySelector("[data-order-item]");
  const ul = document.createElement("ul");
  ul.classList.add("order__table");
  // clearing the div
  emptyContainer(ordersContainer);
  // injecting header
  ordersContainer.appendChild(header);
  // injecting orders
  for (let order of orders) {
    console.log(order);
    const items = order.orderproduct.reduce(
      (total, item) => (total += item.quantity),
      0
    );
    order = { ...order, items };
    const item = itemTemplate.content.firstElementChild.cloneNode(true);
    item.setAttribute("data-order-id", order.id);
    item.querySelector(".order__item__id").textContent = order.id;
    item.querySelector(".customer__name").textContent = order.username;
    item.querySelector(".order__price").textContent = `Rs. ${numberWithCommas(
      order.total_price
    )}`;
    item.querySelector(".product__qty").textContent = order.items;
    item.querySelector(".delivered").textContent = order.status;
    ul.appendChild(item);
  }
  ordersContainer.appendChild(ul);
};

export const showUsers = async () => {
  const users = await getDataFromDb(
    "getallusers",
    JSON.parse(localStorage.getItem("access"))
  );
  console.log(users);
  const customersContainer = document.querySelector(".app");
  const headerTemplate = document.querySelector("[data-customer-header]");
  const header = headerTemplate.content.firstElementChild.cloneNode(true);
  const itemTemplate = document.querySelector("[data-customer-item]");
  const ul = document.createElement("ul");
  ul.classList.add("customers__table");
  // clearing the div
  emptyContainer(customersContainer);
  // injecting header
  customersContainer.appendChild(header);
  // injecting users
  for (const user of users) {
    const item = itemTemplate.content.firstElementChild.cloneNode(true);
    item.setAttribute("data-order-id", user.profile.id);
    item.querySelector(".customer__id").textContent = user.profile.id;
    item.querySelector(".customer__name").textContent = user.username;
    item.querySelector(".customer__email").textContent = user.email;
    item.querySelector(".customer__city").textContent = user.profile.city;
    item.querySelector(".customer__phone").textContent = user.profile.phoneno;

    ul.appendChild(item);
  }
  customersContainer.appendChild(ul);
};

export const showMessages = async () => {
  const messages = await getDataFromDb("messages");
  const messageContainer = document.querySelector(".app");
  const messageTemplate = document.querySelector("[data-message-template]");
  const ul = document.createElement("ul");
  ul.classList.add("messages");
  // clearing the div
  emptyContainer(messageContainer);
  // injecting messages
  for (const message of messages) {
    const msgItem = messageTemplate.content.firstElementChild.cloneNode(true);
    msgItem.setAttribute("data-id", message.id);
    msgItem.querySelector(".message__name span").textContent = message.name;
    msgItem.querySelector(".message__subject span").textContent =
      message.subject;
    msgItem.querySelector(".message__body span").textContent = message.message;
    if (message.subject.toLowerCase() === "testimonial")
      addToogler(msgItem, message);
    ul.appendChild(msgItem);
  }
  messageContainer.appendChild(ul);
};

const addToogler = (msgItem, message) => {
  // grab toggler template
  const togglerTemplate = document.querySelector("[data-toggler]");
  const toggler = togglerTemplate.content.firstElementChild.cloneNode(true);
  toggler.setAttribute("for", `message${message.id}`);
  toggler.querySelector(".featured-toggler").id = `message${message.id}`;
  toggler.querySelector(".featured-toggler").checked = message.featured;
  msgItem.appendChild(toggler);
};
