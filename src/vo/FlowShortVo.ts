import { AuditGroup } from "../database/model/AuditGroup";
import { Flow } from "../database/model/Flow";

export class FlowShortVo {
  id: number;
  title: string;
  aduitors: AuditGroup;
  constructor(flow: Flow, auditors: AuditGroup) {
    this.id = flow.id;
    this.title = flow.title;
    this.aduitors = auditors;
  }
}
