import { ARouter } from "../../common/ARouter";
import * as SystemPartitionService from "../../service/system-partition.service";

export class SystemPartition extends ARouter {
  constructor() {
    super("SystemPartition");
  }

  registerRouters() {
    this.router.get("/system/partition", SystemPartitionService.getSystemPartition);
  }
}
