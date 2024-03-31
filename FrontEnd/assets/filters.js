import { dataSet, displayedWorks, setDisplayedWorks } from "../index.js";
import { displayWorks } from "./helpers.js";

export default function filters(categoriesSet) {
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
}

const filterHandler = function (event) {
  if (dataSet.works !== undefined && event.target) {
    const target = event.target;

    document
      .querySelector(".filterButton.clickedButton")
      ?.classList.remove("clickedButton");

    target.classList.add("clickedButton");

    const projectType = target.id;

    if (projectType === "tous") {
      setDisplayedWorks(dataSet.works);
    } else {
      filterProjects(projectType, dataSet.works);
    }

    // (document.querySelector('.gallery') as HTMLElement).innerHTML = ''
    displayWorks(displayedWorks);

    console.log("displayed works : ", displayedWorks);
  }
};

const filterProjects = function (projectType, data) {
  const works = Array.from(data);
  const filteredWorks = works.filter((work) => {
    return projectType === "tous" ? true : work.category.name === projectType;
  });
  console.log("filter result : ", filteredWorks);
  setDisplayedWorks(filteredWorks);
  return filteredWorks;
};
