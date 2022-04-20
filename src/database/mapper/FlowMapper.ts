import { Flow } from "../model/Flow";
import { MapperBase } from "../../base/MapperBase";

export class FlowMapper extends MapperBase implements Flow {
  tableName: string = Flow.tableName;
  title: string;
  stage: string;
  context: any[];
  id: number;
  auditGroupId: number;
  constructor() {
    super();
    this.context = null;
    this.title = null;
    this.stage = null;
    this.id = null;
    this.auditGroupId = null;
  }
}
export const flowMapper = new FlowMapper();
