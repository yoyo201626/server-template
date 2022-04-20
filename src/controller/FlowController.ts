import { Express } from "express";
import { ControllerBase, Response } from "../base/ControllerBase";
import { myNosql } from "../database";
import { flowMapper } from "../database/mapper/FlowMapper";
import { auditGroupMapper } from "../database/mapper/AuditGroupMapper";
import { FlowShortVo } from "../vo/FlowShortVo";
import { FlowVo } from "../vo/FlowVo";
import Mock from "mockjs";

export default class FlowController extends ControllerBase {
  insert(app: Express) {
    app.route("/flows").get(async (req, res, next) => {
      await myNosql.read();
      const flows = flowMapper.getList();
      const result = flows.map((flow) => {
        const auditGroup = auditGroupMapper.getById(flow.auditGroupId);
        auditGroup.aduitors = Mock.mock({ "array|1-4": ["@name"] })["array"];
        return new FlowShortVo(flow, auditGroup);
      });
      res.type("application/json");
      res.json(Response.getSuccessInstance(result));
      res.end();
    });
    app.route("/flow").post(async (req, res, next) => {
      const body = req.body;
      await myNosql.read();
      flowMapper.setByModelId(body);
      await myNosql.write();
      res.type("application/json");
      res.json(Response.getSuccessInstance());
      res.end();
    });
    app.route("/flow").get(async (req, res, next) => {
      await myNosql.read();
      const flow = flowMapper.getById(Number(req.query.id));
      const auditGroup = auditGroupMapper.getById(flow.auditGroupId);
      auditGroup.aduitors = Mock.mock({ "array|1-4": ["@name"] })["array"];
      const result = new FlowVo(flow, auditGroup);
      res.type("application/json");
      res.json(Response.getSuccessInstance(result));
      res.end();
    });
    app.route("/flow").delete(async (req, res, next) => {
      await myNosql.read();
      flowMapper.delById(Number(req.query.id));
      await myNosql.write();
      res.type("application/json");
      res.json(Response.getSuccessInstance());
      res.end();
    });
  }
}
