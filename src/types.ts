type Field = {
  name: string;
  type: string;
  required: boolean;
  visibleOnList: boolean;
};
type Operations = {
  CREATE: boolean;
  READ: boolean;
  UPDATE: boolean;
  DELETE: boolean;
};
type Model = {
  name: string;
  includeTimeStamps: boolean;
  belongsTo: string[];
  fields: Field[];
  operations: Operations;
};
type MainConfig = {
  projectName:string;
  dropTables:boolean;
  db:{host:string,user:string,password:string,database:string}
  models: Model[];
};

type FieldImplementation = "db" | "ui";

type FieldImplementationConstant = {
  UI: FieldImplementation;
  DB: FieldImplementation;
};

type MarkUp = {
  contents: string;
  fileName: string;
  modelName: string;
};

type FileToGenerate = {
  fileName: string;
  contents: string;
  path: string;
};

export type {
  MainConfig,
  Model,
  Field,
  Operations,
  FieldImplementation,
  FieldImplementationConstant,
  MarkUp,
  FileToGenerate
};
