import { Field, MainConfig, Model } from "../types";
import { capitalizeFirstLetter } from "../utils/general.utils";
var pluralize = require("pluralize");

export const DB_CONFIG = (mainConfig: MainConfig) => {
  const { host, user, password, database } = mainConfig.db;
  return {
    contents: `
      const mysql = require("mysql");
      var sql = mysql.createPool({
        host: "${host}",
        user: "${user}",
        password: "${password}",
        database: "${database}",
      });
      export {sql};
`,
    fileName: "db.ts",
  };
};

function generateBelongToRoutes(
  modelName: string,
  relatedModelNames: string[]
) {
  let template = (relatedModelName: string) => {
    return `
    if (req.url?.includes("${pluralize.plural(
      relatedModelName.toLowerCase()
    )}")) {
      let ${relatedModelName.toLowerCase()}Controller = new ${capitalizeFirstLetter(
      relatedModelName.toLowerCase()
    )}Controller();
    ${relatedModelName.toLowerCase()}Controller.findAllBelongTo(req, res, pluralize.singular(controllerName));
      return;
    }
  \n`;
  };
  let belongToCode = "";
  relatedModelNames.forEach(
    (relatedModelName) => (belongToCode += template(relatedModelName))
  );
  return belongToCode;
}
function generateBelongToControllerImports(relatedModelNames: string[]) {
  let template = (relatedModelName: string) => {
    return `import { ${capitalizeFirstLetter(
      relatedModelName
    )}Controller } from "./controllers/${pluralize
      .plural(relatedModelName)
      .toLowerCase()}.controller";
  \n`;
  };
  let belongToImportCode = "";
  relatedModelNames.forEach(
    (relatedModelName) => (belongToImportCode += template(relatedModelName))
  );
  return belongToImportCode;
}

export const API_ROUTE = (model: Model, modelChildrenNames: string[]) => {
  let fileName = `${pluralize.plural(model.name).toLowerCase()}.ts`;
  let modelNameLoweCase = model.name.toLowerCase();
  return {
    contents: `
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
var pluralize = require('pluralize')
import { ${capitalizeFirstLetter(
      modelNameLoweCase
    )}Controller } from "./controllers/${pluralize
      .plural(model.name)
      .toLowerCase()}.controller";
${generateBelongToControllerImports(modelChildrenNames)}      

type GenericObject = { [key: string]: any };
const controllerName = "${pluralize.plural(model.name).toLowerCase()}";
const ID_CHECK = "_id";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenericObject>
) {
  let ${modelNameLoweCase}Controller = new ${capitalizeFirstLetter(
      modelNameLoweCase
    )}Controller();
  const requestMethod = req.method;

  switch (requestMethod) {
    case "POST":
      ${
        model.operations.CREATE
          ? `${modelNameLoweCase}Controller.create(req, res);`
          : "//TODO:Implement custom post"
      }
      break;

    case "GET":
      ${generateBelongToRoutes(model.name, modelChildrenNames)}
      if (req.query.id) {
        ${
          model.operations.READ
            ? `${modelNameLoweCase}Controller.findOne(req, res);`
            : "//TODO:Implement custom get when id param passed"
        }
        return;
      }
      let queryObjString = JSON.stringify(req.query);
      if (queryObjString.includes(ID_CHECK)) {
        const modelName = Object.keys(req.query).find((key)=>key.includes(ID_CHECK))?.split(ID_CHECK)[0];
        ${modelNameLoweCase}Controller.findAllBelongTo(req, res, modelName || "");
        return;
      }
      ${
        model.operations.READ
          ? `${modelNameLoweCase}Controller.findAll(req, res);`
          : "//TODO:Implement custom get"
      }
      break;

    case "PUT":
      ${
        model.operations.UPDATE
          ? `${modelNameLoweCase}Controller.update(req, res);`
          : "//TODO:Implement custom put"
      }
      break;

    case "DELETE":
      ${
        model.operations.DELETE
          ? `${modelNameLoweCase}Controller.delete(req, res);`
          : "//TODO:Implement custom delete"
      }
      break;

    default:
      break;
  }
}
`,
    fileName,
  };
};

export const CONTROLLER_CLASS = (
  modelName: string,
  controllerMethods: string
) => {
  let fileName = `${pluralize.plural(modelName).toLowerCase()}.controller.ts`;
  return {
    contents: `import { NextApiRequest, NextApiResponse } from "next";
    import { parseDate } from "../../../utils/general.utils";
    import { ${capitalizeFirstLetter(
      modelName
    )}Model } from "../models/${pluralize
      .plural(modelName)
      .toLocaleLowerCase()}.model";
    type GenericObject = { [key: string]: any };
    
    const DEFAULT_ERROR_MESSAGE = "An error occurred please try again later.";
    
    export class ${capitalizeFirstLetter(modelName)}Controller {
      constructor() {}
      ${controllerMethods}
     
    }
    `,
    fileName,
  };
};

export const MODEL_CLASS = (modelName: string, modelMethods: string) => {
  let fileName = `${pluralize.plural(modelName).toLowerCase()}.model.ts`;
  let lowerCaseModelName = modelName.toLowerCase();
  return {
    contents: `import { sql } from "../db/db";
    type GenericObject = { [key: string]: any };
    
    export class ${capitalizeFirstLetter(lowerCaseModelName)}Model {
      constructor() {}
    ${modelMethods}
     
    }    
    `,
    fileName,
  };
};

export const CREATE_CONTROLLER_METHOD = (modelName: string) => {
  let lowerCaseModelName = modelName.toLowerCase();
  return `
  create(req: NextApiRequest, res: NextApiResponse<GenericObject>) {
    const ${lowerCaseModelName}Model = new ${capitalizeFirstLetter(
    lowerCaseModelName
  )}Model();
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
    }
    ${lowerCaseModelName}Model
      .create(req.body)
      .then((${lowerCaseModelName}) => res.status(201).send(${lowerCaseModelName}))
      .catch((err) => {
        res.status(422).send({
          message: err.message || DEFAULT_ERROR_MESSAGE,
        });
      });
  }
  `;
};

export const UPDATE_CONTROLLER_METHOD = (modelName: string) => {
  let lowerCaseModelName = modelName.toLowerCase();
  return `
  update(req: NextApiRequest, res: NextApiResponse<GenericObject>) {
    const ${lowerCaseModelName}Model = new ${capitalizeFirstLetter(
    lowerCaseModelName
  )}Model();
    const id = req.query.id || "0";
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
    }
    ${lowerCaseModelName}Model
      .update(Number(id), req.body)
      .then((${lowerCaseModelName}) => res.status(200).send(${lowerCaseModelName}))
      .catch((err) => {
        res.status(422).send({
          message: err.message || DEFAULT_ERROR_MESSAGE,
        });
      });
  }
  `;
};

export const DELETE_CONTROLLER_METHOD = (modelName: string) => {
  let lowerCaseModelName = modelName.toLowerCase();
  return `
    async delete(req: NextApiRequest, res: NextApiResponse<GenericObject>) {
        const ${lowerCaseModelName}Model = new ${capitalizeFirstLetter(
    lowerCaseModelName
  )}Model();
        const id = req.query.id || "0";
        const ${lowerCaseModelName} = await ${lowerCaseModelName}Model.findById(Number(id));
        ${lowerCaseModelName}Model
          .update(Number(id), { ...${lowerCaseModelName}, deleted_at: parseDate(new Date())})
          .then((resp) => res.status(200).send(resp))
          .catch((err) => {
            res.status(422).send({
              message: err.message || DEFAULT_ERROR_MESSAGE,
            });
          });
      }
    `;
};

export const FIND_ONE_CONTROLLER_METHOD = (modelName: string) => {
  let lowerCaseModelName = modelName.toLowerCase();
  return `
    findOne(req: NextApiRequest, res: NextApiResponse<GenericObject>) {
        const ${lowerCaseModelName}Model = new ${capitalizeFirstLetter(
    lowerCaseModelName
  )}Model();
        const id = req.query.id || "0";
        ${lowerCaseModelName}Model
          .findById(Number(id))
          .then((${lowerCaseModelName}) => res.status(200).send(${lowerCaseModelName}))
          .catch((err) => {
            res.status(422).send({
              message: err.message || DEFAULT_ERROR_MESSAGE,
            });
          });
      }
    `;
};

export const FIND_ALL_CONTROLLER_METHOD = (modelName: string) => {
  let lowerCaseModelName = modelName.toLowerCase();
  return `
  findAll(req: NextApiRequest, res: NextApiResponse<GenericObject>) {
  const ${lowerCaseModelName}Model = new ${capitalizeFirstLetter(
    lowerCaseModelName
  )}Model();
  ${lowerCaseModelName}Model
      .findByAll()
      .then((${pluralize.plural(
        lowerCaseModelName
      )}) => res.status(200).send(${pluralize.plural(lowerCaseModelName)}))
      .catch((err) => {
        res.status(422).send({
          message: err.message || DEFAULT_ERROR_MESSAGE,
        });
      });
    }
      `;
};

export const FIND_ALL_THAT_BELONG_TO_CONTROLLER_METHOD = (
  modelName: string
) => {
  let lowerCaseModelName = modelName.toLowerCase();
  return `
    findAllBelongTo(req: NextApiRequest, res: NextApiResponse<GenericObject>,parentModelName:string ) {
        const ${lowerCaseModelName}Model = new ${capitalizeFirstLetter(
    lowerCaseModelName
  )}Model();
        const id = req.query[\`\${parentModelName}_id\`] || 0;
        ${lowerCaseModelName}Model
          .findByAllThatBelongTo(Number(id),parentModelName)
          .then((${pluralize.plural(
            lowerCaseModelName
          )}) => res.status(200).send(${pluralize.plural(lowerCaseModelName)}))
          .catch((err) => {
            res.status(422).send({
              message: err.message || DEFAULT_ERROR_MESSAGE,
            });
          });
      }`;
};

export const CREATE_MODEL_METHOD = (modelName: string) => {
  let lowerCaseModelName = modelName.toLowerCase();
  return `
    create(${lowerCaseModelName}: GenericObject): Promise<GenericObject> {
        return new Promise((resolve, reject) => {
          sql.query(
            \`INSERT INTO ${pluralize.plural(lowerCaseModelName)} SET ?\`,
            ${lowerCaseModelName},
            (err: any, res: GenericObject) => {
              if (err) {
                console.log("error: ", err);
                reject(err);
                return;
              }
              resolve({ id: res.insertId, ...${lowerCaseModelName} });
            }
          );
        });
      }`;
};

function getUpdateQuery(
  fields: Field[],
  modelName: string,
  parentModelKeyNames: string[]
) {
  let parentModelSubQuery =
    parentModelKeyNames.map((keyName) => `, ${keyName} = ?`).join("") || "";
  let updateQuery = "SET ";
  fields.forEach((field) => {
    updateQuery += ` ${field.name} = ?,`;
  });
  updateQuery += ` deleted_at = ? ${parentModelSubQuery} WHERE id = ?",\n[`;
  fields.forEach((field) => {
    updateQuery += `${modelName.toLowerCase()}.${field.name},`;
  });
  const parentModelIds = parentModelKeyNames
    .map((parentModelId) => `${modelName.toLowerCase()}.${parentModelId}`)
    .join(","); //TODO: should definitely find a better name for the variables in this function
  return (
    updateQuery +
    `${modelName.toLowerCase()}.deleted_at, ${
      parentModelIds ? parentModelIds + "," : ""//TODO:needs some cleanup
    } id],`
  );
}

export const UPDATE_MODEL_METHOD = (
  fields: Field[],
  modelName: string,
  parentModels?: string[]
) => {
  let lowerCaseModelName = modelName.toLowerCase();
  let parentModelKeyNames =
    parentModels?.map((modelName) => `${modelName.toLowerCase()}_id`) || [];
  return `
    update(id: number, ${lowerCaseModelName}: GenericObject): Promise<GenericObject> {
        return new Promise((resolve, reject) => {
          console.log("updating", ${lowerCaseModelName})
          if (!${lowerCaseModelName}.deleted_at) {
            ${lowerCaseModelName}.deleted_at = null;
          }
          console.log("updating", ${lowerCaseModelName})
          sql.query(
            "UPDATE ${pluralize.plural(lowerCaseModelName)}  ${getUpdateQuery(
    fields,
    modelName,
    parentModelKeyNames
  )}
            (err: GenericObject, res: GenericObject) => {
              if (err) {
                console.log("error: ", err);
                reject(err);
                return;
              }
    
              if (res.affectedRows == 0) {
                reject({ message: "Record not found" });
                return;
              }
    
              resolve({ id, ...${lowerCaseModelName} });
            }
          );
        });
      }`;
};

export const FIND_ALL_MODEL_METHOD = (modelName: string) => {
  let lowerCaseModelName = modelName.toLowerCase();
  return `
    findByAll(): Promise<GenericObject> {
    return new Promise((resolve, reject) => {
        sql.query(
          \`SELECT * FROM ${pluralize.plural(
            lowerCaseModelName
          )} WHERE deleted_at is NULL\`,
          (err: GenericObject, res: GenericObject) => {
            if (err) {
              reject(err);
              return;
            }
  
            resolve(res);
          }
        );
      });
    }`;
};

export const FIND_ONE_MODEL_METHOD = (modelName: string) => {
  let lowerCaseModelName = modelName.toLowerCase();
  return `
    findById(id: number): Promise<GenericObject> {
      return new Promise((resolve, reject) => {
        sql.query(
          \`SELECT * FROM ${pluralize.plural(
            lowerCaseModelName
          )} WHERE id = \${id} AND deleted_at is NULL\`,
          (err: GenericObject, res: GenericObject) => {
            if (err) {
              reject(err);
              return;
            }
  
            if (res.length) {
              resolve(res[0]);
              return;
            }
  
            // not found Tutorial with the id
            reject({ message: "Record not found" });
          }
        );
      });
    }`;
};

export const FIND_ALL_THAT_BELONG_TO_MODEL_METHOD = (modelName: string) => {
  let tableName = pluralize.plural(modelName.toLowerCase());
  return `
    findByAllThatBelongTo(id: number, parentModelName:string): Promise<GenericObject[]> {
      return new Promise((resolve, reject) => {
        sql.query(
          \`SELECT * FROM ${tableName} WHERE \${parentModelName}_id = \${id} AND deleted_at is NULL\`,
          (err: GenericObject, res: GenericObject[]) => {
            if (err) {
              reject(err);
              return;
            }
  
            resolve(res);
          }
        );
      });
    }`;
};
