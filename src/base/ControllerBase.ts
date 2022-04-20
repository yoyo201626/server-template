import { Express } from "express";

export const errorCode = 500;
export abstract class ControllerBase {
  constructor(app: Express) {
    this.insert(app);
  }
  insert(app: Express) {}
}

export class Response {
  success: boolean;
  result: any;
  constructor(success: boolean, result?: any) {
    this.success = success;
    this.result = result;
  }
  static getSuccessInstance(result?: any): Response {
    return new Response(true, result);
  }
  static getFaildInstance(result?: any): Response {
    return new Response(false, result);
  }
}

class Point {
  // Overloads
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any) {
    // TBD
  }
}
