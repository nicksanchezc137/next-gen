import {
  CREATE_BELONGS_TO_RELATIONSHIP,
  CREATE_TABLE,
} from "../templates/schema";
import { Model } from "../types";

export class SchemaGenerator {
  models: Model[];
  dropTables:boolean;

  constructor(models: Model[],dropTables:boolean) {
    this.models = models;
    this.dropTables = dropTables;
  }

  generateCreateTableSchema(model: Model) {
    return CREATE_TABLE(model,this.dropTables);
  }
  generateCreateTablesSchema(models: Model[]) {
    let createTablesSchema = "";
    models.forEach((model) => {
      createTablesSchema += this.generateCreateTableSchema(model);
    });
    return createTablesSchema;
  }

  generateTableRelationshipsSchema(model: Model) {
    let createRelationshipsSchema = "";
    model.belongsTo.forEach((primaryModelName) => {
      createRelationshipsSchema += CREATE_BELONGS_TO_RELATIONSHIP(
        primaryModelName,
        model.name
      );
    });
    return createRelationshipsSchema;
  }
  generateTablesRelationshipsSchema(models: Model[]) {
    let createRelationshipsSchema = "";
    models.forEach((model) => {
      createRelationshipsSchema += this.generateTableRelationshipsSchema(model);
    });
    return createRelationshipsSchema;
  }

  generateMainSchema() {
    return `${this.generateCreateTablesSchema(this.models)}\n
      ${this.generateTablesRelationshipsSchema(this.models)}`;
  }
}
