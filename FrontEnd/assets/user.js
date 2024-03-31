import { startEditingHandler } from "../index.js";
import { insertDiv } from "./helpers.js";

export let user = { loggedIn: false };

export function checkUserLogin() {
  function logout(event) {
    event.target?.removeEventListener("click", logout);
    sessionStorage.clear();
    window.location.replace(window.location.origin);
  }

  if (sessionStorage.getItem("token")) {
    user = {
      loggedIn: true,
      userId: sessionStorage.getItem("userId") ?? undefined,
      token: sessionStorage.getItem("token") ?? undefined,
    };

    const loginButton = document.getElementById("nav-login-button");
    loginButton &&
      (loginButton.textContent = "logout") &&
      (loginButton.href = window.location.origin);
    loginButton?.addEventListener("click", logout);
  }

  user.loggedIn && displayEditUi();
}

function displayEditUi() {
  const portfolioTitle = document.querySelector("#portfolio h2");
  const buttonHtml = `
        <button id="editButton"><i class="fa-regular fa-pen-to-square"></i>modifier</button>
    `;
  portfolioTitle?.insertAdjacentHTML("beforeend", buttonHtml);
  const editButton = document.getElementById("editButton");

  editButton?.addEventListener("click", startEditingHandler);

  //Supprimer la barre de filtres et tous les event listeners attachés
  const filterBar = document.getElementById("filtersContainer");
  filterBar?.replaceWith(filterBar?.cloneNode());
  document.getElementById("filtersContainer")?.remove();
  // Ajuster la marge entre la gallerie et le titre
  document.querySelector(".gallery")?.classList.add("edit-mode");
  //Ajouter le bandeau Mode Edition
  const body = document.querySelector("body");
  const editModeBanner = insertDiv(body, "beforebegin", "edit-mode-banner");
  const editModeBannerContent = insertDiv(
    editModeBanner,
    "afterbegin",
    "edit-mode-banner-content"
  );
  editModeBannerContent.insertAdjacentHTML(
    "afterbegin",
    '<i class="fa-regular fa-pen-to-square"></i>'
  );
  editModeBannerContent.insertAdjacentHTML("beforeend", "<p>Mode édition</p>");
}
