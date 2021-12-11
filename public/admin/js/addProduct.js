import { getDataFromDb, postDataToDb } from "../../js/apiCalls.js";
import { displayMsg } from "../../js/dataFunctions.js";

/* Grabbing UI Fields */
const form = document.querySelector(".add-product");
const productNameField = document.getElementById("product-name");
const productPriceField = document.getElementById("product-price");
const productStockField = document.getElementById("product-stock");
const imageWrapper = document.querySelector(".product-images");
const imageField = document.getElementById("product-images");
const productDescription = document.getElementById("product-description");
const categoryList = document.getElementById("category-list");

const init = async () => {
  const categories = await getDataFromDb("");
  updateFields(categories);
  form.addEventListener("submit", (e) => {
    handleFormSubmit(e);
  });
};

const updateFields = (categories) => {
  console.log(categories);
  const options = [{ id: null, name: "select category..." }, ...categories].map(
    (category) => createOptionElement(category)
  );
  options.forEach((option) => categoryList.appendChild(option));
};

const createOptionElement = ({ id, name }) => {
  const option = document.createElement("option");
  option.value = id;
  option.textContent = name;
  return option;
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  const description = productDescription.value
    .split("\n")
    .map((desc) => desc.trim())
    .filter((desc) => desc.length !== 0)
    .join(". ");
  const stock = Number(productStockField.value);
  if (stock < 0) {
    alert("Stock can not be in negative");
    return;
  }
  console.log(imageField.value);
  const auth = JSON.parse(localStorage.getItem("access"));
  const product = {
    name: productNameField.value,
    category: categoryList.value,
    price: Number(productPriceField.value),
    primary_image: imageField.value,
    description,
    in_stock: stock,
  };
  await postDataToDb("insertproduct", product, auth);
  displayMsg("Product has been added", "success", 4000);
};

document.addEventListener("DOMContentLoaded", init);
