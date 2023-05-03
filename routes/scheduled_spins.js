const router = require("express").Router();
const spinController = require("../controllers/scheduled_spins");
const { validateLoginSession, validateAdmin } = require("./auth");

router.get("/", validateLoginSession, validateAdmin, spinController.get);
router.post("/", validateLoginSession, validateAdmin, spinController.get);
router.get("/:id", validateLoginSession, validateAdmin, spinController.get);
router.put("/:id", validateLoginSession, validateAdmin, spinController.get);
module.exports = router;
