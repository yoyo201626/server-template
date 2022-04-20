import { ModelBase } from "../../base/ModelBase";
export const tableName = "flow";
export class Flow extends ModelBase {
  static tableName: string = tableName;
  title: string;
  stage: string;
  auditGroupId: number;
  context: Array<any>;
  constructor() {
    super();
    this.id = null;
    this.stage = null;
    this.context = null;
    this.auditGroupId = null;
  }
}
