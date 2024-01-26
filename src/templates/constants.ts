import { MainConfig, Model } from "../types";

export const GENERAL_CONSTANTS = (config: MainConfig) => {
  return {
    contents: `
      export const MODEL_SETUP = ${JSON.stringify(config.models)};
    
      
      export const TIME_STAMP_FIELDS = ["updated_at", "created_at"];

      export const PROJECT_NAME = "${config.projectName}";
      
      `,
    fileName: "general.constants.ts",
    path: "path",
  };
};
