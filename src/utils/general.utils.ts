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
function getChildModels(models: Model[], modelName: string): string[] {
  let childModels: string[] = [];
  models.forEach((model) => {
    if (model.belongsTo.includes(modelName)) {
      childModels.push(model.name);
    }
  });
  return childModels;
}
export {
  capitalizeFirstLetter,
  getModelChildrenFromModelParent,
  getChildModels,
};
