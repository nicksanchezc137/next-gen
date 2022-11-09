import { Model } from "../types";

function capitalizeFirstLetter(word: string) {
  word = word.toLocaleLowerCase();
  return word.charAt(0).toUpperCase() + word.slice(1);
}
function getModelChildrenFromModelParent(
  parentModelName: string,
  models: Model[]
) {
  return models
    .filter((model) => model.belongsTo.includes(parentModelName))
    .map((model) => model.name);
}
export { capitalizeFirstLetter, getModelChildrenFromModelParent };
