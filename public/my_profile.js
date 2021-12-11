import { getDataFromDb } from "./js/apiCalls.js";

const createTagWithOptions = (options) => {
  const tag = document.createElement(options.tag);
  tag.textContent = options.text;
  return tag;
};

const init = async () => {
  const app = document.querySelector(".profile_container");
  const accessToken = JSON.parse(localStorage.getItem("access"));
  if (!accessToken) return alert("Please Login....");
  const user = await getDataFromDb("getuser", accessToken);
  console.log(user);
  app.appendChild(displayUserInfo(user));
};

const displayUserInfo = (user) => {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(
    createTagWithOptions({ tag: "h1", text: `Username: ${user.username}` })
  );
  fragment.appendChild(
    createTagWithOptions({ tag: "p", text: `Email: ${user.email}` })
  );
  fragment.appendChild(
    createTagWithOptions({ tag: "p", text: `City: ${user.profile.city}` })
  );
  fragment.appendChild(
    createTagWithOptions({
      tag: "p",
      text: `Phone No.: ${user.profile.phoneno}`,
    })
  );
  return fragment;
};

document.addEventListener("DOMContentLoaded", init);
