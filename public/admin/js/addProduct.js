import { getDataFromDb, postDataToDb, postDTB } from "../../js/apiCalls.js";
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
  const stock = Number(productStockField.value);
  if (stock < 0) {
    alert("Stock can not be in negative");
    return;
  }
  const auth = JSON.parse(localStorage.getItem("access"));
  console.log(form);
  await postDTB("insertproduct", form, auth);
  displayMsg("Product has been added", "success", 4000);
};

document.addEventListener("DOMContentLoaded", init);
