import { COMPONENT_LIST } from "../templates/components";
import { Model } from "../types";

export class ComponentGenerator {
  constructor() {}

  generateComponents(models:Model[]) {
    return COMPONENT_LIST(models);
  }
}
