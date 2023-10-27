import {
  API_ROUTE,
  CONTROLLER_CLASS,
  CREATE_CONTROLLER_METHOD,
  CREATE_MODEL_METHOD,
  DB_CONFIG,
  DELETE_CONTROLLER_METHOD,
  FIND_ALL_CONTROLLER_METHOD,
  FIND_ALL_MODEL_METHOD,
  FIND_ALL_THAT_BELONG_TO_CONTROLLER_METHOD,
  FIND_ALL_THAT_BELONG_TO_MODEL_METHOD,
  FIND_ONE_CONTROLLER_METHOD,
  FIND_ONE_MODEL_METHOD,
  MODEL_CLASS,
  UPDATE_CONTROLLER_METHOD,
  UPDATE_MODEL_METHOD,
} from "../templates/apis";
import { MainConfig, Model } from "../types";
import {
  capitalizeFirstLetter,
  getModelChildrenFromModelParent,
} from "../utils/general.utils";
var pluralize = require("pluralize");

export class APIGenerator {
  models: Model[];
  mainConfig: MainConfig;

  constructor(mainConfig: MainConfig) {
    this.models = mainConfig.models;
    this.mainConfig = mainConfig;
  }
  generateController(model: Model) {
    return CONTROLLER_CLASS(model.name, this.generateControllerMethods(model));
  }
  generateControllerMethods(model: Model) {
    let controllerMethods = "";
    if (model.operations.CREATE) {
      controllerMethods += CREATE_CONTROLLER_METHOD(model.name);
    }
    if (model.operations.UPDATE) {
      controllerMethods += UPDATE_CONTROLLER_METHOD(model.name);
    }
    if (model.operations.READ) {
      controllerMethods += FIND_ONE_CONTROLLER_METHOD(model.name);
      controllerMethods += FIND_ALL_CONTROLLER_METHOD(model.name);
      if (model.belongsTo.length) {
        controllerMethods += FIND_ALL_THAT_BELONG_TO_CONTROLLER_METHOD(model.name);
      }
    }
    if (model.operations.DELETE) {
      controllerMethods += DELETE_CONTROLLER_METHOD(model.name);
    }
    return controllerMethods;
  }

  generateControllerClasses() {
    let controllers: any = [];
    this.models.forEach((model) => {
      controllers.push({
        ...this.generateController(model),
        path: "controllers",
      });
    });
    return controllers;
  }

  generateModelClass(model: Model) {
    return MODEL_CLASS(model.name, this.generateModelMethods(model));
  }

  generateModelMethods(model: Model) {
    let modelMethods = "";
    if (model.operations.CREATE) {
      modelMethods += CREATE_MODEL_METHOD(model.name);
    }
    if (model.operations.UPDATE) {
      modelMethods += UPDATE_MODEL_METHOD(model.fields, model.name,model.belongsTo);
    }
    if (model.operations.READ) {
      modelMethods += FIND_ONE_MODEL_METHOD(model.name);
      modelMethods += FIND_ALL_MODEL_METHOD(model.name);
      if (model.belongsTo.length) {
        modelMethods += FIND_ALL_THAT_BELONG_TO_MODEL_METHOD(model.name);
      }
    }
    return modelMethods;
  }

  generateModelClasses() {
    let modelClasses: { fileName: string; contents: string; path: string }[] =
      [];
    this.models.forEach((model) => {
      modelClasses.push({ ...this.generateModelClass(model), path: "models" });
    });
    return modelClasses;
  }

  generateAPIRoutes() {
    return this.models.map((model) => {
      return {
        ...API_ROUTE(
          model,
          getModelChildrenFromModelParent(model.name, this.models)
        ),
        path: "",
      };
    });
  }

  generateAPIs() {
    return [
      { ...DB_CONFIG(this.mainConfig), path: "db" },
      ...this.generateAPIRoutes(),
      ...this.generateControllerClasses(),
      ...this.generateModelClasses(),
    ];
  }
}
