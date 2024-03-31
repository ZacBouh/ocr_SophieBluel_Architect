import {
  apiUrl,
  importHTMLasString,
  isCategory,
  insertDiv,
  user,
  displayWorks,
  modalEditUrl,
  checkUserLogin,
  deleteHandler,
  modalAddWorkUrl,
  workEdited,
  setWorkEdited,
  displayMessage,
} from "./assets/helpers";

//  TYPES

// GENERAL

// check si l'utilisateur est connecté

checkUserLogin();

console.log("userLoggedIn : ", user.loggedIn);

// IMPORT DES DONNEES

async function getData(apiUrl, dataType) {
  const response = await fetch(apiUrl + dataType);
  return await response.json();
}

const getDataSet = async function (dataTypes) {
  console.log("fetching fresh data ...");
  const dataSet = {};
  for (const dataType of dataTypes) {
    const data = await getData(apiUrl, dataType);
    if (isCategory(data)) {
      dataSet.categories = data;
    } else {
      dataSet.works = data;
    }
  }
  console.log("received fresh data : ", dataSet);
  return dataSet;
};

const dataSet = await getDataSet(["categories", "works"]);

const categoriesSet = dataSet.categories?.map((category) => category.name);

console.log("Set of categories : " + categoriesSet);

// TRI DES DONNEES

let displayedWorks = dataSet.works;

const filterProjects = function (projectType, data) {
  const works = Array.from(data);
  const filteredWorks = works.filter((work) => {
    return projectType === "tous" ? true : work.category.name === projectType;
  });
  console.log("filter result : ", filteredWorks);
  return filteredWorks;
};

const filterHandler = function (event) {
  if (dataSet.works !== undefined && event.target) {
    const target = event.target;

    document
      .querySelector(".filterButton.clickedButton")
      ?.classList.remove("clickedButton");

    target.classList.add("clickedButton");

    const projectType = target.id;

    if (projectType === "tous") {
      displayedWorks = dataSet.works;
    } else {
      displayedWorks = filterProjects(projectType, dataSet.works);
    }

    // (document.querySelector('.gallery') as HTMLElement).innerHTML = ''
    displayWorks(displayedWorks);

    console.log("displayed works : ", displayedWorks);
  }
};

//Afficher les filtres

if (categoriesSet) {
  const filtersContainer = document.createElement("div");
  filtersContainer.id = "filtersContainer";
  const button = document.createElement("button");
  button.id = "tous";
  button.textContent = "Tous";
  button.classList.add("filterButton", "clickedButton");

  button.addEventListener("click", filterHandler);

  filtersContainer.append(button);

  for (const category of categoriesSet) {
    const button = document.createElement("button");
    button.id = category;
    button.textContent = category;
    button.classList.add("filterButton");

    button.addEventListener("click", filterHandler);

    filtersContainer.append(button);
  }

  document
    .querySelector(".gallery")
    ?.insertAdjacentElement("beforebegin", filtersContainer);
}

// AFFICHER LES PROJETS
displayWorks(displayedWorks);

//MODIFIER LES PROJETS

const startEditingHandler = async function () {
  () => console.log("start editing");

  //Enlever l'event listener
  const editButton = document.getElementById("editButton");
  editButton?.replaceWith(editButton.cloneNode(true));

  //Ouverture de la modale modifier
  const body = document.querySelector("body");
  const modalContainer = body
    ? insertDiv(body, "beforebegin", "modalContainer")
    : undefined;
  const modal = modalContainer
    ? insertDiv(modalContainer, "afterbegin", "modal")
    : undefined;
  const modalHtmlContent = await importHTMLasString(modalEditUrl);
  modal?.insertAdjacentHTML("afterbegin", modalHtmlContent);

  const modalGallery = document.getElementById("edit-gallery");
  console.log("is workEdited : ", workEdited);
  displayWorks(
    workEdited ? (await getDataSet(["works"])).works : dataSet.works,
    modalGallery,
    false,
    true
  );

  const figcaptions = document.querySelectorAll(
    "#edit-gallery figcaption, #edit-gallery figcaption i"
  );
  for (const figcaption of figcaptions) {
    figcaption.addEventListener("click", deleteHandler);
  }

  document
    .getElementById("add-picture-button")
    ?.addEventListener("click", addWorkHandler);

  //Navigation de la modale
  async function closeEditHandler() {
    document
      .getElementById("editButton")
      ?.addEventListener("click", startEditingHandler);

    //Supprimer tous les event listeners de la modale
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
  const closeEditButton = document.getElementById("edit-close-button");
  closeEditButton?.addEventListener("click", closeEditHandler);

  //Ajouter une photo
  async function addWorkHandler(event) {
    const targetButton = event.target;
    targetButton?.removeEventListener("click", addWorkHandler);

    //Change le contenu de la modale
    async function insertModalContent(contentUrl) {
      const modalContent = document.getElementById("modal-content");
      modalContent && (modalContent.innerHTML = "");
      const addWorkModalHtmlContent = await importHTMLasString(contentUrl);
      modalContent?.insertAdjacentHTML("afterbegin", addWorkModalHtmlContent);
    }
    await insertModalContent(modalAddWorkUrl);
    //Ajoute le back button à la navbar de la modale
    function modalNavBack() {
      closeEditHandler();
      startEditingHandler();
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

    // Validation du formulaire
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

    //Ajouter les catégories au dropdown du formulaire
    const selectCategoryInput = document.getElementById("add-work-category");

    if (dataSet.categories) {
      for (const category of dataSet.categories) {
        selectCategoryInput.insertAdjacentHTML(
          "beforeend",
          `<option value= "${category.id}">${category.name}</option>`
        );
      }
    }

    //Envoyer la nouvelle photo
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
    const submitWorkButton = document.getElementById("add-picture-button");
    submitWorkButton?.addEventListener("click", submitWorkHandler);

    // Selectionner et Afficher la photo à ajouter
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
        const ajouterButton = document.querySelector(
          "#add-work-file-label div"
        );
        ajouterButton?.classList.add("notVisible");
      }

      fileInput?.addEventListener("change", displayFilePicture);
    }

    document
      .querySelector('label[for="add-work-file"]')
      ?.addEventListener("click", selectFileHandler);
  }

  return modalContainer;
};

//Afficher le bouton modifier et remplacer login par logout + le bandeau et enlever les filtres

if (user.loggedIn) {
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

/* ## TODO ##

Clean CSS

 */
