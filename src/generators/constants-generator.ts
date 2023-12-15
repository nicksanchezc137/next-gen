import { GENERAL_CONSTANTS } from "../templates/constants";
import { Model } from "../types";

export class ConstantsCodeGenerator {
  models: Model[];
  constructor(models: Model[]) {
    this.models = models;
  }

  getConstantsCode() {
    return [GENERAL_CONSTANTS(this.models)];
  }
}
