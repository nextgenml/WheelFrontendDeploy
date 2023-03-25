const router = require("express").Router();
const spinWheelController = require("../controllers/spinWheel");

router.get("/next-users", spinWheelController.getNextSpinEligibleUsers);
module.exports = router;
