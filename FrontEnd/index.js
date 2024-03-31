import { getDataSet, displayWorks } from "./assets/helpers.js";
import filters from "./assets/filters.js";
import openModal from "./assets/modal.js";
import { checkUserLogin, user } from "./assets/user.js";

// check login

// fetch data

export const dataSet = await getDataSet(["categories", "works"]);
const categoriesSet = dataSet.categories?.map((category) => category.name);
console.log("Set of categories : " + categoriesSet);

// filters
export let displayedWorks = dataSet.works;
export const setDisplayedWorks = (works) => (displayedWorks = works);
filters(categoriesSet);

// gallery
displayWorks(displayedWorks);

// edit

export const startEditingHandler = async function () {
  () => console.log("start editing");

  const editButton = document.getElementById("editButton");
  editButton?.replaceWith(editButton.cloneNode(true));

  openModal();

  return modalContainer;
};

checkUserLogin();
console.log("userLoggedIn : ", user.loggedIn);
//Afficher le bouton modifier et remplacer login par logout + le bandeau et enlever les filtres

/* ## TODO ##

Clean CSS

 */
