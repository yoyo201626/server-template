import { ModelBase } from "../../base/ModelBase";

export const tableName = "auditGroup";
export class AuditGroup extends ModelBase {
  static tableName: string = tableName;
  aduitors: string[];
  constructor() {
    super();
    this.id = null;
    this.aduitors = null;
  }
}
