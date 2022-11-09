export const HANDLE_REQUEST = () => {
  return {
    contents: `type GenericObject = { [key: string]: any };
    export function handleRequest(
      path: string,
      requestType: string,
      body: GenericObject
    ) {
      return new Promise((resolve, reject) => {
        let obj: GenericObject = {
          method: requestType,
          body: JSON.stringify(body),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        if (obj.method == "GET") {
          delete obj.body;
        }
    
        //TODO: read url and port from config file
        fetch(\`http://localhost:3000/api/\${path}\`, obj)
          .then((response) => response.json())
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });
    }
    `,
    fileName: "api.utils.ts",
    path: "path",
  };
};

export const GENERAL_UTILS = () => {
  return {
    contents: `
    export function formatDate(date: Date) {
      return (
        [
          date.getFullYear(),
          padTo2Digits(date.getMonth() + 1),
          padTo2Digits(date.getDate()),
        ].join("-") +
        " " +
        [
          padTo2Digits(date.getHours()),
          padTo2Digits(date.getMinutes()),
          padTo2Digits(date.getSeconds()),
        ].join(":")
      );
    }
    function padTo2Digits(num: number) {
      return num.toString().padStart(2, "0");
    }
    
    `,
    fileName: "general.utils.ts",
    path: "path",
  };
};
