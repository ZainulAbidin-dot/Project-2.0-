import { displayMsg, throwError } from "./dataFunctions.js";
import { getDataFromDb, postDataToDb } from "./apiCalls.js";
import { setDataToLS } from "./localStorage.js";

import {
  clearFields,
  validateEmail,
  validateName,
  validatePhoneNumber,
  validateAddress,
} from "./formValidations.js";

/* Form slide animations */
const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const container = document.getElementById("container");
signUpBtn.addEventListener("click", function () {
  container.classList.add("right-panel-active");
});
signInBtn.addEventListener("click", function () {
  container.classList.remove("right-panel-active");
});

const signInForm = document.getElementById("sign-in-form");
const signUpForm = document.getElementById("sign-up-form");
// const forgetPassword = document.getElementById("forget-password");

const handleSignIn = async (e) => {
  const username = signInForm.querySelector('input[type="text"]').value;
  const password = signInForm.querySelector('input[type="password"]').value;
  e.preventDefault();
  const authenticate = await postDataToDb("api/token/", { username, password });
  console.log(authenticate);

  if (!authenticate.access) {
    return alert("Invalid email password combination");
  } else if (username === "zain" && password === "zain") {
    localStorage.setItem("access", JSON.stringify(authenticate.access));
    window.location.href = "http://127.0.0.1:5500/public/admin/admin.html";
  } else {
    localStorage.setItem("access", JSON.stringify(authenticate.access));
    window.location.href = "http://127.0.0.1:5500/public";
  }
};

const validateForm = (
  nameField,
  emailField,
  cityField,
  phoneField,
  passwordField,
  confirmpasswordField
) => {
  // if (!validateName(nameField.value)) {
  //   alert("Please enter a valid name");
  //   return false;
  // }
  if (nameField.value < 3) {
    alert("Please enter a valid name");
    return false;
  }
  if (!validateEmail(emailField.value)) {
    alert("Please enter a valid email");
    return false;
  }
  if (cityField.value < 5) {
    alert("Please enter a valid city");
    return false;
  }
  if (!validatePhoneNumber(phoneField.value)) {
    alert("Please enter a valid phone number");
    return false;
  }
  if (passwordField.value.length < 8) {
    alert("passsword must be 8 characters long");
    return false;
  }
  if (!passwordField.value === confirmpasswordField.value) {
    alert("Please enter a valid password");
    return false;
  }
  return true;
};

const handleSignUp = async (e) => {
  e.preventDefault();
  const nameField = signUpForm.querySelector('input[type="text"]');
  const emailField = signUpForm.querySelector('input[type="email"]');
  const cityField = signUpForm.querySelector('input[id="city"]');
  const phoneField = signUpForm.querySelector('input[id="phone"]');
  const passwordField = signUpForm.querySelector('input[id="Password"]');
  const confirmpasswordField = signUpForm.querySelector(
    'input[id="Confirm_password"]'
  );
  if (
    !validateForm(
      nameField,
      emailField,
      cityField,
      phoneField,
      passwordField,
      confirmpasswordField
    )
  )
    return;
  await postDataToDb("createuser", {
    username: nameField.value,
    email: emailField.value,
    city: cityField.value,
    phone: phoneField.value,
    password: passwordField.value,
  });
  alert("user successfully created");
  clearFields(
    nameField,
    emailField,
    cityField,
    phoneField,
    passwordField,
    confirmpasswordField
  );
};

signInForm.addEventListener("submit", handleSignIn);
signUpForm.addEventListener("submit", handleSignUp);
