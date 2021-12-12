import { postDataToDb } from "../../js/apiCalls.js";
import { displayMsg } from "../../js/dataFunctions.js";

/* Grabbing UI Fields */

const init = () => {
  const form = document.querySelector(".add-category");
  form.addEventListener("submit", (e) => {
    handleFormSubmit(e);
  });
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  const categoryNameField = document.getElementById("category-name");
  const auth = JSON.parse(localStorage.getItem("access"));
  const data = { name: categoryNameField.value };
  await postDataToDb("insertcategory", data, auth);
  displayMsg("Category has been added", "success", 4000);
};

document.addEventListener("DOMContentLoaded", init);
