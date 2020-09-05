const router = require("express").Router();
const service = require("./service.js");
const path = require("path");

router.use("/test", service.test);

// Match all router if not exist
router.get("*", function(req, res, next) {
  return res.sendFile(path.join(__dirname, "public/dist/index.html"));
});

module.exports = router;
