import { FIELD_TYPE_MAPPING } from "../constants";
import { Field, Model } from "../types";
const pluralize = require("pluralize");

function isNull(isNull: boolean): string {
  return isNull ? "" : "NOT NULL";
}
function getFieldType(type: string): string {
  return FIELD_TYPE_MAPPING[type.toUpperCase()].db;
}
function getFieldsMarkUp(fields: Field[]) {
  let fieldsMarkup = "";
  fields.forEach((field) => {
    fieldsMarkup += `${field.name} ${getFieldType(field.type)} ${isNull(
      field.required
    )},`;
  });
  return fieldsMarkup;
}
function includeTimeStamps(includeTimeStamps: boolean): string {
  return includeTimeStamps
    ? `created_at timestamp NULL DEFAULT current_timestamp(),
updated_at timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),`
    : "";
}

export const CREATE_TABLE = (model: Model, dropTable:boolean) => {
  const tableName = pluralize(model.name).toLowerCase();
  const dropQuery = dropTable?`DROP TABLE IF EXISTS ${tableName};`:""

  return `
${dropQuery}
CREATE TABLE ${tableName} (
id int NOT NULL AUTO_INCREMENT,
${getFieldsMarkUp(model.fields)}
${includeTimeStamps(model.includeTimeStamps)}
deleted_at timestamp NULL DEFAULT NULL,
PRIMARY KEY (id));\n\n`;
};

export const CREATE_BELONGS_TO_RELATIONSHIP = (
  primaryModelName: string,
  secondaryModelName: string
) => {
  const primaryTableName = pluralize(primaryModelName).toLowerCase();
  const secondaryTableName = pluralize(secondaryModelName).toLowerCase();
  const primaryKey = `${pluralize.singular(primaryModelName.toLowerCase())}_id`;

  return `
ALTER TABLE ${secondaryTableName}
ADD COLUMN ${primaryKey} INT NOT NULL,
ADD CONSTRAINT fk_${primaryModelName}_${secondaryModelName}
FOREIGN KEY (${primaryKey}) REFERENCES ${primaryTableName}(id);`;
};
