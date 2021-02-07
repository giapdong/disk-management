import { ARouter } from "../../common/ARouter";
import * as TestService from "../../service/test.service";

export class TestRouter extends ARouter {
  constructor() {
    super("TestRouter");
  }

  registerRouters() {
    this.router.get("/test", TestService.test);
  }
}
