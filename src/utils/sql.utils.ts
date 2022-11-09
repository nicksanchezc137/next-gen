import { MainConfig } from "../types";

const mysql = require("mysql");

var sql = (mainConfig: MainConfig) => {
  const {host, user, password,database}  =  mainConfig.db;
  return mysql.createPool({
    host,
    user,
    password,
    database,
    multipleStatements: true,
  });
};

export function runQuery(
  sqlQuery: string,
  callback: Function,
  mainConfig: MainConfig
) {
  sql(mainConfig).query(sqlQuery, (err: any, res: any) => {
    if (err) {
      console.log("error: ", err);
      callback(null, err);
      return;
    }
    callback(res, null);
  });
}
