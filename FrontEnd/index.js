import { getDataSet, displayWorks } from "./assets/helpers.js";
import filters, { displayedWorks } from "./assets/filters.js";
import { checkUserLogin, user } from "./assets/user.js";

export const dataSet = await getDataSet(["categories", "works"]);
const categoriesSet = dataSet.categories?.map((category) => category.name);
console.log("Set of categories : " + categoriesSet);

filters(categoriesSet);

displayWorks(displayedWorks);

checkUserLogin();
console.log("userLoggedIn : ", user.loggedIn);
