import { join, dirname, normalize } from "path";
import { JSONFile, Low } from "lowdb";
import fs from "fs";
import { Flow, tableName as FlowTableName } from "./model/Flow";
import {
  AuditGroup,
  tableName as AuditGroupTableName,
} from "./model/AuditGroup";
// defind model
export type Data = {
  [FlowTableName]: Flow[];
  [AuditGroupTableName]: AuditGroup[];
};
const file = join(dirname(import.meta.url), "data.json").replace(
  /(file:\\|\/)/,
  ""
);
// const file = new URL('./data.json', dirname(import.meta.url))
if (!fs.existsSync(file)) {
  fs.mkdirSync(dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    JSON.stringify({
      [FlowTableName]: [],
      [AuditGroupTableName]: [],
    })
  );
}
const adapter = new JSONFile<Data>(file);

export const myNosql = new Low<Data>(adapter);
