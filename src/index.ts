#! /usr/bin/env node

import { CONFIG_FILE_NAME, IN_PROJECT_COMMANDS } from "./constants";
import Executor from "./Executor";
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
  generateProject(config?.projectName, () => {
    runProjectCommands(config?.projectName, () => {
      generateProjectFiles(config);
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
    `npx create-next-app ${projectName} --eslint --ts --use-npm`,
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
        IN_PROJECT_COMMANDS[index],
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
  runCommand(index, IN_PROJECT_COMMANDS);
}
launchProcess();

//This works great for me:


//dockerized version that uses docker compose
//passport auth
//one class that will handle next gen json validation
//logging as processes happen
//error handling eg. if unable to access DB
//automatically run after finishing setup
//add select to pick parent from child and update 
//add fields types. select and date.

//use theme https://www.behance.net/gallery/18218871/Simply-Dashboard-Flat-design