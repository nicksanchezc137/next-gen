import { GENERAL_CONSTANTS } from "../templates/constants";

export class ConstantsCodeGenerator {
  constructor() {}

  getConstantsCode() {
    return [GENERAL_CONSTANTS()];
  }
}
