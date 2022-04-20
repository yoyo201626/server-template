import { Flow } from "../database/model/Flow";
import { AuditGroup } from "../database/model/AuditGroup";

export class FlowVo extends Flow {
  aduitors: AuditGroup;
  constructor(flow: Flow, auditors: AuditGroup) {
    super();
    this.stage = flow.stage;
    this.context = flow.context;
    this.id = flow.id;
    this.auditGroupId = flow.auditGroupId;
    this.title = flow.title;
    this.aduitors = auditors;
  }
}
