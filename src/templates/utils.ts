export const HANDLE_REQUEST = () => {
  return {
    contents: `type GenericObject = { [key: string]: any };
    export function handleRequest(
      path: string,
      requestType: string,
      body: GenericObject
    ) {
      return new Promise((resolve, reject) => {
        let obj: GenericObject = {
          method: requestType,
          body: JSON.stringify(body),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        if (obj.method == "GET") {
          delete obj.body;
        }
    
        //TODO: read url and port from config file
        fetch(\`http://localhost:3000/api/\${path}\`, obj)
          .then((response) => response.json())
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });
    }
    `,
    fileName: "api.utils.ts",
    path: "path",
  };
};

export const GENERAL_UTILS = () => {
  return {
    contents: `
    import moment from "moment";
    import { MODEL_SETUP } from "../constants/general.constants";
import { Field, GeneralObject } from "../types/general.types";
var pluralize = require("pluralize");
export function parseDate(date: Date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
}
function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}
export function isDateTime(value: string | number) {
  var formats = [moment.ISO_8601];
  return (
    value.toString().includes("Z") && moment(value, formats, true).isValid()
  );
}
export function formatDate(dateTimeString: string | number) {
  return moment(dateTimeString).format("DD/MM/YY hh:mm:ss");
}
export function formatServerDate(dateTimeString: string | number) {
  return moment(dateTimeString).format("DD/MM/YYYY hh:mm:ss");
}
export function getCurrentDateTime() {
  const currentDateTime = new Date();
  return {
    date: moment(currentDateTime).format("YYYY-MM-DD"),
    time: moment(currentDateTime).format("hh:mm:ss"),
  };
}
export function convertToDateTimeInputObject(dateTime: string) {
  return {
    date: moment(dateTime).format("YYYY-MM-DD"),
    time: moment(dateTime).format("hh:mm:ss"),
  };
}
export function getFieldProperties(fieldName: string, modelName: string):Field {
  return (
    getModel(modelName)?.fields?.find((field) => field.name == fieldName) || {
      isIdentifier: false,
      name: fieldName,
      required: false,
      type: "unknown",
      visibleOnList: false,
    }
  );
}

export function getHeaderProperties(modelName: string) {
  return getModel(modelName)?.fields.map((field) => field.name);
}
export function getModel(modelName: string) {
  return MODEL_SETUP.find(
    (model) =>
      pluralize.singular(model.name.toLowerCase()) ==
      pluralize.singular(modelName.toLowerCase())
  );
  
}
export function getJoinQuery(modelName: string): string {
  let parentModels = getParentModelNames(modelName);
  if (!parentModels || !parentModels.length) return "";
  return (
    parentModels
      ?.map(
        (parentModel) =>
          \`,(select name from \${parentModel} where id = \${modelName}.\${getParentIdColumnName(
            parentModel
          )} ) as \${getParentModelIdentifier(parentModel)}\`
      )
      .join("") || ""
  );
}
export function getParentIdColumnName(parentModel: string) {
  return \`\${pluralize.singular(parentModel)}_id\`;
}
function getParentModelNames(modelName: string) {
  return MODEL_SETUP.find((model) => model.name == modelName)?.belongsTo.map((parentModelName)=>pluralize.plural(parentModelName)) || [];
}
export function getParentModelIdentifier(parentModel: string) {
  let identifierField = getModel(parentModel)?.fields.find(
    (field) => field.isIdentifier
  );
  if (identifierField) {
    return \`\${pluralize.singular(parentModel)}_\${identifierField.name}\`;
  } else {
    return \`\${pluralize.singular(parentModel)}_identifier\`;
  }
}

export function getParentIdentifierNames(modelName: string) {
  return getParentModelNames(modelName).map((parentModelName) =>
    getParentModelIdentifier(parentModelName)
  );
}
export function validateForm(
  apiControllerName: string,
  formData: GeneralObject
) {
  let formErrors: string[] = [];
  MODEL_SETUP.find(
    (model) => model.name.toLowerCase() == apiControllerName.toLowerCase()
  )?.fields.forEach((field) => {
    if(field.required && !formData[field.name]){
      formErrors.push(field.name);
    }
  });
  return formErrors;
}
export function trimText(text:string | number, max:number){
  if(text.toString().length > max){
    return \`\${text.toString().substring(0,max)}...\`;
  }else{
    return text;
  }
}`,
    fileName: "general.utils.ts",
    path: "path",
  };
};
