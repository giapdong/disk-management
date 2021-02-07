import express from "express";
import Formatter from "response-format";
import { readSystemPartition } from "../../lib/index";

export async function getSystemPartition(req: express.Request, res: express.Response) {
  let data = await readSystemPartition();
  res.json(Formatter.success("Get info partition success", data));
}
