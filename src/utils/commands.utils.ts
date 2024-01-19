var exec = require("child_process").exec;

export function runShellCommand(
  shellCommand: string,
  callBack: Function,
  dir?: string,
  input?: string, // Add input parameter,
  log?:string
) {
  const childProcess = exec(
    shellCommand,
    { cwd: dir ? dir : process.cwd() },
    function (error: any, stdout: any, stderr: any) {
      if (stderr) {
        console.error("Error", stderr);
        callBack(error, stderr, stdout);
        return
      }
      if (error) {
        console.error("Error", error);
        callBack(error, stderr, stdout);
        return;
      }
      console.log(log);
      console.log(stdout);
      callBack(error, stderr, stdout);
    }
  );
  if (input) {
    childProcess.stdin.write(input);
    childProcess.stdin.end();
  }
}
