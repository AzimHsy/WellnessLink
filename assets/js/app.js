const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

// Check localStorage for the sign-up mode state
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("signUpMode") === "true") {
    container.classList.add("sign-up-mode");
  }
});

// When clicking sign-up, store the state
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
  localStorage.setItem("signUpMode", "true"); // Store state
});

// When clicking sign-in, remove the state
sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
  localStorage.setItem("signUpMode", "false"); // Remove state
});
