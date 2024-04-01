import {
  insertDiv,
  workEdited,
  displayWorks,
  setWorkEdited,
  apiUrl,
  displayMessage,
  getDataSet,
  deleteHandler,
} from "./helpers.js";
import { dataSet } from "../index.js";
import { user, startEditingHandler } from "./user.js";

const modalHtmlContent = `
<div id="edit-nav">

    <i id="edit-close-button" class="fa-solid fa-xmark"></i>
</div>
<div id="modal-content">

    <h2>Galerie Photo</h2>
    <div id="edit-gallery"></div>
    <button id="add-picture-button">Ajouter une photo</button>
</div>

`;

const addWorkModalHtmlContent = `
<div id="modal-content">
    <h2>Ajout Photo</h2>
    <form id="add-work-form" class="form" action="">
        <label for="add-work-file" id="add-work-file-label">
            <i class="fa-regular fa-image"></i>
            <div>
                + Ajouter une photo
            </div>
            <p>jpg, png : 4mo max</p>
        </label>
        <input type="file" id="add-work-file" accept=".png, .jpg" required name="image">

        <label for="add-work-title">Titre</label>
        <input type="text" id="add-work-title" name="title" required>

        <label for="add-work-category">Catégorie</label>
        <div class="select-container">

            <select name="category" id="add-work-category" required>
                <option disabled selected value>--Choisir une catégorie--</option>
            </select>
        </div>
        <button id="add-picture-button" class=" button disactivated" type="submit">Valider</button>
    </form>
</div>

`;

export default async function openModal() {
  //container
  const body = document.querySelector("head");
  const modalContainer = insertDiv(body, "afterend", "modalContainer");
  insertDiv(modalContainer, "afterbegin", "modal");

  //   modal?.insertAdjacentHTML("afterbegin", modalHtmlContent);

  editModal();
}

async function editModal() {
  //ajoute ou remplace le contenu de la modale
  const modal = document.getElementById("modal");
  const editModalContent = modal.cloneNode();
  editModalContent.insertAdjacentHTML("afterbegin", modalHtmlContent);
  modal.replaceWith(editModalContent);

  //gallery
  const modalGallery = document.getElementById("edit-gallery");
  console.log("is workEdited : ", workEdited);
  displayWorks(
    workEdited ? (await getDataSet(["works"])).works : dataSet.works,
    modalGallery,
    false,
    true
  );
  // delete buttons
  const figcaptions = document.querySelectorAll(
    "#edit-gallery figcaption, #edit-gallery figcaption i"
  );
  for (const figcaption of figcaptions) {
    figcaption.addEventListener("click", (event) => deleteHandler(event, user));
  }
  // ajouter une image
  document
    .getElementById("add-picture-button")
    ?.addEventListener("click", addWorkHandler);
  //fermer la modale
  const closeEditButton = document.getElementById("edit-close-button");
  closeEditButton?.addEventListener("click", closeEditHandler);
}

function addWorkModal() {
  //change le contenu de la modale
  const modalContent = document.getElementById("modal-content");
  const addWorkContent = modalContent.cloneNode();
  addWorkContent.insertAdjacentHTML("afterbegin", addWorkModalHtmlContent);
  modalContent.replaceWith(addWorkContent);

  // navigation de la modale
  function modalNavBack() {
    editModal();
  }
  document
    .getElementById("edit-nav")
    ?.insertAdjacentHTML(
      "afterbegin",
      '<i class="fa-solid fa-arrow-left" id="edit-nav-back" ></>'
    );
  document
    .getElementById("edit-nav-back")
    ?.addEventListener("click", modalNavBack);

  //Selection du fichier
  document
    .querySelector('label[for="add-work-file"]')
    ?.addEventListener("click", selectFileHandler);

  // Validation des input
  const requiredInputs = document.querySelectorAll(
    "input[required], select[required]"
  );
  console.log(requiredInputs);
  for (const input of requiredInputs) {
    if (input.getAttribute("type") === "text") {
      input?.addEventListener("input", addWorkFormValidate);
    } else {
      input?.addEventListener("change", addWorkFormValidate);
    }
  }

  //Catégories pour le dropdown
  const selectCategoryInput = document.getElementById("add-work-category");

  if (dataSet.categories) {
    for (const category of dataSet.categories) {
      selectCategoryInput.insertAdjacentHTML(
        "beforeend",
        `<option value= "${category.id}">${category.name}</option>`
      );
    }
  }
  //Valider l'ajout
  const submitWorkButton = document.getElementById("add-picture-button");
  submitWorkButton?.addEventListener("click", submitWorkHandler);
}

async function addWorkHandler(event) {
  const targetButton = event.target;
  targetButton?.removeEventListener("click", addWorkHandler);

  addWorkModal();
}

async function closeEditHandler() {
  document
    .getElementById("editButton")
    ?.addEventListener("click", startEditingHandler);

  //Supprimer tous les event listeners de la modale
  const modalContainer = document.getElementById("modalContainer");
  modalContainer?.replaceWith(modalContainer.cloneNode(true));
  document.getElementById("modalContainer")?.remove();

  //Refresh le contenu de la page en respectant le filtre selectionné
  if (workEdited) {
    const freshData = (await getDataSet(["works"])).works;
    dataSet.works = freshData;

    const currentFilter = document.querySelector(
      ".filterButton.clickedButton"
    )?.id;
    console.log("current filter : ", currentFilter);
    //   currentFilter &&
    //     freshData &&
    //     displayWorks(filterProjects(currentFilter, freshData));
    //   currentFilter && freshData &&
    displayWorks(freshData);
    setWorkEdited(false);
  }
}

function addWorkFormValidate() {
  const form = document.getElementById("add-work-form");
  const formIsValid = form.checkValidity();
  const validateButton = document.getElementById("add-picture-button");
  formIsValid && validateButton?.classList.remove("disactivated");
  if (
    !formIsValid &&
    !validateButton?.classList.toString().match("disactivated")
  ) {
    console.log("form is valid : ", formIsValid);
    validateButton?.classList.add("disactivated");
  }
}

async function submitWorkHandler(event) {
  event.preventDefault();
  const form = document.getElementById("add-work-form");
  const postData = new FormData(form);
  const response = await fetch(apiUrl + "works", {
    method: "POST",
    body: postData,
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  response.status === 201 &&
    setWorkEdited(true) &&
    displayMessage("Photo Ajoutée");

  const responseLog = {
    201: "work created",
    400: "Bad request",
    401: "unauthorized",
    500: "unexpected error",
  };
  console.log(
    Object.keys(responseLog).includes(response.status.toString())
      ? responseLog[response.status]
      : "unexpected server response"
  );
}

function selectFileHandler(event) {
  const fileInputLabel = event.target;
  const fileInputId = fileInputLabel.getAttribute("for");
  const fileInput = fileInputId
    ? document.getElementById(fileInputId)
    : undefined;
  fileInput && (fileInput.value = "");

  function displayFilePicture(event) {
    const target = event.target;
    const fileUrl = target.files && URL.createObjectURL(target.files[0]);
    console.log(fileUrl, typeof fileUrl);
    document.getElementById("file-img-preview")?.remove();
    fileInputLabel?.insertAdjacentHTML(
      "afterbegin",
      `<img src="${fileUrl}" id="file-img-preview" />`
    );
    const ajouterButton = document.querySelector("#add-work-file-label div");
    ajouterButton?.classList.add("notVisible");
  }

  fileInput?.addEventListener("change", displayFilePicture);
}
