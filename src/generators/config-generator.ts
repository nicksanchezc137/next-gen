import { GLOBAL_STYLES, TAILWIND_CONFIG } from "../templates/config";

export class ConfigGenerator {
  constructor() {}

  generateConfigs() {
    return [TAILWIND_CONFIG(),GLOBAL_STYLES()];
  }
}
