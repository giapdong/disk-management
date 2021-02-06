import { Router } from "express";
import { TestRouter } from "./api/test.api";
import { SystemPartition } from "./api/system-partition.api";

const router: Router = Router();

router.use("/api", new TestRouter().getRouter());
router.use("/api", new SystemPartition().getRouter());

export const ApiRouter: Router = router;
