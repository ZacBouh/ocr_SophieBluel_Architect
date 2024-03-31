// GLOBALS

export let user = { loggedIn: false };
export let workEdited = false;
export const setWorkEdited = (isWorkEdited) => (workEdited = isWorkEdited);

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
}

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

export async function importHTMLasString(url) {
  const response = await fetch(url);
  const htmlContent = await response.text();
  return htmlContent;
}

export const insertDiv = function (targetElement, position, divId) {
  const div = document.createElement("div");
  div.id = divId;
  targetElement.insertAdjacentElement(position, div);
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

export const deleteHandler = (event) => {
  event.target?.removeEventListener("click", deleteHandler);
  deleteWork(event, user);
};

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

// PATH & URL
export const apiUrl = "http://localhost:5678/api/";

export const headerUrl = new URL(window.location.origin + "/assets/header");
export const footerUrl = new URL(window.location.origin + "/assets/footer");
export const modalEditUrl = new URL(
  window.location.origin + "/assets/modal-edit"
);
export const modalAddWorkUrl = new URL(
  window.location.origin + "/assets/modal-addWork"
);
