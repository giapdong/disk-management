const router = require("express").Router();
const service = require("./service.js");

router.use("/test", service.test);
router.get("/os/partition", service.getSystemPartition);

module.exports = router;
