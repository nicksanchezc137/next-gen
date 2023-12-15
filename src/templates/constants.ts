import { Model } from "../types";

export const GENERAL_CONSTANTS = (models: Model[]) => {
  return {
    contents: `
      export const MODEL_SETUP = ${JSON.stringify(models)};
    
      
      export const TIME_STAMP_FIELDS = ["updated_at", "deleted_at", "created_at"];
      
      `,
    fileName: "general.constants.ts",
    path: "path",
  };
};
