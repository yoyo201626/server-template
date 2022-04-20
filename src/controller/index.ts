import { Express } from "express";
import FlowController from "./FlowController";

export function insertController(app: Express): void {
  new FlowController(app);
}
