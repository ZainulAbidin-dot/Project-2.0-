import { getDataFromDb } from "./js/apiCalls.js";

const createTagWithOptions = (options) => {
  const tag = document.createElement(options.tag);
  tag.textContent = options.text;
  return tag;
};

const init = async () => {
  const app = document.querySelector(".orders_container");
  const accessToken = JSON.parse(localStorage.getItem("access"));
  if (!accessToken) return alert("Please Login....");
  // const orders = await getDataFromDb(
  //   "vieworder",
  //   JSON.parse(localStorage.getItem("access"))
  // );
  const orders = JSON.parse(localStorage.getItem("TASTE_OF_DECOR_CART"));
  console.log(orders);
  app.appendChild(displayOrderInfo(orders));
};

const displayOrderInfo = (orders) => {
  const ul = document.createElement("ul");
  orders.forEach((order) => ul.appendChild(createOrderItem(order)));
  return ul;
};

const createOrderItem = (order) => {
  const fragment = document.createElement("li");
  fragment.appendChild(
    createTagWithOptions({ tag: "h1", text: `Product Name: ${order.name}` })
  );
  fragment.appendChild(
    createTagWithOptions({ tag: "p", text: `Price: ${order.price}` })
  );
  fragment.appendChild(
    createTagWithOptions({ tag: "p", text: `Quantity: ${order.qty}` })
  );
  return fragment;
};

document.addEventListener("DOMContentLoaded", init);
