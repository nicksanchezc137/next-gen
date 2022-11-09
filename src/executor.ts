import { APIGenerator } from "./generators/api-generator";
import { ComponentGenerator } from "./generators/component-generator";
import { ConfigGenerator } from "./generators/config-generator";
import { SchemaGenerator } from "./generators/schema-generator";
import { UIGenerator } from "./generators/ui-generator";
import { UtilsGenerator } from "./generators/utils-generator";
import { FileToGenerate, MainConfig, MarkUp, Model } from "./types";
import { writeFile } from "./utils/files.utils";
import { runQuery } from "./utils/sql.utils";
const pluralize = require("pluralize");

export default class Executor {
  mainConfig: MainConfig;

  constructor(mainConfig: MainConfig | any) {
    this.mainConfig = mainConfig;
  }

  execute() {
    this.generateFiles();
  }
  generateFiles() {
    const uiGenerator = new UIGenerator(this.mainConfig.models);
    this.generatePages(uiGenerator.getAllPagesMarkUp());

    const schemaGenerator = new SchemaGenerator(
      this.mainConfig.models,
      this.mainConfig.dropTables
    );
    this.generateSchema(schemaGenerator.generateMainSchema());

    const apiGenerator = new APIGenerator(this.mainConfig);
    this.generateApiFiles(apiGenerator.generateAPIs());

    const componentGenerator = new ComponentGenerator();
    this.generateComponentFiles(componentGenerator.generateComponents());

    const utilsGenerator = new UtilsGenerator();
    this.generateUtilFiles(utilsGenerator.generateUtilsCode());

    const configGenerator = new ConfigGenerator();
    this.generateConfigFiles(configGenerator.generateConfigs());
  }

  async generatePages(pages: MarkUp[]) {
    //TODO: create type to merge markup and page
    for (let page of pages) {
      await this.generatePage(page.contents, page.fileName, page.modelName);
    }
    //generate APIS
  }
  async generateApiFiles(apiFiles: FileToGenerate[]) {
    //TODO: create type to merge markup and page
    for (let apiFile of apiFiles) {
      await this.generateApiFile(apiFile);
    }
  }

  async generateSchema(contents: string) {
    runQuery(
      contents,
      (results: any, err: any) => {
         if(results){
          console.log("Generated DB schema successfully ✔️");
         }
         if(err){
          console.log(err);
         }
      },
      this.mainConfig
    );
    return writeFile(
      contents,
      "main-schema.sql",
      this.mainConfig.projectName,
      `pages/api`
    );
  }

  async generatePage(contents: string, fileName: string, modelName: string) {
    return writeFile(
      contents,
      fileName,
      this.mainConfig.projectName,
      `pages/${pluralize.plural(modelName).toLowerCase()}`,
      true
    );
  }

  async generateApiFile(apiFile: FileToGenerate) {
    const { contents, fileName, path } = apiFile;
    return writeFile(
      contents,
      fileName,
      this.mainConfig.projectName,
      `pages/api/${path}`,
      true
    );
  }

  async generateUtilFiles(utilFiles: FileToGenerate[]) {
    for (let file of utilFiles) {
      const { contents, fileName, path } = file;
      await writeFile(
        contents,
        fileName,
        this.mainConfig.projectName,
        "utils/"
      );
    }
  }

  async generateComponentFiles(componentFiles: any[]) {
    for (let file of componentFiles) {
      const { contents, fileName } = file;
      await writeFile(
        contents,
        fileName,
        this.mainConfig.projectName,
        "components/"
      );
    }
  }

  async generateConfigFiles(files: any) {
    for (let file of files) {
      const { contents, fileName, path } = file;
      await writeFile(contents, fileName, this.mainConfig.projectName, path);
    }
  }
}
