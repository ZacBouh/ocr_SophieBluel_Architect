import { getDataSet } from "./helpers.js";

export const dataSet = await getDataSet(["categories", "works"]);
export const categoriesSet = dataSet.categories?.map(
  (category) => category.name
);
console.log("Set of categories : " + categoriesSet);
