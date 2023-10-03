// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { NEXT_JSON } from "../../utils/general.utils";
const { exec } = require("child_process");
const fs = require("fs");
const prettier = require("prettier");
import path from "path";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {
    let NEXT_JSON_DATA: NEXT_JSON = req.body.json;
    let project_path = req.body.json;
    if (NEXT_JSON_DATA) {
      //generate the json file
      fs.writeFile(
        project_path,
        formatCode(JSON.stringify(NEXT_JSON_DATA)),
        (err: any) => {
          if (err) {
            return console.log(err);
          }
          generateProject(project_path);
        }
      );
    }
  }
  res.status(200).json({ name: "John Doe" });
}

function formatCode(code: string) {
  return prettier.format(code, { semi: true });
}

function generateProject(path: string) {
  exec("next-gen", { cwd: path }, (error: any, stdout: any, stderr: any) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}
