import express from "express";

export abstract class ARouter {
  router: express.Router;
  name: string;

  constructor(name: string) {
    this.router = express.Router();
    this.name = name;

    this.registerRouters();
  }

  getName() {
    return this.name;
  }

  getRouter() {
    return this.router;
  }

  abstract registerRouters(): void;
}
