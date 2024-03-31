// import { user } from "./user.js";

// GLOBALS

export let workEdited = false;
export const setWorkEdited = (isWorkEdited) => (workEdited = isWorkEdited);

async function getData(apiUrl, dataType) {
  const response = await fetch(apiUrl + dataType);
  return await response.json();
}

export const getDataSet = async function (dataTypes) {
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

// TYPES

export const isCategory = function (categoriesArray) {
  const isCategory = [];
  for (const obj of categoriesArray) {
    if ("id" in obj && "name" in obj) {
      isCategory.push(true);
    } else {
      isCategory.push(false);
    }
  }
  return !isCategory.includes(false);
};

//Helpers

export const createWorkFigure = function (
  work,
  figcaptionContent = true,
  figcaptionId = false
) {
  const workFigure = document.createElement("figure");

  workFigure.innerHTML = ` 
    <img src="${work.imageUrl}" alt="${work.title}">
    <figcaption ${figcaptionId ? `id="${work.id}"` : ""} >${
    figcaptionContent ? work.title : ""
  }</figcaption>
    `;
  return workFigure;
};

// export async function importHTMLasString(url) {
//   const response = await fetch(url);
//   const htmlContent = await response.text();
//   return htmlContent;
// }

export const insertDiv = function (targetElement, position, divId) {
  const div = document.createElement("div");
  div.id = divId;
  targetElement.insertAdjacentElement(position, div);
  console.log("created element : ", divId);
  return div;
};

export const displayWorks = function (
  worksToDisplay,
  target = document.querySelector(".gallery"),
  figcaptionContent = true,
  figcaptionId = false
) {
  if (worksToDisplay !== undefined) {
    target && (target.innerHTML = "");
    console.log("works to display : ", worksToDisplay);

    for (const work of worksToDisplay) {
      const workFigure = createWorkFigure(
        work,
        figcaptionContent,
        figcaptionId
      );

      target?.append(workFigure);
    }
  } else {
    console.log("no work to display !");
  }
};

export function displayMessage(message) {
  alert(message);
}

export async function deleteWork(event, user) {
  const eventTarget = event.target;
  const workToDeleteId =
    eventTarget.id === "" ? eventTarget.parentElement?.id : eventTarget.id;
  console.log("delete event target : ", eventTarget);
  console.log("delete request : ", apiUrl + "works/" + workToDeleteId);

  const response = await fetch(apiUrl + "works/" + workToDeleteId, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: Number(user.userId),
    }),
  });
  console.log("delete response : ", response.status);

  switch (response.status) {
    case 204:
      console.log("work id : " + workToDeleteId + " deleted");
      eventTarget.removeEventListener("click", deleteHandler);
      eventTarget.parentElement?.remove();
      setWorkEdited(true);
      return false;
    case 401:
    case 500:
      return response.status === 401
        ? console.log("delete unauthorized")
        : console.log("unexpected behavior");
    default:
      console.log("unexpected server response");
      return false;
  }
}

export const deleteHandler = (event, user) => {
  event.target?.removeEventListener("click", deleteHandler);
  deleteWork(event, user);
};
// PATH & URL
export const apiUrl = "http://localhost:5678/api/";

// export const headerUrl = new URL(window.location.origin + "/assets/header");
// export const footerUrl = new URL(window.location.origin + "/assets/footer");
// export const modalEditUrl = new URL(
//   window.location.origin + "/assets/modal-edit"
// );
// export const modalAddWorkUrl = new URL(
//   window.location.origin + "/assets/modal-addWork"
// );
