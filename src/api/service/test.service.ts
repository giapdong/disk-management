import express from "express";
import Formatter from "response-format";

export function test(req: express.Request, res: express.Response) {
  res.json(Formatter.success());
}
