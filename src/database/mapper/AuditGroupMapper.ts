import { AuditGroup } from "../model/AuditGroup";
import { MapperBase } from "../../base/MapperBase";

export class AuditGroupMapper extends MapperBase implements AuditGroup {
  tableName: string = AuditGroup.tableName;
  id: number;
  aduitors: string[];
  constructor() {
    super();
    this.id = null;
    this.aduitors = null;
  }
}
export const auditGroupMapper = new AuditGroupMapper();
