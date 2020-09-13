const router = require("express").Router();
const service = require("./service.js");

router.use("/test", service.test);

module.exports = router;
