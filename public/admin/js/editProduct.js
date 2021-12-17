import {
  getDataFromDb,
  postDataToDb,
  updateDataInDb,
} from "../../js/apiCalls.js";
import { displayMsg } from "../../js/dataFunctions.js";

const productId = new URLSearchParams(window.location.search).get("id");

/* Grabbing UI Fields */
const form = document.querySelector(".edit-product");
const productNameField = document.getElementById("product-name");
const productPriceField = document.getElementById("product-price");
const imageWrapper = document.querySelector(".product-images");
const productStockField = document.getElementById("product-stock");
const imageField = document.getElementById("product-images");
const productDescription = document.getElementById("product-description");
const categoryList = document.getElementById("category-list");

const init = async () => {
  const categories = await getDataFromDb("");
  const product = await getDataFromDb(`product/${productId}`);
  console.log(product);
  updateFields(product, categories);
  updateImages(product);
  imageField.addEventListener("change", handleImageUpload);
  form.addEventListener("submit", (e) => {
    handleFormSubmit(e, product);
  });
};

const handleImageUpload = (e) => {
  console.log(e.target.files[0].name);
};

const updateFields = (product, categories) => {
  productNameField.value = product.name;
  productPriceField.value = Number(product.price);
  const options = [{ id: null, name: "select category..." }, ...categories].map(
    (category) => createOptionElement(category, product.categoryId)
  );
  options.forEach((option) => categoryList.appendChild(option));
  productDescription.innerHTML = product.description;
};

const updateImages = (prod) => {
  const image = document.createElement("div");
  image.classList.add("image");
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove", "fas", "fa-times");
  removeButton.type = "button";
  image.appendChild(removeButton);
  const img = document.createElement("img");
  img.src = `http://127.0.0.1:8000${prod.primary_image}`;
  image.appendChild(img);
  imageWrapper.querySelector(".images").appendChild(image);
};

const createOptionElement = ({ id, name }, categoryId) => {
  const option = document.createElement("option");
  option.value = id;
  option.textContent = name;
  if (id?.toString() === categoryId?.toString()) option.selected = true;
  return option;
};

const handleFormSubmit = async (e, product) => {
  console.log(product);
  e.preventDefault();
  const description = productDescription.value
    .split("\n")
    .map((desc) => desc.trim())
    .filter((desc) => desc.length !== 0)
    .join(". ");
  const updatedProduct = {
    ...product,
    id: productId,
    name: productNameField.value,
    price: Number(productPriceField.value),
    description,
    category: Number(categoryList.value),
    in_stock: Number(productStockField.value),
    primary_image: imageField.files[0].name,
  };
  const auth = JSON.parse(localStorage.getItem("access"));
  console.log(updatedProduct);
  await postDataToDb(`updateproduct`, updatedProduct, auth);
  displayMsg("Product has been updated successfully...", "success", 4000);
};

document.addEventListener("DOMContentLoaded", init);
