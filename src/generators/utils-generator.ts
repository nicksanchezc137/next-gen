import { GENERAL_UTILS, HANDLE_REQUEST } from "../templates/utils";

export class UtilsGenerator {
  constructor() {}

  generateUtilsCode() {
    return [HANDLE_REQUEST(), GENERAL_UTILS()];
  }
}
