import { GENERAL_CONSTANTS } from "../templates/constants";
import { MainConfig, Model } from "../types";

export class ConstantsCodeGenerator {
  models: Model[];
  config: MainConfig;
  constructor(config: MainConfig) {
    this.models = config.models;
    this.config = config;

  }

  getConstantsCode() {
    return [GENERAL_CONSTANTS(this.config)];
  }
}
