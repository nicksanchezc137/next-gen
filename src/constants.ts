import { FieldImplementationConstant } from "./types";

export const CONFIG_FILE_NAME = "next-gen.json";

export const OPS = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

export const FIELD_TYPES = {
  TEXT: "TEXT",
  LONG_TEXT: "LONG_TEXT",
  NUMBER: "NUMBER",
  DOUBLE: "DOUBLE",
  BOOLEAN: "BOOLEAN",
  DATE_TIME:"DATE_TIME"
};
export const FIELD_TYPE_MAPPING :any= {
  TEXT: { ui: "text", db: "VARCHAR(255)" },
  LONG_TEXT: { ui: "text", db: "VARCHAR(3000)" },
  NUMBER: { ui: "number", db: "INT" },
  DOUBLE: { ui: "number", db: "DOUBLE" },
  BOOLEAN: { ui: "checkbox", db: "TINYINT" },
  DATE_TIME:{ui:"",db:"TIMESTAMP"}
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

export const PROJECT_COMMANDS = ["npm i mysql", "npm install -D tailwindcss postcss autoprefixer","npx tailwindcss init -p", "npm i pluralize","npm i @fortawesome/react-fontawesome","npm i moment"]