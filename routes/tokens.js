const router = require("express").Router();
const controller = require("../controllers/token");
const { validateLoginSession, validateAdmin } = require("./auth");

router.post(
  "/prizes",
  validateLoginSession,
  validateAdmin,
  controller.initiatePrizes
);
module.exports = router;
