var exec = require("child_process").exec;

export function runShellCommand(
  shellCommand: string,
  callBack: Function,
  dir?: string
) {
  exec(
    shellCommand,
    { cwd: dir ? dir : process.cwd() },
    function (error: any, stdout: any, stderr: any) {
      if(stderr){
        console.error("Error", stderr);
      }
      if(error){
        console.error("Error", error);
      }
      console.log(stdout);
      callBack(error, stderr, stdout);
    }
  );
}
