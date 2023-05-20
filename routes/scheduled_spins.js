const router = require("express").Router();
const spinController = require("../controllers/scheduled_spins");
const { validateLoginSession, validateAdmin } = require("./auth");

router.get("/", validateLoginSession, validateAdmin, spinController.get);
router.post("/", validateLoginSession, validateAdmin, spinController.create);
router.put("/:id", validateLoginSession, validateAdmin, spinController.update);
router.get(
  "/next",
  validateLoginSession,
  validateAdmin,
  spinController.nextSpin
);
module.exports = router;
