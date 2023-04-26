const router = require("express").Router();
const paymentsController = require("../controllers/payments");
const { validateWalletId, validateLoginSession } = require("./auth");

router.get("/", validateLoginSession, paymentsController.getPayments);
router.get("/stats", validateWalletId, paymentsController.paymentStats);
module.exports = router;
