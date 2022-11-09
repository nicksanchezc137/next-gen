import { FieldImplementationConstant } from "./types";

export const CONFIG_FILE_NAME = "next-gen.json";

export const OPS = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

export const FIELD_TYPES = {
  STRING: "STRING",
  NUMBER: "NUMBER",
  DOUBLE: "DOUBLE",
  BOOLEAN: "BOOLEAN",
};
export const FIELD_TYPE_MAPPING :any= {
  STRING: { ui: "text", db: "VARCHAR(255)" },
  NUMBER: { ui: "number", db: "INT" },
  DOUBLE: { ui: "number", db: "DOUBLE" },
  BOOLEAN: { ui: "checkbox", db: "TINYINT" },
};

export const FIELD_IMPLEMENTATION_TYPES: FieldImplementationConstant = {
  UI: "ui",
  DB: "db",
};

export const PAGE_TYPE = {
  UPDATE: "UPDATE",
  READ: "READ",
  CREATE: "CREATE",
};

export const IN_PROJECT_COMMANDS = ["npm i mysql", "npm install -D tailwindcss postcss autoprefixer","npx tailwindcss init -p", "npm i pluralize","npm i @fortawesome/react-fontawesome","npm i react-table"]