import { displayWorks } from "./assets/helpers.js";
import filters, { displayedWorks } from "./assets/filters.js";
import { checkUserLogin } from "./assets/user.js";
import { categoriesSet } from "./assets/data.js";

filters(categoriesSet);

displayWorks(displayedWorks);

checkUserLogin();
