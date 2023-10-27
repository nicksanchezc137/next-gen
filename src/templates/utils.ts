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
    import moment from "moment";
export function parseDate(date: Date) {
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
export function isDateTime(value: string | number) {
  var formats = [moment.ISO_8601];
  return (
    value.toString().includes("Z") && moment(value, formats, true).isValid()
  );
}
export function formatDate(dateTimeString: string | number) {
  return moment(dateTimeString).format("DD/MM/YY hh:mm:ss");
}
export function formatServerDate(dateTimeString: string | number) {
  return moment(dateTimeString).format("DD/MM/YYYY hh:mm:ss");
}
export function getCurrentDateTime() {
  const currentDateTime = new Date();
  return {
    date: moment(currentDateTime).format("YYYY-MM-DD"),
    time: moment(currentDateTime).format("hh:mm:ss"),
  };
}
export function convertToDateTimeInputObject(dateTime:string) {
  return {
    date: moment(dateTime).format("YYYY-MM-DD"),
    time: moment(dateTime).format("hh:mm:ss"),
  };
}
    `,
    fileName: "general.utils.ts",
    path: "path",
  };
};
