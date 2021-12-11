import {
  getDataFromDb,
  replaceDataInDb,
  updateDataInDb,
} from "../../js/apiCalls.js";
import { displayMsg } from "../../js/dataFunctions.js";

const categoryId = new URLSearchParams(window.location.search).get("id");

/* Grabbing UI elements */
const form = document.querySelector(".edit-category");
const categoryNameField = document.getElementById("category-name");
const itemsList = document.querySelector(".items");
const listItemTemplate = document.querySelector("[data-item]");

const init = async () => {
  const category = (await getDataFromDb("")).find(
    (category) => category.id.toString() === categoryId
  );
  const products = (await getDataFromDb(`products`)).filter(
    (prod) => prod.categoryId.toString() === categoryId
  );

  updateNameField(category);
  createProductsListAndAddToDOM(products);
  form.addEventListener("submit", updateCategory);
};

const updateNameField = (category) => {
  categoryNameField.value = category.name;
};

const createProductsListAndAddToDOM = (products) => {
  const lis = products.map((product) => createProductListItem(product));

  lis.forEach((li) => itemsList.appendChild(li));
};

const createProductListItem = ({ id, name, primary_image: img }) => {
  const li = listItemTemplate.content.firstElementChild.cloneNode(true);
  const itemImage = li.querySelector(".item__image");
  const itemName = li.querySelector(".item__name");
  // const itemDeleteBtn = li.querySelector(".item__delete-btn");
  li.setAttribute("data-id", id);
  itemImage.src = `http://127.0.0.1:8000${img}`;
  itemImage.alt = name;
  itemName.textContent = name;
  // itemDeleteBtn.title = `Remove this product from ${categoryNameField.value}`;
  // itemDeleteBtn.setAttribute("aria-label", `Remove ${name} from this category`);
  // itemDeleteBtn.addEventListener("click", () => removeItemFromThisCategory(id));
  return li;
};

// const removeItemFromThisCategory = async (id) => {
//   await updateDataInDb(`products/${id}`, { categoryId: null });
//   itemsList.removeChild(itemsList.querySelector(`[data-id="${id}"]`));
//   displayMsg(
//     "product has been successfully removed from this category...",
//     "success",
//     4000
//   );
// };

const updateCategory = async (e) => {
  e.preventDefault();
  const data = {
    name: categoryNameField.value,
    id: categoryId,
  };
  const auth = JSON.parse(localStorage.getItem("access"));
  const res = await replaceDataInDb(`updatecategory`, data, auth);
  console.log(res);
  displayMsg("Category name has been successfully changed...", "success", 4000);
};

document.addEventListener("DOMContentLoaded", init);
