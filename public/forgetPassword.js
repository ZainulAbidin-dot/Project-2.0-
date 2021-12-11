import { postDataToDb } from "./js/apiCalls.js";
import { validateEmail } from "./js/formValidations.js";

const form = document.querySelector("form");

const handleSubmit = async (e) => {
  e.preventDefault();
  const email = form.email.value;
  if (!validateEmail(email)) {
    console.log(email);
    alert("Please Enter a valid Email");
    return;
  }

  await postDataToDb("resetpassword", { email });
  alert("E-Mail has been Sent");
};
form.addEventListener("submit", handleSubmit);
