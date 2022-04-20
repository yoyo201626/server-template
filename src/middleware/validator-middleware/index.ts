import { NextFunction, Request, Response } from "express";

export const validatorMiddleware = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
};
