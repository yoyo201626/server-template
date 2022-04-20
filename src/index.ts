import express, { Express } from "express";
import { logMiddleware } from "./middleware/log-middleware/index";
import { validatorMiddleware } from "./middleware/validator-middleware/index";
import { insertController } from "./controller/index";
import { Response } from "./base/ControllerBase";

import { Server } from "http";

export let portLstener: Server;
export function startServer(callback?: Function) {
  const app = express();
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  // 日志
  app.use(logMiddleware({}));
  // 验证
  app.use(validatorMiddleware);

  // 控制层
  insertController(app);

  // 404
  app.all("*", (req, res, next) => {
    res.type("application/json");
    res.status(404).json(Response.getFaildInstance());
  });
  portLstener && portLstener.close();
  portLstener = app.listen("3000", function () {
    console.log("Mock Server is running at http://localhost:3000");
    callback && callback();
  });
}

// 监听
startServer();
