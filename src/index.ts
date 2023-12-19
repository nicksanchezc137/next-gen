#!/usr/bin/env node

import { CONFIG_FILE_NAME, PROJECT_COMMANDS } from "./constants";
import Executor from "./executor";
import { MainConfig } from "./types";
import { runShellCommand } from "./utils/commands.utils";
import { readFile } from "./utils/files.utils";
import { platform } from "process";

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

clear();
console.log(
  chalk.green(figlet.textSync("Next-Gen", { horizontalLayout: "full" }))
);

async function launchProcess() {
  const config = await readFile(CONFIG_FILE_NAME);
  runShellCommand("npm i create-next-app@13.0.2 -g", () => {
    generateProject(config?.projectName, () => {
      console.log("Next step!!!");
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
    `create-next-app ${projectName} --eslint --ts --use-npm -S && cd ${projectName} && npm i next@13.1.1 && npm run dev`, //TODO: Next JS automatically generates version 14 of Next JS. We need to specify it to 13.1.1 to avoid incompatibility with code.
    (error: string, stderr: string, stdout: string) => {
      console.log(error, stderr);
      if (!error) {
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
  console.log("cloning json-generator...");
  runShellCommand(
    "git clone https://github.com/nicksanchezc137/json-generator.git && cd json-generator && npm install && npm run dev",
    () => {
      const URL = "http://localhost:8087";
      launchOnBrowser(URL);
    }
  );
}
function logAfterTimeOut(log: string, delay: number) {
  setTimeout(() => {
    console.log(log);
  }, delay * 1000);
}
function launchOnBrowser(urlToOpen: string) {
  // Determine the appropriate command based on the operating system
  let openCommand;
  if (platform === "darwin") {
    openCommand = "open";
  } else if (platform === "win32") {
    openCommand = "start";
  } else {
    openCommand = "xdg-open";
  }

  // Open the default browser with the specified URL
  runShellCommand(`${openCommand} ${urlToOpen}`, () => {});
}
