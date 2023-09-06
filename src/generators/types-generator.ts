import { GENERAL_TYPES } from "../templates/types";

export class TypesGenerator {
  constructor() {}

  generateTypesCode() {
    return [GENERAL_TYPES()];
  }
}
