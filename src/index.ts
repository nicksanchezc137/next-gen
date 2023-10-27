#!/usr/bin/env node

import { CONFIG_FILE_NAME, PROJECT_COMMANDS } from "./constants";
import Executor from "./executor";
import { MainConfig } from "./types";
import { runShellCommand } from "./utils/commands.utils";
import { readFile } from "./utils/files.utils";

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const path = require("path");
const program = require("commander");

clear();
console.log(
  chalk.red(figlet.textSync("Next-Gen", { horizontalLayout: "full" }))
);

async function launchProcess() {
  const config = await readFile(CONFIG_FILE_NAME);
  runShellCommand("npm i create-next-app@13.0.2 -g", () => {
    generateProject(config?.projectName, () => {
      runProjectCommands(config?.projectName, () => {
        generateProjectFiles(config);
        runShellCommand(`cd ${config?.projectName} && npm run dev`, () => {
          console.log("Exiting...");
        });
      });
    });
  });
}

function generateProjectFiles(config: MainConfig) {
  console.log("Creating project files...");
  const executor = new Executor(config);
  executor.execute();
  console.log("Files created successfully ✔️");
}

async function generateProject(projectName: string, callBack: Function) {
  console.log(`Generating Next JS project in folder ${projectName}...`);
  runShellCommand(
    `create-next-app ${projectName} --eslint --ts --use-npm`,
    (error: string, stderr: string, stdout: string) => {
      if (!error && !stderr) {
        console.log("Next JS project created successfully ✔️");
        callBack();
      }
    }
  );
}

function runProjectCommands(projectName: string, callBack: Function) {
  console.log("Installing required dependencies...");
  var index = 0;
  function runCommand(index: number, commands: string[]) {
    if (index < commands.length) {
      runShellCommand(
        PROJECT_COMMANDS[index],
        () => {
          runCommand((index += 1), commands);
        },
        `${process.cwd()}/${projectName}`
      );
    } else {
      callBack();
      console.log("Installed dependencies successfully ✔️");
      return;
    }
  }
  runCommand(index, PROJECT_COMMANDS);
}

const args = process.argv.slice(2);

if (args[0] == "generate") {
  launchProcess();
} else if (args[0] == "ui") {
  runShellCommand(
    "git clone https://github.com/nicksanchezc137/json-generator.git && cd json-generator && npm install && npm run dev",
    () => {
      // runShellCommand("cd json-generator && npm install", () => {
      //   runShellCommand("npm run dev", () => {});
      // });
    }
  );
}
