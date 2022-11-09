import { MainConfig } from "../types";

const fs = require("fs");
const prettier = require("prettier");

async function readFile(fileName: string):Promise<MainConfig> {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err: any, data: string) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
}
function projectDirectory(projectName: string) {
  return `${process.cwd()}/${projectName}`;
}

function formatCode(code: string, filePath: string) {
  return prettier.format(code, { semi: true, filepath: filePath });
}

export function createDirIfNotExist(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

async function writeFile(
  contents: string,
  fileName: string,
  projectName:string,
  directory?: string,
  parse?: boolean
) {
  directory = `${projectDirectory(projectName)}/${directory}`;
  createDirIfNotExist(directory);
  const filePath = `${directory}/${fileName}`;
  //TODO: read config file setting to know file path
  return new Promise((resolve, reject) => {
    let code = parse ? formatCode(contents, filePath) : contents;
    fs.writeFile(filePath, code, (err: any) => {
      if (err) {
        return console.log(err);
      }
      resolve(true);
    });
  });
}

export { readFile, writeFile, projectDirectory };
