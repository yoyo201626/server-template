import { NextFunction, Request, Response, RequestHandler } from "express";
import { blue, bold, underline } from "colorette";

export const logMiddleware = function (option: any): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(`method: ${bold(blue(req.method))} url: ${underline(req.url)}`);
    next();
  };
};
